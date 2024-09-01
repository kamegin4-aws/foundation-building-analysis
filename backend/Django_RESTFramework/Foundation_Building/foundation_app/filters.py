import django_filters
from foundation_app.models import RelationalData, User


class RelationalDataFilter(django_filters.FilterSet):
    created_at_range = django_filters.DateFromToRangeFilter(
        field_name='created_at')
    updated_at_range = django_filters.DateFromToRangeFilter(
        field_name='updated_at')

    class Meta:
        model = RelationalData
        fields = {
            'relational_id': ['exact'],
            'meta_key': ['icontains'],
            'meta_value': ['icontains'],
            'comment': ['icontains'],
            'version_id': ['exact'],
            'key': ['icontains'],
            'value': ['icontains'],
            'user': ['exact'],
        }


class UserFilter(django_filters.FilterSet):
    created_at_range = django_filters.DateFromToRangeFilter(
        field_name='created_at')
    updated_at_range = django_filters.DateFromToRangeFilter(
        field_name='updated_at')

    class Meta:
        model = User
        fields = {
            'user_id': ['exact'],
            'user_name': ['icontains'],
            'email': ['icontains'],
            'plan': ['icontains'],
        }
