import django_filters
from foundation_app.models import RelationalData


class RelationalDataFilter(django_filters.FilterSet):
    class Meta:
        model = RelationalData
        fields = {
            'relational_id': ['icontains'],
            'meta_key': ['icontains'],
            'meta_value': ['icontains'],
            'comment': ['icontains'],
            'meta_value': ['icontains'],
            'meta_key': ['icontains'],
            'meta_value': ['icontains'],
            'created_at': ['year__gt', 'year__lt'],
            'updated_at': ['year__gt', 'year__lt'],
            'user': ['exact'],
        }
