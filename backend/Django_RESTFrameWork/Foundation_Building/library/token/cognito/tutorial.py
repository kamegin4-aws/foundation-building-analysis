import traceback
from library.token.interface.token import IToken


class Cognito(IToken):
    def __init__(self, *, instance):
        self.instance = instance

    def id_token_validation(self, *, id_token):
        try:
            result = self.instance.token_validation(jwt_token=id_token)

            return result
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(traceback.format_exc())
