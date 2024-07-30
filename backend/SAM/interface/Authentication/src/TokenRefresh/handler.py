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
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(refresh_token_result)}

    except Exception:
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(
                traceback.format_exc())}


class CognitoIdentityProviderWrapper:
    """Encapsulates Amazon Cognito actions"""

    def __init__(
            self,
            *,
            user_pool_id,
            client_id,
            client_secret=None):
        """
        :param cognito_idp_client: A Boto3 Amazon Cognito Identity Provider client.
        :param user_pool_id: The ID of an existing Amazon Cognito user pool.
        :param client_id: The ID of a client application registered with the user pool.
        :param client_secret: The client secret, if the client has a secret.
        """
        self.cognito_idp_client = boto3.client(
            'cognito-idp', region_name='ap-northeast-1')
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.client_secret = client_secret

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

    def refresh_token(self, *, refresh_token, user_name):
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
            auth_tokens = response_init['AuthenticationResult']

        except ClientError as err:
            logger.error(
                "Couldn't start client sign in for %s. Here's why: %s: %s",
                user_name,
                err.response['Error']['Code'],
                err.response['Error']['Message'],
            )
            raise RuntimeError(
                "cognito server error: Couldn't confirm sign up for {}.".format(user_name)) from err

        return auth_tokens
