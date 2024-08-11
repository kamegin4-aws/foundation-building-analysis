import traceback
import logging
from library.token.interface.token import IToken

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class Cognito(IToken):
    def __init__(self, *, instance):
        self.instance = instance

    def id_token_validation(self, *, id_token):
        try:
            result = self.instance.token_validation(jwt_token=id_token)

            return result
        except Exception:
            logger.error(traceback.format_exc())
            raise RuntimeError(f'client error: {traceback.format_exc()}')

    def id_token_user_validation(self, *, id_token, user_name):
        try:
            result = self.instance.user_validation(
                jwt_token=id_token, user_name=user_name)

            return result
        except Exception:
            logger.error(traceback.format_exc())
            raise RuntimeError(f'client error: {traceback.format_exc()}')
