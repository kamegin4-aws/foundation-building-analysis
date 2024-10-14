import logging
import traceback

from library.env.env import get_env
from library.secrets.interface.rds.secrets import ISecrets

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

env = get_env()


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
