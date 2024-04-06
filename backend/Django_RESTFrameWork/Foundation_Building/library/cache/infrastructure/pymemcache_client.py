import ssl
from pymemcache.client.base import Client
from pymemcache import serde
import traceback
from library.cache.infrastructure.interface.cache import ICacheInstance
import environ
import os
from Foundation_Building.settings import BASE_DIR
env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


class PymemcacheWrapper(ICacheInstance):
    def __init__(self, *, endpoint=None, tls_context=None, sered_cache=None):
        self.endpoint = endpoint if endpoint is not None else env(
            'ELASTICACHE_ENDPOINT')
        self.tls_context = tls_context if tls_context is not None else ssl.create_default_context()
        self.sered_cache = sered_cache if sered_cache is not None else serde.pickle_serde
        self.client = Client(
            self.endpoint,
            tls_context=self.tls_context, serde=self.sered_cache)

    # Memcachedではget_cache_allに該当するメソッドがない

    def get_cache(self, *, key):
        try:
            result = self.client.get(key)
            return result if result else False
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(
                f'pymemcache server error: {traceback.format_exc()}')

    def set_cache(self, *, key, value, expire=86400):
        try:
            self.client.set(key, value, expire=expire, noreply=False)

            return True
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(
                f'pymemcache server error: {traceback.format_exc()}')

    def delete_cache(self, *, key):
        try:
            return self.client.delete(key, noreply=False)
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(
                f'pymemcache server error: {traceback.format_exc()}')

    def flush_cache(self):
        try:
            return self.client.flush_all(noreply=False)
        except Exception:
            print(traceback.format_exc())
            raise RuntimeError(
                f'pymemcache server error: {traceback.format_exc()}')
