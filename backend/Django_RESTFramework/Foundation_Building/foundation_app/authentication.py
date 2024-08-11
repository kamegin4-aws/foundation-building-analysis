# authentication.py
import logging
import os
import traceback

import environ
from django.contrib.auth.models import User
from Foundation_Building.settings import BASE_DIR
from library.token.cognito.token import Cognito
from library.token.infrastructure.pyjwt_client import PyJWTWrapper
from rest_framework import authentication, exceptions

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


class CognitoAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        try:
            # トークン検証
            id_token = request.META.get('HTTP_AUTHORIZATION').split()[1]
            logger.info(f'id_token: {id_token}')
            issuer = env('ISSUER')
            cognito = Cognito(instance=PyJWTWrapper(issuer=issuer))
            result_id_token_validation = cognito.id_token_validation(
                id_token=id_token)

            if result_id_token_validation:
                # Create a user object with the decoded token information
                user = User(username=result_id_token_validation.get('sub', ''))
                user.token_info = result_id_token_validation
                return (user, result_id_token_validation)
            else:
                raise exceptions.AuthenticationFailed('Invalid token')
        except Exception:
            logger.error(f'Failed to authenticate: {traceback.format_exc()}')
            raise exceptions.AuthenticationFailed('Invalid token')
