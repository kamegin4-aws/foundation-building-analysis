# Use this code snippet in your app.
# If you need more information about configurations
# or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/python/

import logging
import os
import traceback

import boto3
import environ
from botocore.exceptions import ClientError
from Foundation_Building.settings import BASE_DIR
from library.secrets.infrastructure.interface.secrets import ISecretsInstance

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


class SecretsmanagerWrapper(ISecretsInstance):
    def __init__(self):
        self.client = boto3.client('secretsmanager', region_name=env('REGION'))

    def get_secret(self, *, secret_name):
        try:
            get_secret_value_response = self.client.get_secret_value(
                SecretId=secret_name
            )
            logger.info(f'secret_value: {get_secret_value_response}')

            secret = get_secret_value_response

            return secret

            # Your code goes here.
        except ClientError as e:
            # For a list of exceptions thrown, see
            # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            raise RuntimeError(
                "Failed to get secret {} because: {}".format(
                    secret_name, e.response['Error']['Message'])) from e

        except Exception as err:
            logger.error(traceback.format_exc())
            raise RuntimeError('Secretsmanager server error:' +
                               f' {traceback.format_exc()}') from err
