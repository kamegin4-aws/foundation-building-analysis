import django_filters
from mini_aws.models import InMemoryData


class InMemoryDataFilter(django_filters.FilterSet):
    class Meta:
        model = InMemoryData
        fields = {
            'id': ['icontains'],
            'key': ['icontains'],
            'value': ['icontains'],
            'created_at': ['year__gt', 'year__lt'],
            'updated_at': ['year__gt', 'year__lt'],
            'user': ['exact'],
        }
