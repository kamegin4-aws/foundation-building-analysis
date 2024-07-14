from rest_framework import serializers
from mini_aws.models import User, InMemoryData


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # 指定されたフィールドのみを保持する
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class InMemoryDataSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = InMemoryData
        fields = ['id', 'key', 'value', 'created_at', 'updated_at', 'user']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id']
