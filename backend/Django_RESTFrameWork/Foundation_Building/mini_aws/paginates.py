from rest_framework import pagination


class ElastiCachePagination(pagination.LimitOffsetPagination):
    default_limit = 1000
