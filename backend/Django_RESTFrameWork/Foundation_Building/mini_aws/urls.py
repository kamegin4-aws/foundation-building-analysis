from django.urls import path
from mini_aws import views

urlpatterns = [
    path('', views.APIRoot.as_view()),
    path('elasticache', views.ElastiCacheList.as_view()),
    path('elasticache/<int:pk>', views.ElastiCacheDetail.as_view()),
    path('users', views.UserList.as_view()),
    path('users/<int:pk>', views.UserDetail.as_view()),
]
