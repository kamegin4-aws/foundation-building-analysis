import base64
import hashlib
import hmac
import json
import logging
import os
import traceback
from datetime import datetime, timedelta

import boto3
import pytz
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    logger.debug(f'Received event: {json.dumps(event, indent=2)}')

    try:

        if ('body' in event):
            body = json.loads(event['body'])
            # body = event['body']

        user_pool_id = os.environ['USER_POOL_ID']

        client_id = os.environ['CLIENT_ID']

        client_secret = os.environ['CLIENT_SECRET']

        cognitoIdentityProviderWrapper = CognitoIdentityProviderWrapper(
            user_pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret)

        refresh_token = body['refresh_token']
        user_name = body['user_name']

        refresh_token_result = cognitoIdentityProviderWrapper.refresh_token(
            user_name=user_name, refresh_token=refresh_token)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(
                cognitoIdentityProviderWrapper.toEntity(
                    tokens=refresh_token_result['AuthenticationResult'],
                    refresh_token=refresh_token))}

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


class CognitoIdentityProviderWrapper:
    """Cognitoのラッパークラス
    """

    def __init__(
            self,
            *,
            user_pool_id,
            client_id,
            client_secret=None):
        """初期化

        Args:
            user_pool_id (str): User Pool Id
            client_id (str): User Pool Application Client Id
            client_secret (str, optional): Application Client Secrets
        """
        self.cognito_idp_client = boto3.client('cognito-idp')
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def secret_hash(self, *, user_name):
        """_summary_
        ハッシュ値の生成
        Args:
            user_name (str): ユーサーネーム

        Returns:
            str: ハッシュ値
        """
        message = bytes(user_name + self.client_id, 'utf-8')
        key = bytes(self.client_secret, 'utf-8')
        secret_hash = base64.b64encode(
            hmac.new(
                key,
                message,
                digestmod=hashlib.sha256).digest()).decode()

        return secret_hash

    def refresh_token(self, *, refresh_token, user_name):
        """トークンのリフレッシュ

        Args:
            refresh_token (str): リフレッシュトークン
            user_name (str): ユーザー名

        Returns:
            dict: cognito-idpのレスポンス
        """
        try:
            kwargs = {
                'AuthFlow': 'REFRESH_TOKEN',
                'AuthParameters': {'REFRESH_TOKEN': refresh_token},
                'ClientId': self.client_id,
            }
            if self.client_secret is not None:
                kwargs['AuthParameters']['SECRET_HASH'] = self.secret_hash(
                    user_name=user_name)

            response_init = self.cognito_idp_client.initiate_auth(**kwargs)
            logger.info(f'refresh token: {response_init}')

        except ClientError as err:
            logger.error(
                "Couldn't start client sign in for %s. Here's why: %s: %s",
                user_name,
                err.response['Error']['Code'],
                err.response['Error']['Message'],
            )
            raise RuntimeError(
                "cognito server error: {}.".format(
                    traceback.format_exc())) from err

        return response_init

    def toEntity(self, *, tokens, refresh_token=''):
        """_summary_
        エンティティに変換する
        Args:
            tokens (dict): cognito_idp_clientのレスポンス
            refresh_token (str,options): リフレッシュトークン

        Returns:
            dict: Userンティティ
        """
        entity = {}

        entity['access_token'] = tokens['AccessToken']
        entity['refresh_token'] = tokens['RefreshToken'] if 'RefreshToken' in tokens else refresh_token
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
