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

        access_token = body['access_token']
        code = body['code']

        verify = cognitoIdentityProviderWrapper.verify(
            access_token=access_token, code=code)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(verify)}

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

    def verify(self, *, access_token, code):
        """更新コードの検証

        Args:
            access_token (str): アクセストークン
            code (str): 確認コード


        Returns:
            bool: True
        """
        try:
            kwargs = {
                'AccessToken': access_token,
                'AttributeName': 'email',
                'Code': code
            }

            response = self.cognito_idp_client.verify_user_attribute(**kwargs)
            logger.info(f'verify_user_attribute: {response}')

            return True

        except Exception as err:
            raise RuntimeError(
                "cognito server error: Couldn't confirm verify_user_attribute.") from err
