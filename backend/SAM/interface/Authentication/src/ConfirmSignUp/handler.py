import base64
import hashlib
import hmac
import json
import logging
import os
import traceback

import boto3

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
        code = body['code']

        confirmed_signup = cognitoIdentityProviderWrapper.confirm_sign_up(
            user_name=user_name, confirmation_code=code)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(confirmed_signup)}

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
    """Cognito のラッパークラス
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

    def confirm_sign_up(self, *, user_name, confirmation_code):
        """確認コードの検証

        Args:
            user_name (str): ユーザー名
            confirmation_code (str): 確認コード


        Returns:
            bool: True
        """
        try:
            kwargs = {
                'ClientId': self.client_id,
                'Username': user_name,
                'ConfirmationCode': confirmation_code
            }
            if self.client_secret is not None:
                kwargs['SecretHash'] = self.secret_hash(user_name=user_name)
            response = self.cognito_idp_client.confirm_sign_up(**kwargs)
            logger.info(f'confirm_sign_up: {response}')

        except Exception as err:
            raise RuntimeError(
                "cognito server error: {}.".format(
                    traceback.format_exc())) from err

        return True
