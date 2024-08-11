import logging
import os
import traceback

import environ
from Foundation_Building.settings import BASE_DIR
from library.secrets.interface.secrets import ISecrets

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


class RDSSecrets(ISecrets):
    def __init__(self, *, instance):
        self.instance = instance

    def get_rds_info(self):
        try:
            result = self.instance.get_secret(secret_name=env('SECRET_NAME'))

            return self.instance.toEntity(response=result)
        except Exception:
            logger.error(traceback.format_exc())
            raise RuntimeError(f'server error: {traceback.format_exc()}')
