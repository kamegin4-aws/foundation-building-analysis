from rest_framework import serializers
from mini_aws.models import ElastiCache, ResultLog
from django.contrib.auth.models import User


class DynamicFieldsSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        # クライアントからのフィールド指定を取得
        fields = kwargs.pop('fields', None)
        super(DynamicFieldsSerializer, self).__init__(*args, **kwargs)

        # フィールド指定がある場合、指定されていないフィールドを削除
        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ElastiCacheSerializer(DynamicFieldsSerializer):
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = ElastiCache
        fields = '__all__'


class ResultLogSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    elasticache = serializers.PrimaryKeyRelatedField(
        queryset=ElastiCache.objects.all())

    class Meta:
        model = ResultLog
        fields = [
            'id',
            'user_name',
            'elasticache',
            'result',
            'create_at']


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']
