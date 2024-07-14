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
            result (boolean | dict): 検証合格:トークン, 不合格:False。
        """
        raise NotImplementedError()

    def user_validation(self, *, jwt_token, user_name):
        """JWTトークン内のユーザーが一緒か確認する

        Args:
            jwt_token (str): JWT形式のトークン
            user_name (str): ユーザーネーム

        Returns:
            result (boolean): 検証合格:True。
        """
        raise NotImplementedError()
