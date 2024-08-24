import django_filters
from foundation_app.models import RelationalData, User


class RelationalDataFilter(django_filters.FilterSet):
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
            # 年月日フィルタを追加
            'created_at': ['year__gt', 'year__lt', 'year', 'month', 'day'],
            # 年月日フィルタを追加
            'updated_at': ['year__gt', 'year__lt', 'year', 'month', 'day'],
            'user': ['exact'],
        }


class UserFilter(django_filters.FilterSet):
    class Meta:
        model = User
        fields = {
            'user_id': ['exact'],
            'user_name': ['icontains'],
            'email': ['icontains'],
            'plan': ['icontains'],
            'expires': ['year__gt', 'year__lt', 'year', 'month', 'day'],
            'created_at': ['year__gt', 'year__lt', 'year', 'month', 'day'],
            'updated_at': ['year__gt', 'year__lt', 'year', 'month', 'day'],
        }
