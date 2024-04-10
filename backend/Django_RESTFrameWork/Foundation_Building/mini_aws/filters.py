from django_filters import rest_framework as filters
from mini_aws.models import ElastiCache, UserResults


class ElastiCacheFilter(filters.FilterSet):
    key = filters.CharFilter(field_name='key', lookup_expr='exact')
    value = filters.CharFilter(field_name='value', lookup_expr='icontains')
    create_at = filters.DateTimeFromToRangeFilter()
    updated_at = filters.DateTimeFromToRangeFilter()

    class Meta:
        model = ElastiCache
        # フィルタを列挙する
        fields = ['key', 'value', 'create_at', 'updated_at']


class UserResultsFilter(filters.FilterSet):
    user_name = filters.CharFilter(field_name='user_name', lookup_expr='exact')
    elasticache_key = filters.CharFilter(field_name='elasticache__key',
                                         method='filter_elasticache_key')
    elasticache_value = filters.CharFilter(field_name='elasticache__value',
                                           method='filter_elasticache_value')
    create_at = filters.DateTimeFromToRangeFilter()
    updated_at = filters.DateTimeFromToRangeFilter()

    def filter_elasticache_key(self, queryset, name, value):
        # elasticache_key パラメータに基づいて UserResults をフィルタリング
        return queryset.filter(elasticache__key__icontains=value)

    def filter_elasticache_value(self, queryset, name, value):
        # elasticache_key パラメータに基づいて UserResults をフィルタリング
        return queryset.filter(elasticache__value__icontains=value)

    class Meta:
        model = UserResults
        # フィルタを列挙する
        fields = [
            'user_name',
            'elasticache_key',
            'elasticache_value',
            'create_at',
            'updated_at']
