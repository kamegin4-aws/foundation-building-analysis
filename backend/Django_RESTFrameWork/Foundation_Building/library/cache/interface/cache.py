import abc


class ICache(metaclass=abc.ABCMeta):
    """Cacheを扱うインターフェース
    """

    @abc.abstractmethod
    def cache_list(self):
        """コンテンツをすべて返す


        Returns:
            result (Iterable[Tuple(str,str)] or bool): 成功:キー・バリューの配列。失敗:False
        """
        raise NotImplementedError()

    @abc.abstractmethod
    def cache_info(self, *, key):
        """指定されたキーのコンテンツを返す

        Args:
            key (str): キー

        Returns:
            result (str or bool): バリュー。失敗:False
        """
        raise NotImplementedError()

    @abc.abstractmethod
    def cache_create_update(self, *, key, value, expire=86400):
        """キー・バリューコンテンツを保存する。

        Args:
            key (str): キー
            value (str or byte): バリュー
            expire (int)[expire=86400]: 有効期限(秒)。デフォルト:86400(24時間)

        Returns:
            result (bool): 成功:True
        """
        raise NotImplementedError()

    @abc.abstractmethod
    def cache_remove(self, *, key):
        """指定されたキーのコンテンツを削除する

        Args:
            key (str): キー

        Returns:
            result (bool): 成功:True
        """
        raise NotImplementedError()
