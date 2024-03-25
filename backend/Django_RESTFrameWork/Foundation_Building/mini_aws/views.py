# from django.shortcuts import render
# from library.cache.elasticache.tutorial import ElastiCache as ElastiCacheWrapper
# from library.cache.infrastructure.pymemcache_client import PymemcacheWrapper
from mini_aws.models import ElastiCache, ResultLog
from mini_aws.serializers import ElastiCacheSerializer, ResultLogSerializer
from rest_framework import generics, response, status, parsers, filters
from django.contrib.auth.models import User
from mini_aws.serializers import UserSerializer
# from mini_aws.permissions import IsOwnerOrReadOnly
import django_filters.rest_framework

from library.token.infrastructure.pyjwt_client import PyJWTWrapper
from library.token.cognito.tutorial import Cognito
import environ
import os
from Foundation_Building.settings import BASE_DIR
env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


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
        filters.SearchFilter,
        filters.OrderingFilter]
    filter_fields = ['key']
    search_fields = ['key']
    ordering_fields = ['key', 'updated_at']
    ordering = ['key', 'updated_at']

    def get(self, request, *args, **kwargs):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        """
        # トークン検証
        id_token = request.META.get('HTTP_AUTHORIZATION').split()[1]
        issuer = env('ISSUER')
        cognito = Cognito(instance=PyJWTWrapper(issuer=issuer))
        token_validation = cognito.id_token_validation(id_token=id_token)
        if token_validation is not True:
            return response.Response(
                token_validation,
                status=status.HTTP_401_UNAUTHORIZED)
        """

        kwargs = {}
        key = self.request.query_params.get('key')
        order_by = self.request.query_params.get('order_by')
        limit = self.request.query_params.get('limit')
        offset = self.request.query_params.get('offset')
        if key is not None:
            kwargs['key__contains'] = key

        queryset = ElastiCache.objects.filter(**kwargs)

        if limit is not None or offset is not None:
            if limit is not None and offset is not None:
                queryset = queryset[int(offset):int(limit)]
            elif limit is not None:
                queryset = queryset[:int(limit)]
            elif offset is not None:
                queryset = queryset[int(offset):]
            queryset = queryset[:int(limit)]

        if order_by is not None:
            queryset = queryset.order_by(order_by)

        serializer = self.get_serializer(queryset, many=True)

        return response.Response(
            serializer.data,
            status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # トークン検証
        id_token = request.META.get('HTTP_AUTHORIZATION').split()[1]
        issuer = env('ISSUER')
        cognito = Cognito(instance=PyJWTWrapper(issuer=issuer))
        token_validation = cognito.id_token_validation(id_token=id_token)
        if token_validation is not True:
            return response.Response(
                token_validation,
                status=status.HTTP_401_UNAUTHORIZED)

        # リクエストデータをシリアライズして新しいデータを作成
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        return response.Response(
            serializer.data, status=status.HTTP_201_CREATED)


class ElastiCacheDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ElastiCache.objects.all()
    serializer_class = ElastiCacheSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                      IsOwnerOrReadOnly]
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    lookup_fields = ['pk']

    def get(self, request, *args, **kwargs):
        # トークン検証
        id_token = request.META.get('HTTP_AUTHORIZATION').split()[1]
        issuer = env('ISSUER')
        cognito = Cognito(instance=PyJWTWrapper(issuer=issuer))
        token_validation = cognito.id_token_validation(id_token=id_token)
        if token_validation is not True:
            return response.Response(
                token_validation,
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
        id_token = request.META.get('HTTP_AUTHORIZATION').split()[1]
        issuer = env('ISSUER')
        cognito = Cognito(instance=PyJWTWrapper(issuer=issuer))
        token_validation = cognito.id_token_validation(id_token=id_token)
        if token_validation is not True:
            return response.Response(
                token_validation,
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
        id_token = request.META.get('HTTP_AUTHORIZATION').split()[1]
        issuer = env('ISSUER')
        cognito = Cognito(instance=PyJWTWrapper(issuer=issuer))
        token_validation = cognito.id_token_validation(id_token=id_token)
        if token_validation is not True:
            return response.Response(
                token_validation,
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


class ResultLogList(generics.ListCreateAPIView):
    queryset = ResultLog.objects.all()
    serializer_class = ResultLogSerializer
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter]
    filter_fields = ['user_name']
    search_fields = ['user_name']
    ordering_fields = ['create_at', 'user_name']
    ordering = ['create_at', 'user_name']

    def get(self, request, *args, **kwargs):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        kwargs = {}
        user_name = self.request.query_params.get('user_name')
        order_by = self.request.query_params.get('order_by')
        limit = self.request.query_params.get('limit')
        offset = self.request.query_params.get('offset')
        if user_name is not None:
            kwargs['user_name__contains'] = user_name

        queryset = ResultLog.objects.filter(**kwargs)

        if limit is not None or offset is not None:
            if limit is not None and offset is not None:
                queryset = queryset[int(offset):int(limit)]
            elif limit is not None:
                queryset = queryset[:int(limit)]
            elif offset is not None:
                queryset = queryset[int(offset):]
            queryset = queryset[:int(limit)]

        if order_by is not None:
            queryset = queryset.order_by(order_by)

        serializer = self.get_serializer(queryset, many=True)

        return response.Response(
            serializer.data,
            status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # リクエストデータをシリアライズして新しいデータを作成
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return response.Response(
            serializer.data,
            status=status.HTTP_201_CREATED)


class ResultLogDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResultLog.objects.all()
    serializer_class = ResultLogSerializer
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser]
    lookup_fields = ['pk']

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        filter = {}
        for field in self.lookup_fields:
            if field in self.kwargs:
                filter[field] = self.kwargs[field]

        obj = generics.get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        serializer = self.get_serializer(obj)
        return response.Response(
            serializer.data,
            status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return response.Response(
            serializer.data,
            status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
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
        self.check_object_permissions(self.request, obj)

        return obj


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
