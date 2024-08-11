import abc


class ISecrets(metaclass=abc.ABCMeta):
    """Secretsインターフェース
    """

    @abc.abstractmethod
    def get_rds_info(self):
        """RDSのシークレットバリューを取得する

        Returns:
            result (dict): Secretsエンティティ
        """
        raise NotImplementedError()
