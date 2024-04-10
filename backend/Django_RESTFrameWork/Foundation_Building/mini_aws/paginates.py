from rest_framework import pagination


class ElastiCachePagination(pagination.LimitOffsetPagination):
    default_limit = 1000


class UserResultsPagination(pagination.LimitOffsetPagination):
    default_limit = 1000
