import datetime
import logging
import traceback

import jwt
from library.env.env import get_env
from library.token.infrastructure.interface.token import ITokenInstance

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

env = get_env()


class PyJWTWrapper(ITokenInstance):
    def __init__(self, *, issuer):
        self.region = env(
            'REGION')
        self.user_pool_id = env(
            'USER_POOL_ID')
        self.client_id = env(
            'CLIENT_ID')

        self.issuer = issuer
        self.jwks_url = f'{issuer}/.well-known/jwks.json'
        self.jwks_client = jwt.PyJWKClient(self.jwks_url)

    def token_validation(self, *, jwt_token):
        try:

            token = jwt_token
            signing_key = self.jwks_client.get_signing_key_from_jwt(
                token)
            decode_token = jwt.decode(
                token,
                signing_key.key,
                algorithms=['RS256'],
                audience=self.client_id,
                issuer=self.issuer
            )

            logger.debug(f'decode_token: {decode_token}')

            dt_now_jst_aware = datetime.datetime.now(
                datetime.timezone(datetime.timedelta(hours=9))
            )
            dt_jst_aware_token = datetime.datetime.fromtimestamp(
                int(decode_token['exp']), datetime.timezone(datetime.timedelta(hours=9)))

            if decode_token['token_use'] != 'id' or decode_token['iss'] != self.issuer or dt_jst_aware_token < dt_now_jst_aware:
                return {}

            return decode_token
        except Exception:
            logger.error(traceback.format_exc())
            raise RuntimeError(f'jwt server error: {traceback.format_exc()}')

    def user_validation(self, *, jwt_token, user_name):
        try:

            token = jwt_token
            signing_key = self.jwks_client.get_signing_key_from_jwt(
                token)
            decode_token = jwt.decode(
                token,
                signing_key.key,
                algorithms=['RS256'],
                audience=self.client_id,
                issuer=self.issuer
            )

            if decode_token['cognito:username'] != user_name:
                return {}

            return decode_token
        except Exception:
            logger.error(traceback.format_exc())
            raise RuntimeError(f'jwt server error: {traceback.format_exc()}')
