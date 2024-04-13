from rest_framework import serializers
from mini_aws.models import ElastiCache, UserContents
from django.contrib.auth.models import User
from django.db import transaction


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
        fields = ['id', 'key', 'value', 'create_at', 'updated_at']


class UserContentsSerializer(DynamicFieldsSerializer):
    # user_name = serializers.CharField(read_only=True)
    elasticache = ElastiCacheSerializer(many=True, required=False)

    def create(self, validated_data):
        with transaction.atomic():
            elasticache_data = validated_data.pop('elasticache', [])
            user_contents = UserContents.objects.create(**validated_data)
            for _elasticache_data in elasticache_data:
                ElastiCache.objects.create(
                    user_contents=user_contents, **_elasticache_data)
            return user_contents

    def update(self, instance, validated_data):
        with transaction.atomic():
            elasticache_data_list = validated_data.pop('elasticache', [])

            # 既存のキーのリストを取得
            existing_keys = set(
                instance.elasticache.values_list(
                    'key', flat=True))

            # 更新または新規作成
            for elasticache_data in elasticache_data_list:
                key = elasticache_data.get('key')
                if key in existing_keys:
                    # 既存のオブジェクトを更新
                    ElastiCache.objects.filter(
                        user_contents=instance, key=key).update(
                        **elasticache_data)
                    existing_keys.remove(key)
                else:
                    # 新しいオブジェクトを作成
                    ElastiCache.objects.create(
                        user_contents=instance, **elasticache_data)

            # リクエストになかった既存のElastiCacheオブジェクトを削除
            ElastiCache.objects.filter(
                user_contents=instance,
                key__in=existing_keys).delete()

            # UserResultsのその他のフィールドを更新
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

        return instance

    class Meta:
        model = UserContents
        fields = ['user_name', 'elasticache', 'create_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']
