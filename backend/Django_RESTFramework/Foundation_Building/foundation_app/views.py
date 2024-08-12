from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from foundation_app.filters import RelationalDataFilter
from foundation_app.models import RelationalData, User
from foundation_app.serializers import RelationalDataSerializer, UserSerializer
from rest_framework import filters, viewsets
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated


def health_check(request):
    return JsonResponse({"status": "ok"})


class RelationalDataViewSet(viewsets.ModelViewSet):
    queryset = RelationalData.objects.all()
    serializer_class = RelationalDataSerializer  # ここでserializer_classを設定

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = RelationalDataFilter
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        fields = self.request.query_params.get('fields')
        if fields:
            fields = fields.split(',')
            kwargs['fields'] = fields
        return super().get_serializer(*args, **kwargs)


class RelationalDataPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
