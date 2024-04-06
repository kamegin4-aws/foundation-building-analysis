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
                # body = event["body"]

        user_pool_id = os.environ['USER_POOL_ID']
        # user_pool_id = ""

        client_id = os.environ['CLIENT_ID']

        client_secret = os.environ['CLIENT_SECRET']

        cognitoIdentityProviderWrapper = CognitoIdentityProviderWrapper(
            user_pool_id=user_pool_id,
            client_id=client_id,
            client_secret=client_secret)

        group_name = body['group_name']

        user_list = []
        next_token = None
        list_users_in_group = cognitoIdentityProviderWrapper.list_users_in_group(
            group_name=group_name)

        # 1週目
        if ('Users' in list_users_in_group and len(
                list_users_in_group['Users'])):
            user_list.extend(list_users_in_group['Users'])

        # 次のトークン
        if 'NextToken' in list_users_in_group and list_users_in_group['NextToken']:
            next_token = list_users_in_group['NextToken']

        # 次のトークンがあるか、"Users"が0以上ならば繰り返す
        while next_token is not None and 'Users' in list_users_in_group and len(
                list_users_in_group['Users']) > 0:
            # 2周目以降
            list_users_in_group = cognitoIdentityProviderWrapper.list_users_in_group(
                group_name=group_name, next_token=next_token)
            if 'NextToken' in list_users_in_group and list_users_in_group['NextToken']:
                next_token = list_users_in_group['NextToken']
            else:
                break
            if 'Users' in list_users_in_group and len(
                    list_users_in_group["Users"]) > 0:
                user_list.extend(list_users_in_group['Users'])

        if len(user_list) > 0:
            user_list = check_list_users_in_group(user_list)

        list_users_in_group = {
            'Users': user_list
        }

        print(f'list_users_in_group: {list_users_in_group}')

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'},
            'body': json.dumps(list_users_in_group)}

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

    def list_users_in_group(self, *, group_name, limit=60, next_token=None):
        try:
            kwargs = {
                'UserPoolId': self.user_pool_id,
                'GroupName': group_name,
                'Limit': int(limit)
            }
            if next_token:
                kwargs['NextToken'] = next_token
            response = self.cognito_idp_client.list_users_in_group(
                **kwargs)
            print(f'list_users_in_group: {response}')

            return response

        except Exception as err:
            raise RuntimeError(
                "cognito server error: Couldn't list user in group") from err


def check_list_users_in_group(list_user):
    """
    'Enabled'がFalseのものを除外する
    'UserCreateDate','UserLastModifiedDate'を文字列に変換する

    Args:
        list_user (Array): list_users_in_group['Users']

    Returns:
        Array: list_users_in_group['Users']
    """
    # print(f'list_user: {list_user}')
    checked_user = [user for user in list_user if user['Enabled'] is True]

    for i, user in enumerate(checked_user):
        if 'UserCreateDate' in user:
            user['UserCreateDate'] = user['UserCreateDate'].strftime(
                '%Y-%m-%d %H:%M:%S')
        if 'UserLastModifiedDate' in user:
            user['UserLastModifiedDate'] = user['UserLastModifiedDate'].strftime(
                '%Y-%m-%d %H:%M:%S')

    return checked_user
