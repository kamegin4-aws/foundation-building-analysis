
from cgi import parse_header, parse_multipart
import json
import boto3
import os
import logging
import io
import traceback
from pycognito.aws_srp import AWSSRP


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

                print("c_type: {}.".format(c_type))
                print("body: {}.".format(body))
            else:
                body = json.loads(event["body"])
                # body = event["body"]

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
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"},
            'body': json.dumps(sign_in)}

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

        except Exception:
            raise RuntimeError("Cognito(pycognito.aws_srp) Error")
