import json
import boto3
from botocore.exceptions import ClientError
import os
import logging
import hmac
import hashlib
import base64
from cgi import parse_header, parse_multipart
import traceback
import io

logger = logging.getLogger(__name__)


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))

    try:

        if ('body' in event):
            if 'content-type' in event['headers'].keys():
                c_type, c_data = parse_header(event['headers']['content-type'])
            elif 'Content-Type' in event['headers'].keys():
                c_type, c_data = parse_header(event['headers']['Content-Type'])
            else:
                raise RuntimeError('content-type or Content-Type not found')

            if c_type == 'multipart/form-data':
                encoded_string = event['body'].encode('utf-8')
                # For Python 3: these two lines of bugfixing are mandatory
                # see also:
                # https://stackoverflow.com/questions/31486618/cgi-parse-multipart-function-throws-typeerror-in-python-3
                c_data['boundary'] = bytes(c_data['boundary'], 'utf-8')
                # c_data['CONTENT-LENGTH'] = event['headers']['Content-length']
                data_dict = parse_multipart(io.BytesIO(encoded_string), c_data)

                # 整形
                body = {k: v[0] for k, v in data_dict.items()}

                print(f'c_type: {c_type}.')
                print(f'body: {body}.')
            else:
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
            cognito_idp_client=None,
            client_secret=None):
        """
        :param cognito_idp_client: A Boto3 Amazon Cognito Identity Provider client.
        :param user_pool_id: The ID of an existing Amazon Cognito user pool.
        :param client_id: The ID of a client application registered with the user pool.
        :param client_secret: The client secret, if the client has a secret.
        """
        self.cognito_idp_client = cognito_idp_client if cognito_idp_client is not None else boto3.client(
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
            print(f'refresh token: {response_init}')
            auth_tokens = response_init['AuthenticationResult']
        except ClientError as err:
            logger.error(
                "Couldn't start client sign in for %s. Here's why: %s: %s",
                user_name,
                err.response['Error']['Code'],
                err.response['Error']['Message'],
            )
            raise RuntimeError(
                "Couldn't confirm sign up for {}.".format(user_name)) from err

        return auth_tokens
