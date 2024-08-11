from django.urls import include, path
from foundation_app.views import RelationalDataViewSet, UserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cognito-users', UserViewSet)
router.register(r'relational-data', RelationalDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
