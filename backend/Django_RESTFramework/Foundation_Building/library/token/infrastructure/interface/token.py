import abc


class ITokenInstance(metaclass=abc.ABCMeta):
    """JWTトークン用インスタンスのインターフェース
    """

    @abc.abstractmethod
    def token_validation(self, *, jwt_token):
        """JWTトークンを検証する

        Args:
            jwt_token (str): JWT形式のトークン

        Returns:
            result (dict): デコードトークン
        """
        raise NotImplementedError()

    def user_validation(self, *, jwt_token, user_name):
        """JWTトークン内のユーザーが一緒か確認する

        Args:
            jwt_token (str): JWT形式のトークン
            user_name (str): ユーザーネーム

        Returns:
            result (dict): デコードトークン
        """
        raise NotImplementedError()

    def toEntity(self, *, decode_token={}):
        """共通エンティティに変換する

        Args:
            decode_token (dict): デコードトークン

        Returns:
            entity (dict): JWTエンティティ
        """
        if decode_token == {}:
            return {}

        else:
            entity = {}
            entity['user_name'] = decode_token.get('cognito:username')
            entity['plan'] = decode_token.get('custom:plan')
            entity['token_info'] = decode_token

            return entity
