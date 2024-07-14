from django.urls import include, path
from mini_aws.views import InMemoryDataViewSet, UserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cognitousers', UserViewSet)
router.register(r'inmemorydata', InMemoryDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
