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

        get_user = cognitoIdentityProviderWrapper.get_user(
            access_token=access_token)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(
                cognitoIdentityProviderWrapper.toEntity(
                    response=get_user))}

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
    """Cognito ラッパークラス
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

    def get_user(self, *, access_token):
        """ユーザー情報の取得

        Args:
            access_token (str): アクセストークン

        Returns:
            dict: cognito-idpのレスポンス
        """
        try:
            kwargs = {
                'AccessToken': access_token,
            }
            response = self.cognito_idp_client.get_user(
                **kwargs)
            logger.info(f'get_user: {response}')

            return response

        except Exception as err:
            raise RuntimeError(
                "cognito server error: {}".format(
                    traceback.format_exc())) from err

    def toEntity(self, *, response):
        """エンティティに変換する
        Args:
            response (dict): cognito_idp_clientのレスポンス

        Returns:
            dict: Userンティティ
        """
        attributes = {}
        attributes['user_name'] = response['Username']
        for attribute in response['UserAttributes']:
            if attribute['Name'] == 'sub':
                attributes['user_id'] = attribute['Value']
                continue

            if ':' in attribute['Name']:
                attributes[attribute['Name'].split(
                    ':')[1]] = attribute['Value']
                continue
            attributes[attribute['Name']] = attribute['Value']

        return attributes
