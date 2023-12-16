import json
import boto3
from botocore.exceptions import ClientError
import os
import logging
import hmac
import hashlib
import base64

logger = logging.getLogger(__name__)


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))

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
    password = body["password"]
    user_email = body["user_email"]

    confirmed = cognitoIdentityProviderWrapper.sign_up_user(
        user_name=user_name, password=password, user_email=user_email)

    return {
        'statusCode': 200,
        'body': json.dumps(confirmed)
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

    def sign_up_user(self, user_name, password, user_email):
        """
        Signs up a new user with Amazon Cognito. This action prompts Amazon Cognito
        to send an email to the specified email address. The email contains a code that
        can be used to confirm the user.

        When the user already exists, the user status is checked to determine whether
        the user has been confirmed.

        :param user_name: The user name that identifies the new user.
        :param password: The password for the new user.
        :param user_email: The email address for the new user.
        :return: True when the user is already confirmed with Amazon Cognito.
                 Otherwise, false.
        """
        try:
            kwargs = {
                "ClientId": self.client_id,
                "Username": user_name,
                "Password": password,
                "UserAttributes": [{"Name": "email", "Value": user_email}],
            }
            if self.client_secret is not None:
                kwargs["SecretHash"] = self.secret_hash(user_name=user_name)
            response = self.cognito_idp_client.sign_up(**kwargs)
            confirmed = response["UserConfirmed"]
        except ClientError as err:
            if err.response["Error"]["Code"] == "UsernameExistsException":
                response = self.cognito_idp_client.admin_get_user(
                    UserPoolId=self.user_pool_id, Username=user_name
                )

                logger.warning(
                    "User %s exists and is %s.",
                    user_name,
                    response["UserStatus"])

                errorMassage = 'User {} exists and is {}.'.format(
                    user_name, response["UserStatus"])
                confirmed = response["UserStatus"] == "CONFIRMED"
            else:
                logger.error(
                    "Couldn't sign up %s. Here's why: %s: %s",
                    user_name,
                    err.response["Error"]["Code"],
                    err.response["Error"]["Message"],
                )

                errorMassage = "Couldn't sign up {}. Here's why: {}: {}".format(
                    user_name, err.response["Error"]["Code"], err.response["Error"]["Message"])
                raise

            return {
                'statusCode': 500,
                'body': json.dumps(errorMassage)
            }

        return confirmed

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
