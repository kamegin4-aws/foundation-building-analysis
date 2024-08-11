import abc


class ICacheInstance(metaclass=abc.ABCMeta):
    """Cache用インスタンスのインターフェース
    """

    @abc.abstractmethod
    def get_cache_all(self):
        """コンテンツをすべて返す

        Returns:
            result (List[Tuple(str,str)]): 成功:キー・バリューの配列。
        """
        raise NotImplementedError()

    @abc.abstractmethod
    def get_cache(self, *, key):
        """指定されたキーのコンテンツを返す

        Args:
            key (str): キー

        Returns:
            result (str or bool): バリュー。失敗:False
        """
        raise NotImplementedError()

    @abc.abstractmethod
    def set_cache(self, *, key, value, expire=86400):
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
    def delete_cache(self, *, key):
        """指定されたキーのコンテンツを削除する

        Args:
            key (str): キー

        Returns:
            result (bool): 成功:True
        """
        raise NotImplementedError()

    @abc.abstractmethod
    def flush_cache(self):
        """キャシュをクリアする

        Returns:
            result (bool): 成功:True
        """
        raise NotImplementedError()
