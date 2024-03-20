import abc


class IToken(metaclass=abc.ABCMeta):
    """JWTトークン用インターフェース
    """

    @abc.abstractmethod
    def id_token_validation(self, *, id_token):
        """CognitoIDトークンを検証する

        Args:
            id_token (str): IDトークン

        Returns:
            result (boolean): 検証合格:True。
        """
        raise NotImplementedError()
