import traceback
from library.cache.interface.cache import ICache


class ElastiCache(ICache):
    def __init__(self, *, instance):
        self.instance = instance

    def cache_list(self):
        try:
            self.instance.flush_cache()
            result = self.instance.get_cache_all()
            print(f'type: {type(result)}')
            print(f'result: {result}')

            return result
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(traceback.format_exc())

    def cache_info(self, *, key):
        try:
            self.instance.flush_cache()
            result = self.instance.get_cache(key)
            print(f'type: {type(result)}')
            print(f'result: {result}')

            return result if result else False
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(traceback.format_exc())

    def cache_create_update(self, *, key, value, expire=86400):
        try:
            self.instance.flush_cache()
            self.instance.set_cache(key, value, expire=expire)

            return True
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(traceback.format_exc())

    def cache_remove(self, *, key):
        try:
            return self.instance.delete_cache(key)
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(traceback.format_exc())
