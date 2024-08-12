from django.urls import include, path
from foundation_app.views import (RelationalDataViewSet, UserViewSet,
                                  health_check)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cognito-users', UserViewSet)
router.register(r'relational-data', RelationalDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check)
]
