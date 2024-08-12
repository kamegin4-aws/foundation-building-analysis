import os
from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


def get_env():
    """環境変数を返す
    Returns:
        env (Any): environ.Env()
    """
    return env


def str_to_bool(s):
    """文字列を論理型に変換する

    Args:
        s (str): True/False

    Returns:
        (bool): True/False
    """
    return s.lower() in ["true", "t", "yes", "1"]
