import json
import logging
import os
import traceback
from datetime import datetime, timedelta

import boto3
import pytz
from pycognito.aws_srp import AWSSRP

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    logger.debug(f'Received event: {json.dumps(event, indent=2)}')

    try:

        if ('body' in event):
            body = json.loads(event['body'])
            # body = event["body"]

        user_pool_id = os.environ['USER_POOL_ID']

        client_id = os.environ['CLIENT_ID']

        client_secret = os.environ['CLIENT_SECRET']

        user_name = body['user_name']
        password = body['password']

        aws_srp_wrapper = AWSSRPWrapper(
            pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret,
        )

        sign_in = aws_srp_wrapper.sign_in(
            username=user_name, password=password)

        access_token = sign_in['AuthenticationResult']['AccessToken']

        user = aws_srp_wrapper.get_user(access_token=access_token)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(
                aws_srp_wrapper.toEntity(
                    tokens=sign_in['AuthenticationResult'],
                    user_attributes=user))}

    except Exception:
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(
                traceback.format_exc())}


class AWSSRPWrapper:
    """AWSSRPのラッパークラス
    """

    def __init__(
            self,
            *,
            pool_id,
            client_id,
            client_secret=None
    ):
        """初期化

        Args:
            user_pool_id (str): User Pool Id
            client_id (str): User Pool Application Client Id
            client_secret (str, optional): Application Client Secrets
        """
        self.client = boto3.client('cognito-idp', region_name='ap-northeast-1')
        self.pool_id = pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def sign_in(self, *, username, password):
        """サインイン

        Args:
            username (str): ユーザー名
            password (str): パスワード


        Returns:
            dict: AWSSRPのレスポンス
        """
        try:
            kwargs = {
                'username': username,
                'password': password,
                'pool_id': self.pool_id,
                'client_id': self.client_id,
                'client': self.client,
                'client_secret': self.client_secret,
            }
            aws = AWSSRP(**kwargs)
            tokens = aws.authenticate_user()
            logger.info(f'sign_in: {tokens}')

            return tokens

        except Exception:
            raise RuntimeError(
                'cognito server error: {}'.format(traceback.format_exc()))

    def get_user(self, *, access_token):
        """ユーザー情報の取得

        Args:
            access_token (str): アクセストークン


        Returns:
            dict: cognito-idpのレスポンス
        """
        try:
            kwargs = {
                'AccessToken': access_token,
            }
            response = self.client.get_user(
                **kwargs)
            logger.info(f'get_user: {response}')

            return response

        except Exception as err:
            raise RuntimeError(
                "cognito server error: {}".format(
                    traceback.format_exc())) from err

    def toEntity(self, *, tokens, user_attributes):
        """_summary_
        エンティティに変換する
        Args:
            tokens (dict): AWSSRPのレスポンス
            user_attributes (dict) cognito-idpのレスポンス

        Returns:
            dict: Userンティティ
        """
        entity = {}
        entity['user_name'] = user_attributes['Username']
        for attribute in user_attributes['UserAttributes']:
            if attribute['Name'] == 'sub':
                entity['user_id'] = attribute['Value']
                continue

            if ':' in attribute['Name']:
                entity[attribute['Name'].split(
                    ':')[1]] = attribute['Value']
                continue
            entity[attribute['Name']] = attribute['Value']

        entity['access_token'] = tokens['AccessToken']
        entity['refresh_token'] = tokens['RefreshToken']
        entity['id_token'] = tokens['IdToken']

        # 現在の時間を取得
        date = datetime.now()

        # 指定された秒数を追加
        date = date + timedelta(seconds=int(tokens['ExpiresIn']))

        # 日本標準時（JST）に変換
        jst = pytz.timezone('Asia/Tokyo')
        date = date.astimezone(jst)

        # 日時を日本のロケール形式で文字列として出力
        entity['expires'] = date.strftime('%Y/%m/%d %H:%M:%S')

        return entity
