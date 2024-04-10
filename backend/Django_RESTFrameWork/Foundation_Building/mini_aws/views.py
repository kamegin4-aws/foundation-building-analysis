# from django.shortcuts import render
# from library.cache.elasticache.tutorial import ElastiCache as ElastiCacheWrapper
# from library.cache.infrastructure.pymemcache_client import PymemcacheWrapper
from mini_aws.models import ElastiCache, UserResults
from mini_aws.serializers import ElastiCacheSerializer, UserResultsSerializer, UserSerializer
from rest_framework import generics, response, status, parsers, filters
from django.contrib.auth.models import User
# from mini_aws.permissions import IsOwnerOrReadOnly
import django_filters.rest_framework
from mini_aws.filters import ElastiCacheFilter, UserResultsFilter
from mini_aws.paginates import ElastiCachePagination, UserResultsPagination

from library.token.infrastructure.pyjwt_client import PyJWTWrapper
from library.token.cognito.token import Cognito
import environ
import os
from Foundation_Building.settings import BASE_DIR
env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


def token_validation(request):
    # トークン検証
    id_token = request.META.get('HTTP_AUTHORIZATION').split()[1]
    issuer = env('ISSUER')
    cognito = Cognito(instance=PyJWTWrapper(issuer=issuer))
    return cognito.id_token_validation(id_token=id_token)


class APIRoot(generics.ListAPIView):
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter]

    def get(self, request, *args, **kwargs):
        user_queryset = User.objects.all()
        user_serializer = UserSerializer(user_queryset, many=True)

        elasticache_queryset = ElastiCache.objects.all()
        elasticache_serializer = ElastiCacheSerializer(
            elasticache_queryset, many=True)

        return response.Response(
            {
                'users': user_serializer.data,
                'elasticache': elasticache_serializer.data
            },
            status=status.HTTP_200_OK)


class ElastiCacheList(generics.ListCreateAPIView):
    queryset = ElastiCache.objects.all()
    serializer_class = ElastiCacheSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                      IsOwnerOrReadOnly]
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.OrderingFilter]
    filterset_class = ElastiCacheFilter
    pagination_class = ElastiCachePagination

    def get(self, request, *args, **kwargs):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """

        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        # フィルタリングされたクエリセットを取得
        filtered_qs = self.filter_queryset(self.get_queryset())
        paginate_qs = self.paginate_queryset(filtered_qs)

        serializer = self.get_serializer(paginate_qs, many=True)

        return response.Response(
            serializer.data,
            status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        # リクエストデータをシリアライズして新しいデータを作成
        # self.user_results = request.data.get('user_results')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return response.Response(
            serializer.data, status=status.HTTP_201_CREATED)

    def get_serializer(self, *args, **kwargs):
        """
        このビューで使用されるシリアライザーのインスタンスを返す
        """
        fields = self.request.query_params.get('fields')
        if fields:
            # リスト化してシリアライザに渡す
            fields = fields.split(',')
            kwargs['fields'] = fields

        return super(ElastiCacheList, self).get_serializer(*args, **kwargs)


class ElastiCacheDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ElastiCache.objects.all()
    serializer_class = ElastiCacheSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                      IsOwnerOrReadOnly]
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    lookup_fields = ['pk']

    def get(self, request, *args, **kwargs):
        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        queryset = self.get_queryset()

        filter = {}
        for field in self.lookup_fields:
            if field in self.kwargs:
                filter[field] = self.kwargs[field]

        obj = generics.get_object_or_404(queryset, **filter)
        # self.check_object_permissions(self.request, obj)
        serializer = self.get_serializer(obj)
        return response.Response(
            serializer.data,
            status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return response.Response(
            serializer.data,
            status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        instance = self.get_object()
        self.perform_destroy(instance)
        return response.Response(status=status.HTTP_204_NO_CONTENT)

    def get_object(self):
        queryset = self.get_queryset()
        filter = {}
        for field in self.lookup_fields:
            if field in self.kwargs:
                filter[field] = self.kwargs[field]

        obj = generics.get_object_or_404(queryset, **filter)
        # self.check_object_permissions(self.request, obj)

        return obj

    def get_serializer(self, *args, **kwargs):
        """
        このビューで使用されるシリアライザーのインスタンスを返す
        """
        fields = self.request.query_params.get('fields')
        if fields:
            # リスト化してシリアライザに渡す
            fields = fields.split(',')
            kwargs['fields'] = fields

        return super(ElastiCacheList, self).get_serializer(*args, **kwargs)


class UserResultsList(generics.ListCreateAPIView):
    queryset = UserResults.objects.all()
    serializer_class = UserResultsSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                      IsOwnerOrReadOnly]
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.OrderingFilter]
    filterset_class = UserResultsFilter
    pagination_class = UserResultsPagination

    def get(self, request, *args, **kwargs):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """

        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        # フィルタリングされたクエリセットを取得
        filtered_qs = self.filter_queryset(self.get_queryset())
        paginate_qs = self.paginate_queryset(filtered_qs)

        serializer = self.get_serializer(paginate_qs, many=True)

        return response.Response(
            serializer.data,
            status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        # リクエストデータをシリアライズして新しいデータを作成
        # self.user_results = request.data.get('user_results')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return response.Response(
            serializer.data, status=status.HTTP_201_CREATED)

    def get_serializer(self, *args, **kwargs):
        """
        このビューで使用されるシリアライザーのインスタンスを返す
        """
        fields = self.request.query_params.get('fields')
        if fields:
            # リスト化してシリアライザに渡す
            fields = fields.split(',')
            kwargs['fields'] = fields

        return super(UserResultsList, self).get_serializer(*args, **kwargs)


class UserResultsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserResults.objects.all()
    serializer_class = UserResultsSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                      IsOwnerOrReadOnly]
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    lookup_fields = ['pk']

    def get(self, request, *args, **kwargs):
        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        queryset = self.get_queryset()

        filter = {}
        for field in self.lookup_fields:
            if field in self.kwargs:
                filter[field] = self.kwargs[field]

        obj = generics.get_object_or_404(queryset, **filter)
        # self.check_object_permissions(self.request, obj)
        serializer = self.get_serializer(obj)
        return response.Response(
            serializer.data,
            status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return response.Response(
            serializer.data,
            status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        # トークン検証
        token_validation_result = token_validation(request)
        if token_validation_result is not True:
            return response.Response(
                token_validation_result,
                status=status.HTTP_401_UNAUTHORIZED)

        instance = self.get_object()
        self.perform_destroy(instance)
        return response.Response(status=status.HTTP_204_NO_CONTENT)

    def get_object(self):
        queryset = self.get_queryset()
        filter = {}
        for field in self.lookup_fields:
            if field in self.kwargs:
                filter[field] = self.kwargs[field]

        obj = generics.get_object_or_404(queryset, **filter)
        # self.check_object_permissions(self.request, obj)

        return obj

    def get_serializer(self, *args, **kwargs):
        """
        このビューで使用されるシリアライザーのインスタンスを返す
        """
        fields = self.request.query_params.get('fields')
        if fields:
            # リスト化してシリアライザに渡す
            fields = fields.split(',')
            kwargs['fields'] = fields

        return super(ElastiCacheList, self).get_serializer(*args, **kwargs)


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter]


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter]
