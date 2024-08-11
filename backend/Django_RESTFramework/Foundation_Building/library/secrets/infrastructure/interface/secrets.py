import abc
import json


class ISecretsInstance(metaclass=abc.ABCMeta):
    """Secretsインスタンスのインターフェース
    """

    @abc.abstractmethod
    def get_secret(self, *, secret_name):
        """シークレットバリューを取得する

        Args:
            secret_name (str): シークレット名

        Returns:
            result (dict): client.get_secret_valueのレスポンス
        """
        raise NotImplementedError()

    def toEntity(self, *, response):
        """共通エンティティに変換する

        Args:
            response (dict): secretsmanagerクライアントのレスポンス

        Returns:
            entity (dict): Secretsエンティティ
        """

        return json.loads(response["SecretString"])
