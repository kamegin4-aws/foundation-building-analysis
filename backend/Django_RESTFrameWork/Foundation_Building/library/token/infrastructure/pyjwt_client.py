from library.token.infrastructure.interface.token import ITokenInstance
import jwt
import traceback
import environ
import os
import datetime
from Foundation_Building.settings import BASE_DIR

env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


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

            dt_now_jst_aware = datetime.datetime.now(
                datetime.timezone(datetime.timedelta(hours=9))
            )
            dt_jst_aware_token = datetime.datetime.fromtimestamp(
                int(decode_token['exp']), datetime.timezone(datetime.timedelta(hours=9)))

            if decode_token['token_use'] != 'id' or decode_token['iss'] != self.issuer or dt_jst_aware_token < dt_now_jst_aware:
                return False

            return True
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(traceback.format_exc())
