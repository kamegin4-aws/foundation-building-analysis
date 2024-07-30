

import json
import logging
import os
import traceback

import boto3
from pycognito.aws_srp import AWSSRP

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

        user_name = body['user_name']
        password = body['password']

        aws_srp_wrapper = AWSSRPWrapper(
            pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret,
        )

        sign_in = aws_srp_wrapper.sign_in(
            username=user_name, password=password)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(sign_in)}

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


class AWSSRPWrapper:
    """AWSSRPのラッパークラス
    """

    def __init__(
            self,
            *,
            pool_id,
            client_id,
            client_secret=None
    ):
        self.client = boto3.client('cognito-idp', region_name='ap-northeast-1')
        self.pool_id = pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def sign_in(self, *, username, password):
        try:
            kwargs = {
                'username': username,
                'password': password,
                'pool_id': self.pool_id,
                'client_id': self.client_id,
                'client': self.client,
                'client_secret': self.client_secret,
            }
            aws = AWSSRP(**kwargs)
            tokens = aws.authenticate_user()
            logger.info(f'sign_in: {tokens}')

            return tokens['AuthenticationResult']

        except Exception:
            raise RuntimeError(
                'cognito server error: Cognito(pycognito.aws_srp) Error')
