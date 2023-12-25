import json
import boto3
import os
import logging
from pycognito.aws_srp import AWSSRP


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

        user_name = body["user_name"]
        password = body["password"]

        aws_srp_wrapper = AWSSRPWrapper(
            pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret,
            client=cognito_idp_client)

        sign_in = aws_srp_wrapper.sign_in(user_name, password)

        return {
            'statusCode': 200,
            'body': json.dumps(sign_in)
        }

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


class AWSSRPWrapper:
    """AWSSRPのラッパークラス
    """

    def __init__(
            self,
            pool_id,
            client_id,
            client_secret=None,
            client=None,
    ):
        self.client = client
        self.pool_id = pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def sign_in(self, username, password):
        try:
            kwargs = {
                "username": username,
                "password": password,
                "pool_id": self.pool_id,
                "client_id": self.client_id,
                "client": self.client,
                "client_secret": self.client_secret,
            }
            aws = AWSSRP(**kwargs)
            tokens = aws.authenticate_user()
            print(tokens)

            return tokens["AuthenticationResult"]

        except Exception as err:
            raise MyError(
                "Couldn't sign in for {}.".format(username)) from err


class MyError(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)
