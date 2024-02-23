from rest_framework import serializers
from mini_aws.models import ElastiCache
from django.contrib.auth.models import User


class ElastiCacheSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = ElastiCache
        fields = [
            'id',
            'user_name',
            'result',
            'owner',
            'create_at',
            'updated_at']


class UserSerializer(serializers.ModelSerializer):
    elasticache = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ElastiCache.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'elasticache']
