import json
import boto3
import os
import logging
from cgi import parse_header, parse_multipart
import traceback
import io

logger = logging.getLogger(__name__)


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))

    try:
        if ("body" in event):
            if 'content-type' in event['headers'].keys():
                c_type, c_data = parse_header(event['headers']['content-type'])
            elif 'Content-Type' in event['headers'].keys():
                c_type, c_data = parse_header(event['headers']['Content-Type'])
            else:
                raise RuntimeError('content-type or Content-Type not found')

            if c_type == "multipart/form-data":
                encoded_string = event['body'].encode('utf-8')
                # For Python 3: these two lines of bugfixing are mandatory
                # see also:
                # https://stackoverflow.com/questions/31486618/cgi-parse-multipart-function-throws-typeerror-in-python-3
                c_data['boundary'] = bytes(c_data['boundary'], "utf-8")
                # c_data['CONTENT-LENGTH'] = event['headers']['Content-length']
                data_dict = parse_multipart(io.BytesIO(encoded_string), c_data)

                # 整形
                body = {k: v[0] for k, v in data_dict.items()}

                print(f'c_type: {c_type}.')
                print(f'body: {body}.')
            else:
                body = json.loads(event["body"])
                # body = event["body"]

        cognito_idp_client = boto3.client(
            "cognito-idp", region_name="ap-northeast-1")

        user_pool_id = os.environ["USER_POOL_ID"]
        # user_pool_id = ""

        client_id = os.environ["CLIENT_ID"]

        client_secret = os.environ["CLIENT_SECRET"]

        cognitoIdentityProviderWrapper = CognitoIdentityProviderWrapper(
            cognito_idp_client=cognito_idp_client,
            user_pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret)

        access_token = body["access_token"]

        get_user = cognitoIdentityProviderWrapper.get_user(
            access_token=access_token)

        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"},
            'body': json.dumps(get_user)}

    except Exception:
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"},
            'body': json.dumps(
                traceback.format_exc())}


class CognitoIdentityProviderWrapper:
    """Encapsulates Amazon Cognito actions"""

    def __init__(
            self,
            *,
            cognito_idp_client,
            user_pool_id,
            client_id,
            client_secret=None):
        """
        :param cognito_idp_client: A Boto3 Amazon Cognito Identity Provider client.
        :param user_pool_id: The ID of an existing Amazon Cognito user pool.
        :param client_id: The ID of a client application registered with the user pool.
        :param client_secret: The client secret, if the client has a secret.
        """
        self.cognito_idp_client = cognito_idp_client
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def get_user(self, *, access_token):
        try:
            kwargs = {
                "AccessToken": access_token,
            }
            response = self.cognito_idp_client.get_user(
                **kwargs)
            print(f'get_user: {response}')

            return response

        except Exception as err:
            raise RuntimeError("Couldn't get user") from err
