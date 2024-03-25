"""
URL configuration for Foundation_Building project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import environ
import os
from Foundation_Building.settings import BASE_DIR, str_to_bool
env = environ.Env()
# reading .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


DEBUG = str_to_bool(env('DJANGO_DEBUG'))

if DEBUG:
    urlpatterns = [
        path('admin', admin.site.urls),
        path('api-auth', include('rest_framework.urls')),
        path('', include('mini_aws.urls')),
    ]
else:
    urlpatterns = [
        path('api-auth', include('rest_framework.urls')),
        path('', include('mini_aws.urls')),
    ]
