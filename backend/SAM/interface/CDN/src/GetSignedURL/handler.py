import json
import logging
import os
import re
import traceback
from datetime import datetime, timedelta
from enum import Enum

import boto3
import pytz
from botocore.signers import CloudFrontSigner
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class ServiceName(Enum):
    ObjectData = 0


def handler(event, context):
    logger.debug(f'Received event: {json.dumps(event, indent=2)}')

    try:
        if 'body' in event:
            body = json.loads(event['body'])

        parameter_name = os.environ['PARAMETER_NAME']
        key_id = os.environ['KEY_ID']
        distribution_domain = os.environ['DISTRIBUTION_DOMAIN']

        s3_path = body['s3_path']
        version_id = body['version_id'] if 'version_id' in body else None

        systemsManagerWrapper = SystemsManagerWrapper()
        parameter = systemsManagerWrapper.get_parameter(
            parameter_name=parameter_name)

        cloudFrontWrapper = CloudFrontWrapper(
            key_id=key_id,
            parameter=parameter,
            distribution_domain=distribution_domain
        )

        signed_url = cloudFrontWrapper.get_signed_url(
            s3_path=s3_path, version_id=version_id)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'
            },
            'body': json.dumps(
                cloudFrontWrapper.toEntity(
                    response=signed_url,
                    service_name=ServiceName.ObjectData.name,
                    key=s3_path
                )
            )
        }

    except Exception:
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': os.environ['AllOW_ORIGIN'],
                'Access-Control-Allow-Methods': '*'
            },
            'body': json.dumps(traceback.format_exc())
        }


class SystemsManagerWrapper:
    def __init__(self):
        self.ssm_client = boto3.client('ssm')

    def get_parameter(self, *, parameter_name):
        try:
            kwargs = {
                'Name': parameter_name,
                'WithDecryption': True,
            }
            response = self.ssm_client.get_parameter(**kwargs)
            logger.info(f'get_parameter: {response}')
            return response

        except Exception as err:
            logger.error(traceback.format_exc())
            raise RuntimeError(
                'SystemsManger server error: {}'.format(traceback.format_exc())
            ) from err


def rsa_signer_factory(parameter):
    def rsa_signer(message):
        private_key = serialization.load_pem_private_key(
            parameter['Parameter']['Value'].encode('utf-8'),
            password=None,
            backend=default_backend()
        )
        return private_key.sign(message, padding.PKCS1v15(), hashes.SHA1())
    return rsa_signer


def parse_string(key, service_name):
    if service_name == ServiceName.ObjectData.name:
        regex = r'^userId=([^\/]+)\/metaKey=([^\/]+)\/metaValue=([^\/]+)\/mimeType=([^\/]+)\/(.*)$'
        match = re.match(regex, key)
        if match:
            return {
                'user_id': match.group(1),
                'meta_key': match.group(2),
                'meta_value': match.group(3),
                'mime_type': match.group(4),
                'file_name': match.group(5),
            }
        else:
            return {}
    else:
        return {}


class CloudFrontWrapper:
    def __init__(self, *, key_id, parameter, distribution_domain):
        self.cloud_front_signer = CloudFrontSigner(
            key_id, rsa_signer_factory(parameter=parameter)
        )
        self.distribution_domain = distribution_domain

    def get_signed_url(self, *, s3_path, version_id=None):
        try:
            expire_date = datetime.now() + timedelta(hours=1)
            jst = pytz.timezone('Asia/Tokyo')
            date = expire_date.astimezone(jst)
            # バージョンIDをクエリパラメータに含める
            url = f'https://{self.distribution_domain}/{s3_path}'
            if version_id:
                url += f'?versionId={version_id}'

            signed_url = self.cloud_front_signer.generate_presigned_url(
                url, date_less_than=date
            )
            logger.info(f'signed_url: {signed_url}')
            return signed_url

        except Exception as err:
            logger.error(traceback.format_exc())
            raise RuntimeError(
                'CloudFront server error: {}'.format(traceback.format_exc())
            ) from err

    def toEntity(self, *, response, service_name, key=None):
        entity = {}
        parsedKey = parse_string(key=key, service_name=service_name)
        if parsedKey:
            entity['meta_key'] = parsedKey['meta_key']
            entity['meta_value'] = parsedKey['meta_value']
            entity['mime_type'] = parsedKey['mime_type']
            entity['file_name'] = parsedKey['file_name']
            entity['user_id'] = parsedKey['user_id']

        entity['signed_uri'] = response
        return entity
