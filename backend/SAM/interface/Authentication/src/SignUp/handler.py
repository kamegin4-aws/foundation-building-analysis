import base64
import hashlib
import hmac
import json
import logging
import os
import traceback

import boto3
from botocore.exceptions import ClientError

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

        cognitoIdentityProviderWrapper = CognitoIdentityProviderWrapper(
            user_pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret)

        user_name = body['user_name']
        password = body['password']
        user_email = body['user_email']
        plan_name = body['plan_name']

        confirmed = cognitoIdentityProviderWrapper.sign_up_user(
            user_name=user_name,
            password=password,
            user_email=user_email,
            plan_name=plan_name)

        return {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(
                cognitoIdentityProviderWrapper.toEntity(
                    response=confirmed))}

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

    def sign_up_user(self, *, user_name, password, user_email, plan_name):
        """サインアップ

        Args:
            user_name (str): ユーザー名
            password (str): パスワード
            user_email (str): Eメール
            plan_name (str): プラン名


        Returns:
            dict: cognito-idpのレスポンス
        """
        try:
            kwargs = {'ClientId': self.client_id,
                      'Username': user_name,
                      'Password': password,
                      'UserAttributes': [{'Name': 'email',
                                          'Value': user_email},
                                         {'Name': 'custom:plan',
                                          'Value': plan_name}],
                      }
            if self.client_secret is not None:
                kwargs['SecretHash'] = self.secret_hash(user_name=user_name)
            response = self.cognito_idp_client.sign_up(**kwargs)
            logger.info(f'sign_up: {response}')

        except ClientError as err:
            if err.response['Error']['Code'] == 'UsernameExistsException':
                response = self.cognito_idp_client.admin_get_user(
                    UserPoolId=self.user_pool_id, Username=user_name
                )

                logger.warning(
                    'User %s exists and is %s.',
                    user_name,
                    response['UserStatus'])

                error_massage = 'User {} exists and is {}.'.format(
                    user_name, response['UserStatus'])
            else:
                logger.error(
                    "Couldn't sign up %s. Here's why: %s: %s",
                    user_name,
                    err.response['Error']['Code'],
                    err.response['Error']['Message'],
                )

                error_massage = "Couldn't sign up {}. Here's why: {}: {}".format(
                    user_name, err.response['Error']['Code'], err.response['Error']['Message'])
            raise RuntimeError(
                f'cognito server error: {error_massage}') from err

        return response

    def secret_hash(self, *, user_name):
        """_summary_
        ハッシュ値の生成
        Args:
            user_name (string): ユーサーネーム

        Returns:
            string: ハッシュ値
        """
        message = bytes(user_name + self.client_id, 'utf-8')
        key = bytes(self.client_secret, 'utf-8')
        secret_hash = base64.b64encode(
            hmac.new(
                key,
                message,
                digestmod=hashlib.sha256).digest()).decode()

        return secret_hash

    def toEntity(self, *, response):
        """_summary_
        エンティティに変換する
        Args:
            response (dict): cognito_idp_clientのレスポンス

        Returns:
            dict: Userンティティ
        """
        entity = {}
        entity['user_id'] = response['UserSub']

        return entity
