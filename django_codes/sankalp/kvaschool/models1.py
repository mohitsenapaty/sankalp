# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class AdminLogin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    user_name = models.CharField(unique=True, max_length=20)
    password = models.TextField()
    last_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_login'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class CalenderEventDetail(models.Model):
    holiday_id = models.AutoField(primary_key=True)
    session = models.CharField(max_length=20, blank=True, null=True)
    occasion = models.CharField(max_length=50, blank=True, null=True)
    details = models.CharField(max_length=500, blank=True, null=True)
    start_date = models.CharField(max_length=20, blank=True, null=True)
    end_date = models.CharField(max_length=20, blank=True, null=True)
    start_dt = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'calender_event_detail'


class ClassTeacherDetail(models.Model):
    teacher_id = models.IntegerField(unique=True, primary_key=True)
    class_field = models.CharField(db_column='class', max_length=2)  # Field renamed because it was a Python reserved word.
    section = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'class_teacher_detail'
        unique_together = (('class_field', 'section'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class ExamGroupDetail(models.Model):
    exam_group_id = models.AutoField(primary_key=True)
    exam_group_name = models.CharField(max_length=100)
    exam_group_date = models.CharField(max_length=30)
    exam_group_type = models.CharField(max_length=20)
    session = models.CharField(max_length=20, blank=True, null=True)
    results_declared = models.CharField(max_length=1, blank=True, null=True)
    term_number = models.CharField(max_length=1, blank=True, null=True)
    term_final = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'exam_group_detail'


class ExamGroupReportsSingle(models.Model):
    exam_group_id = models.IntegerField()
    student_id = models.IntegerField()
    report_loc = models.CharField(max_length=200)
    remote_link = models.CharField(max_length=200)
    status = models.CharField(max_length=20)
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'exam_group_reports_single'
        unique_together = (('exam_group_id', 'student_id'),)


class ExamGroupScoring(models.Model):
    exam_group_id = models.IntegerField()
    subject_id = models.IntegerField()
    student_id = models.IntegerField()
    max_score = models.IntegerField(blank=True, null=True)
    cur_score = models.IntegerField(blank=True, null=True)
    percentage = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    grade = models.CharField(max_length=3, blank=True, null=True)
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'exam_group_scoring'
        unique_together = (('exam_group_id', 'subject_id', 'student_id'),)


class HostelDetail(models.Model):
    hostel_id = models.AutoField(primary_key=True)
    hostel_name = models.CharField(max_length=100, blank=True, null=True)
    hostel_address = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hostel_detail'


class HouseDetail(models.Model):
    house_id = models.AutoField(primary_key=True)
    house_name = models.CharField(max_length=30, blank=True, null=True)
    house_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'house_detail'


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
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'notification_target'


class StudentAcademicEnrollmentDetail(models.Model):
    student_id = models.IntegerField(primary_key=True)
    class_field = models.CharField(db_column='class', max_length=2)  # Field renamed because it was a Python reserved word.
    section = models.CharField(max_length=1)
    roll_number = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'student_academic_enrollment_detail'


class StudentAhs(models.Model):
    exam_group_id = models.IntegerField()
    student_id = models.IntegerField()
    total_working_days = models.IntegerField(blank=True, null=True)
    attendance = models.IntegerField(blank=True, null=True)
    height = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    weight = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    bmi = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'student_ahs'
        unique_together = (('exam_group_id', 'student_id'),)


class StudentAlternateContactNumber(models.Model):
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.
    student_id = models.IntegerField(blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student_alternate_contact_number'


class StudentCorrespondenceAddress(models.Model):
    student_id = models.IntegerField(primary_key=True)
    address = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student_correspondence_address'


class StudentCsa(models.Model):
    exam_group_id = models.IntegerField()
    student_id = models.IntegerField()
    literary_interest = models.CharField(max_length=5, blank=True, null=True)
    communication_skill = models.CharField(max_length=5, blank=True, null=True)
    music = models.CharField(max_length=5, blank=True, null=True)
    art_craft = models.CharField(max_length=5, blank=True, null=True)
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'student_csa'
        unique_together = (('exam_group_id', 'student_id'),)


class StudentHouseDetail(models.Model):
    student_id = models.IntegerField(primary_key=True)
    house_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student_house_detail'


class StudentLogin(models.Model):
    student_id = models.AutoField(primary_key=True)
    fullname = models.CharField(max_length=50)
    emailid = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=100)
    unencrypted = models.CharField(max_length=20)
    enrollment_number = models.CharField(unique=True, max_length=20, blank=True, null=True)
    father_name = models.CharField(max_length=100, blank=True, null=True)
    mother_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student_login'


class StudentPersonalTrait(models.Model):
    exam_group_id = models.IntegerField()
    student_id = models.IntegerField()
    discipline = models.CharField(max_length=5, blank=True, null=True)
    punctuality = models.CharField(max_length=5, blank=True, null=True)
    hygiene = models.CharField(max_length=5, blank=True, null=True)
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'student_personal_trait'
        unique_together = (('exam_group_id', 'student_id'),)


class StudentPwdRequest(models.Model):
    student_id = models.IntegerField()
    request_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'student_pwd_request'


class StudentRemarks(models.Model):
    exam_group_id = models.IntegerField()
    student_id = models.IntegerField()
    remarks = models.CharField(max_length=500, blank=True, null=True)
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'student_remarks'
        unique_together = (('exam_group_id', 'student_id'),)


class StudentResidentialDetail(models.Model):
    student_id = models.IntegerField(primary_key=True)
    date_of_birth = models.CharField(max_length=20, blank=True, null=True)
    hostel_resident = models.CharField(max_length=3, blank=True, null=True)
    residential_address = models.CharField(max_length=100, blank=True, null=True)
    hostel_id = models.IntegerField(blank=True, null=True)
    transportation = models.CharField(max_length=3, blank=True, null=True)
    fdb_db = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student_residential_detail'


class StudentSubjectDetail(models.Model):
    student_id = models.IntegerField()
    subject_id = models.IntegerField()
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

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
    unencrypted = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'teacher_login'


class TeacherPwdRequest(models.Model):
    teacher_id = models.IntegerField()
    request_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'teacher_pwd_request'


class TeacherSubjectDetail(models.Model):
    teacher_id = models.IntegerField(blank=True, null=True)
    subject_id = models.IntegerField()
    class_field = models.CharField(db_column='class', max_length=5)  # Field renamed because it was a Python reserved word.
    section = models.CharField(max_length=1)
    id_field = models.AutoField(db_column='id_', primary_key=True)  # Field renamed because it ended with '_'.

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


class VersionDb(models.Model):
    version_info = models.CharField(max_length=20, blank=True, null=True)
    lastupdated = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'version_db'
