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
            result (boolean | dict): 検証合格:トークン, 不合格:False。
        """
        raise NotImplementedError()

    def id_token_user_validation(self, *, id_token, user_name):
        """CognitoIDトークン内のユーザーとリクエストユーザーが一緒か確かめる

        Args:
            id_token (str): IDトークン
            user_name (str): ユーザーネーム

        Returns:
            result (boolean): 検証合格:True。
        """
        raise NotImplementedError()
