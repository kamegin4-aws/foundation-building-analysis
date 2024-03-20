from rest_framework import serializers
from mini_aws.models import ElastiCache, ResultLog
from django.contrib.auth.models import User


class ElastiCacheSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = ElastiCache
        fields = [
            'id',
            'key',
            'value',
            'create_at',
            'updated_at',]


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
