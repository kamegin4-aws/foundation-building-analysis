from django_filters import rest_framework as filters
from mini_aws.models import ElastiCache


class ElastiCacheFilter(filters.FilterSet):
    key = filters.CharFilter(field_name='key', lookup_expr='exact')
    value = filters.CharFilter(field_name='value', lookup_expr='exact')
    create_at = filters.DateTimeFromToRangeFilter()
    updated_at = filters.DateTimeFromToRangeFilter()

    class Meta:
        model = ElastiCache
        # フィルタを列挙する
        fields = ['key', 'value', 'create_at', 'updated_at']
