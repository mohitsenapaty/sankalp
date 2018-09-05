"""sankalp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from main import views as main_views
from kvaschool import views as kvaschool_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', main_views.home, name='home'),
    url(r'^kva/home/$', kvaschool_views.home, name='kva_home'),
    url(r'^kva/login_page/$', kvaschool_views.login_page, name='kva_login_page'),
    url(r'^kva/log_out/$', kvaschool_views.log_out, name='kva_logout_page'),
    url(r'^kva/admin_profile_info/', kvaschool_views.admin_profile_info, name='kva_admin_profile_info'),
    url(r'^kva/teacher_excel_upload/', kvaschool_views.teacher_excel_upload, name='kva_teacher_excel_upload'),
    url(r'^kva/student_excel_upload/', kvaschool_views.student_excel_upload, name='kva_student_excel_upload'),
]
