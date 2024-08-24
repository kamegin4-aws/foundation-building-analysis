# foundation_app/pagination.py

from rest_framework.pagination import LimitOffsetPagination


class CustomBasePagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100
