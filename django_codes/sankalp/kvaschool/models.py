# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class SankalpKVARouter(object):
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'kvaschool':
            return 'sankalp_kva'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'kvaschool':
            return 'sankalp_kva'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'kvaschool' or obj2._meta.app_label == 'kvaschool':
            return True
        return None

    def allow_syncdb(self, db, model):

        if db == 'sankalp_kva':
            return model._meta.app_label == 'kvaschool'
        elif model._meta.app_label == 'kvaschool':
            return False
        return None

class AdminLogin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    user_name = models.CharField(unique=True, max_length=20)
    password = models.TextField()
    last_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_login'


class ExamGroupDetail(models.Model):
    exam_group_id = models.AutoField(primary_key=True)
    exam_group_name = models.CharField(max_length=100)
    exam_group_date = models.CharField(max_length=30)
    exam_group_type = models.CharField(max_length=20)
    session = models.CharField(max_length=20, blank=True, null=True)
    results_declared = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'exam_group_detail'


class ExamGroupReportsSingle(models.Model):
    exam_group_id = models.IntegerField(primary_key=True)
    student_id = models.IntegerField()
    report_loc = models.CharField(max_length=200)
    remote_link = models.CharField(max_length=200)
    status = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'exam_group_reports_single'
        unique_together = (('exam_group_id', 'student_id'),)


class ExamGroupScoring(models.Model):
    exam_group_id = models.IntegerField(primary_key=True)
    subject_id = models.IntegerField()
    student_id = models.IntegerField()
    max_score = models.IntegerField(blank=True, null=True)
    cur_score = models.IntegerField(blank=True, null=True)
    percentage = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    grade = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'exam_group_scoring'
        unique_together = (('exam_group_id', 'subject_id', 'student_id'),)


class NotificationDetail(models.Model):
    notification_id = models.AutoField(primary_key=True)
    notification_creator = models.CharField(max_length=15)
    creator_id = models.IntegerField(blank=True, null=True)
    subject = models.CharField(max_length=100, blank=True, null=True)
    message = models.CharField(max_length=450, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notification_detail'


class NotificationTarget(models.Model):
    notification_id = models.IntegerField()
    target_type = models.CharField(max_length=20)
    target_id = models.IntegerField(blank=True, null=True)
    target_class = models.CharField(max_length=5, blank=True, null=True)
    target_section = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notification_target'


class StudentAcademicEnrollmentDetail(models.Model):
    student_id = models.IntegerField(unique=True)
    class_field = models.CharField(db_column='class', max_length=2)  # Field renamed because it was a Python reserved word.
    section = models.CharField(max_length=1)
    roll_number = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'student_academic_enrollment_detail'


class StudentLogin(models.Model):
    student_id = models.AutoField(primary_key=True)
    fullname = models.CharField(unique=True, max_length=50)
    emailid = models.CharField(unique=True, max_length=100)
    phone = models.CharField(unique=True, max_length=15)
    password = models.CharField(max_length=100)
    unencrypted = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'student_login'


class StudentSubjectDetail(models.Model):
    student_id = models.IntegerField(primary_key=True)
    subject_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'student_subject_detail'
        unique_together = (('student_id', 'subject_id'),)


class SubjectDetails(models.Model):
    subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(unique=True, max_length=30)
    subject_code = models.CharField(unique=True, max_length=10)
    is_major = models.CharField(max_length=5)

    class Meta:
        managed = False
        db_table = 'subject_details'


class TeacherLogin(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    fullname = models.CharField(unique=True, max_length=50)
    emailid = models.CharField(unique=True, max_length=100)
    phone = models.CharField(unique=True, max_length=15)
    password = models.CharField(max_length=100)
    unencrypted = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'teacher_login'


class TeacherSubjectDetail(models.Model):
    teacher_id = models.IntegerField(blank=True, null=True)
    subject_id = models.IntegerField(primary_key=True)
    class_field = models.CharField(db_column='class', max_length=5)  # Field renamed because it was a Python reserved word.
    section = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'teacher_subject_detail'
        unique_together = (('subject_id', 'class_field', 'section'),)


class UpdateTracker(models.Model):
    table_name = models.CharField(max_length=100, blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'update_tracker'
