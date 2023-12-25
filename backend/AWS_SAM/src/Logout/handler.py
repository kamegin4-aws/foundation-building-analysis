import json
import boto3
import os
import logging

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

        access_token = body["access_token"]

        print("access_token: {}".format(access_token))

        sign_out = cognitoIdentityProviderWrapper.sign_out(
            access_token=access_token)

        return {
            'statusCode': 200,
            'body': json.dumps(sign_out)
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


class MyError(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)


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

    def sign_out(self, access_token):
        try:
            kwargs = {
                "AccessToken": access_token
            }
            response = self.cognito_idp_client.global_sign_out(**kwargs)
            print(response)

            return True

        except Exception as err:
            raise MyError("Couldn't sign out") from err
