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
            result (boolean): 検証合格:True。
        """
        raise NotImplementedError()
