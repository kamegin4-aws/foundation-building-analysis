import json
# import boto3
# import os
import logging

logger = logging.getLogger(__name__)


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))

    try:
        '''
        if ("body" in event):
            # body = event["body"]
            body = json.loads(event["body"])

        user_pool_id = os.environ["USER_POOL_ID"]

        client_id = os.environ["CLIENT_ID"]

        client_secret = os.environ["CLIENT_SECRET"]

        cognito_idp_client = boto3.client(
            "cognito-idp", region_name="ap-northeast-1")

        cognitoIdentityProviderWrapper = CognitoIdentityProviderWrapper(
            cognito_idp_client=cognito_idp_client,
            user_pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret)

        attributes = body["attributes"]
        access_token = (event["headers"]["Authorization"]).split()[-1]

        update_user_attributes = cognitoIdentityProviderWrapper.update_user_attributes(
            access_token=access_token, attributes=attributes)

        return {
            'statusCode': 200,
            'body': json.dumps(update_user_attributes)
        }
        '''

        return {}

    except MyError as err:
        logger.error(err)
        return {
            'statusCode': 500,
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

    def update_user_attributes(self, access_token, attributes=[]):
        """_summary_

        Args:
            access_token (string): アクセストークン
            attributes (list, optional): {'Name':string,'Value':string}の配列. Defaults to [].
        """

        if (len(attributes) == 0):
            raise MyError("attributes is empty")

        kwargs = {
            "AccessToken": access_token,
            "UserAttributes": attributes
        }
        response = self.cognito_idp_client.update_user_attributes(**kwargs)

        return response
