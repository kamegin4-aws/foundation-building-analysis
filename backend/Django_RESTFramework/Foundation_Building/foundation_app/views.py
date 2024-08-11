from django_filters.rest_framework import DjangoFilterBackend
from foundation_app.filters import InMemoryDataFilter
from foundation_app.models import InMemoryData, User
from foundation_app.serializers import InMemoryDataSerializer, UserSerializer
from rest_framework import filters, viewsets
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated


class InMemoryDataViewSet(viewsets.ModelViewSet):
    queryset = InMemoryData.objects.all()
    serializer_class = InMemoryDataSerializer  # ここでserializer_classを設定

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = InMemoryDataFilter
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        fields = self.request.query_params.get('fields')
        if fields:
            fields = fields.split(',')
            kwargs['fields'] = fields
        return super().get_serializer(*args, **kwargs)


class InMemoryDataPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
