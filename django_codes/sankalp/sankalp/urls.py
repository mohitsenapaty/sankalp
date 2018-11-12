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
    #admin
    url(r'^kva/admin_profile_info/$', kvaschool_views.admin_profile_info, name='kva_admin_profile_info'),
    url(r'^kva/teacher_excel_upload/$', kvaschool_views.teacher_excel_upload, name='kva_teacher_excel_upload'),
    url(r'^kva/student_excel_upload/$', kvaschool_views.student_excel_upload, name='kva_student_excel_upload'),
    url(r'^kva/view_exam_admin/$', kvaschool_views.admin_view_exam, name='kva_admin_view_exam'),
    url(r'^kva/admin_perform_view/(?P<exam_id1>\d+)/$', kvaschool_views.admin_perform_view, name='kva_admin_perform_view'),
    url(r'^kva/admin_student_performance_view/(?P<exam_id1>\d+)/$', kvaschool_views.admin_student_performance_view, name='kva_admin_student_performance_view'),
    url(r'^kva/admin_student_value_view/(?P<exam_id1>\d+)/$', kvaschool_views.admin_student_value_view, name='kva_admin_student_value_view'),
    url(r'^kva/declare_result/(?P<exam_id1>\d+)/$', kvaschool_views.declare_result, name='kva_declare_result'),
    url(r'^kva/admin_download_file/(?P<file_name>\w+)/$', kvaschool_views.admin_download_file, name='kva_admin_download_file'),
    url(r'^kva/add_student/$', kvaschool_views.add_student, name='kva_add_student'),
    url(r'^kva/add_teacher/$', kvaschool_views.add_teacher, name='kva_add_teacher'),
    url(r'^kva/add_subject/$', kvaschool_views.add_subject, name='kva_add_subject'),
    url(r'^kva/add_exam/$', kvaschool_views.add_exam, name='kva_add_exam'),
    url(r'^kva/add_event_admin/$', kvaschool_views.add_event_admin, name='kva_add_event_admin'),
    url(r'^kva/add_hostel_admin/$', kvaschool_views.add_hostel_admin, name='kva_add_hostel_admin'),
    url(r'^kva/add_house_admin/$', kvaschool_views.add_house_admin, name='kva_add_house_admin'),
    url(r'^kva/create_notice_admin/$', kvaschool_views.create_notice_admin, name='kva_create_notice_admin'),
    url(r'^kva/view_student_admin/$', kvaschool_views.view_student_admin, name='kva_view_student_admin'),
    url(r'^kva/view_single_student_admin/(?P<student_id1>\d+)/$', kvaschool_views.view_single_student_admin, name='kva_view_single_student_admin'),
    url(r'^kva/edit_student_admin/(?P<student_id1>\d+)/$', kvaschool_views.edit_student_admin, name='kva_edit_student_admin'),
    url(r'^kva/edit_student_house_admin/(?P<student_id1>\d+)/$', kvaschool_views.edit_student_house_admin, name='kva_edit_student_house_admin'),
    url(r'^kva/edit_student_residential_admin/(?P<student_id1>\d+)/$', kvaschool_views.edit_student_residential_admin, name='kva_edit_student_residential_admin'),
    url(r'^kva/view_teacher_admin/$', kvaschool_views.view_teacher_admin, name='kva_view_teacher_admin'),
    url(r'^kva/view_subject_admin/$', kvaschool_views.view_subject_admin, name='kva_view_subject_admin'),
    url(r'^kva/view_notice_admin/$', kvaschool_views.view_notice_admin, name='kva_view_notice_admin'),
    url(r'^kva/view_calendar_admin/$', kvaschool_views.view_calendar_admin, name='kva_view_calendar_admin'),
    url(r'^kva/view_hostel_admin/$', kvaschool_views.view_hostel_admin, name='kva_view_hostel_admin'),
    url(r'^kva/view_house_admin/$', kvaschool_views.view_house_admin, name='kva_view_house_admin'),
    url(r'^kva/view_single_notice_admin/(?P<notice_id1>\d+)/$', kvaschool_views.view_single_notice_admin, name='kva_view_single_notice_admin'),
    url(r'^kva/delete_student_admin/(?P<student_id1>\d+)/$', kvaschool_views.delete_student_admin, name='kva_delete_student_admin'),
    url(r'^kva/delete_teacher_admin/(?P<teacher_id1>\d+)/$', kvaschool_views.delete_teacher_admin, name='kva_delete_teacher_admin'),
    url(r'^kva/delete_subject_admin/(?P<subject_id1>\d+)/$', kvaschool_views.delete_subject_admin, name='kva_delete_subject_admin'),
    url(r'^kva/delete_calendar_admin/(?P<event_id1>\d+)/$', kvaschool_views.delete_event_admin, name='kva_delete_event_admin'),
    url(r'^kva/delete_hostel_admin/(?P<hostel_id1>\d+)/$', kvaschool_views.delete_hostel_admin, name='kva_delete_hostel_admin'),
    url(r'^kva/delete_house_admin/(?P<house_id1>\d+)/$', kvaschool_views.delete_house_admin, name='kva_delete_house_admin'),
    url(r'^kva/delete_teacher_subject_admin/(?P<teacher_id1>\d+)/(?P<subject_id1>\d+)/(?P<class_field1>\w+)/(?P<section1>\w+)/$', kvaschool_views.delete_teacher_subject_admin, name='kva_delete_teacher_subject_admin'),
    url(r'^kva/delete_classteacher_admin/(?P<teacher_id1>\d+)/$', kvaschool_views.delete_classteacher_admin, name='kva_delete_classteacher_admin'),
    url(r'^kva/assign_teacher_subject_admin/(?P<teacher_id1>\d+)/$', kvaschool_views.assign_teacher_subject_admin, name='kva_assign_teacher_subject_admin'),
    url(r'^kva/assign_class_subject_admin/$', kvaschool_views.assign_class_subject_admin, name='kva_assign_class_subject_admin'),
    url(r'^kva/assign_student_subject_admin/(?P<student_id1>\d+)/$', kvaschool_views.assign_student_subject_admin, name='kva_assign_student_subject_admin'),
    url(r'^kva/assign_classteacher_admin/(?P<teacher_id1>\d+)/$', kvaschool_views.assign_classteacher_admin, name='kva_assign_classteacher_admin'),
    #teacher
    url(r'^kva/teacher_profile_info/$', kvaschool_views.teacher_profile_info, name='kva_teacher_profile_info'),
    url(r'^kva/teacher_view_exam/$', kvaschool_views.teacher_view_exam, name='kva_teacher_view_exam'),
    url(r'^kva/teacher_single_exam_view/(?P<exam_id1>\d+)/$', kvaschool_views.teacher_single_exam_view, name='kva_teacher_single_exam_view'),
    url(r'^kva/teacher_view_grade/(?P<exam_id1>\d+)/(?P<subject_id1>\d+)/(?P<class_field1>\w+)/(?P<section1>\w+)/$', kvaschool_views.teacher_view_grade, name='kva_teacher_view_grade'),
    url(r'^kva/teacher_assign_grade/(?P<exam_id1>\d+)/(?P<subject_id1>\d+)/(?P<student_id1>\d+)/(?P<class_field1>\w+)/(?P<section1>\w+)/$', kvaschool_views.teacher_assign_grade, name='kva_teacher_assign_grade'),
    url(r'^kva/teacher_subject_student_view/(?P<subject_id1>\d+)/(?P<class_field1>\w+)/(?P<section1>\w+)/$', kvaschool_views.teacher_subject_student_view, name='teacher_subject_student_view'),
    url(r'^kva/teacher_view_value/(?P<exam_id1>\d+)/(?P<class_field1>\w+)/(?P<section1>\w+)/$', kvaschool_views.teacher_view_value, name='kva_teacher_view_value'),
    url(r'^kva/teacher_assign_value/(?P<exam_id1>\d+)/(?P<student_id1>\d+)/(?P<table1>\w+)/(?P<row1>\w+)/(?P<class_field1>\w+)/(?P<section1>\w+)/$', kvaschool_views.teacher_assign_value, name='kva_teacher_assign_value'),
    url(r'^kva/teacher_send_notice/(?P<class_field1>\w+)/(?P<section1>\w+)/(?P<student_id1>\d+)/$', kvaschool_views.teacher_send_notice, name='kva_teacher_send_notice'),
    url(r'^kva/teacher_send_class_notice/(?P<subject_id1>\d+)/(?P<class_field1>\w+)/(?P<section1>\w+)/$', kvaschool_views.teacher_send_class_notice, name='kva_teacher_class_send_notice'),
    url(r'^kva/teacher_view_calendar/$', kvaschool_views.teacher_view_calendar, name='kva_teacher_view_calendar'),
    url(r'^kva/teacher_view_sent_notice/$', kvaschool_views.teacher_view_sent_notice, name='kva_teacher_view_sent_notice'),
    url(r'^kva/teacher_view_received_notice/$', kvaschool_views.teacher_view_received_notice, name='kva_teacher_view_received_notice'),
    #student
    url(r'^kva/student_profile_info/$', kvaschool_views.student_profile_info, name='kva_student_profile_info'),
    url(r'^kva/student_view_received_notice/$', kvaschool_views.student_view_received_notice, name='kva_student_view_received_notice'),
    url(r'^kva/student_view_calendar/$', kvaschool_views.student_view_calendar, name='kva_student_view_calendar'),
    url(r'^kva/student_view_subjects/$', kvaschool_views.student_view_subjects, name='kva_student_view_subjects'),
    url(r'^kva/student_view_exam/$', kvaschool_views.student_view_exam, name='kva_student_view_exam'),
    url(r'^kva/student_single_exam_view/(?P<exam_id1>\d+)/$', kvaschool_views.student_single_exam_view, name='kva_student_single_exam_view'),

]
