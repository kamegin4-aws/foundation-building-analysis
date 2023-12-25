import json
import boto3
import os
import logging
import hmac
import hashlib
import base64

logger = logging.getLogger(__name__)


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))

    try:

        if ("body" in event):
            # body = event["body"]
            body = json.loads(event["body"])

        cognito_idp_client = boto3.client(
            "cognito-idp", region_name="ap-northeast-1")

        user_pool_id = os.environ["USER_POOL_ID"]

        client_id = os.environ["CLIENT_ID"]

        client_secret = os.environ["CLIENT_SECRET"]

        cognitoIdentityProviderWrapper = CognitoIdentityProviderWrapper(
            cognito_idp_client=cognito_idp_client,
            user_pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret)

        user_name = body["user_name"]
        code = body["code"]

        confirmed_signup = cognitoIdentityProviderWrapper.confirm_sign_up(
            user_name=user_name, confirmation_code=code)

        return {
            'statusCode': 200,
            'body': json.dumps(confirmed_signup)
        }

    except MyError as err:
        logger.error(err)
        return {
            'statusCode': 501,
            'body': json.dumps(err.value)
        }
    except Exception as err:
        logger.error(err)
        return {
            'statusCode': 500,
            'body': json.dumps("Internal server error")
        }


class CognitoIdentityProviderWrapper:
    """Encapsulates Amazon Cognito actions"""

    def __init__(
            self,
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

    def secret_hash(self, user_name):
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

    def confirm_sign_up(self, user_name, confirmation_code):
        try:
            kwargs = {
                "ClientId": self.client_id,
                "Username": user_name,
                "ConfirmationCode": confirmation_code
            }
            if self.client_secret is not None:
                kwargs["SecretHash"] = self.secret_hash(user_name=user_name)
            response = self.cognito_idp_client.confirm_sign_up(**kwargs)
            print(response)

        except Exception as err:
            raise MyError(
                "Couldn't confirm sign up for {}.".format(user_name)) from err

        return True


class MyError(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)
