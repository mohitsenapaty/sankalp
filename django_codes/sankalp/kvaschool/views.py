# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from .models import *
import random, string
import hashlib, os
from collections import OrderedDict
from django.core.files.storage import FileSystemStorage
from django.utils.encoding import smart_str
from django.core.files import File
# Create your views here.

def home(request):
    returnDict = {}

    is_logged_in = 0
    if not request.session.get("username") == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

    returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'logintype':request.session.get("type")}
    template = 'kva_home.html'
    return render(request, template, returnDict)

def login_page(request):
    is_logged_in = 0
    if not request.session.get("username") == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1
        return HttpResponseRedirect('/index/kva/home/')

    #region: authenticate login
    #import pdb; pdb.set_trace();
    _username = request.POST.get("username")
    _password = request.POST.get("password")
    _type = request.POST.get("logintype")

    if not _username:
        template = 'kva_login_page.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'error_message':'None', 'logintype':request.session.get('type')}
        return render(request, template, returnDict)
    print _username, _password, _type
    auth_result = get_authentication(_username, _password, _type)

    if auth_result:
        request.session['logged_in'] = True
        if _type == 'Student':
            request.session['username'] = _username
            request.session['id'] = auth_result['student_id']
            request.session['type'] = 'Student'
        elif _type == 'Teacher':
            request.session['username'] = _username
            request.session['id'] = auth_result['teacher_id']
            request.session['type'] = 'Teacher'
        elif _type == 'Admin':
            request.session['username'] = _username
            request.session['id'] = auth_result['admin_id']
            request.session['type'] = 'Admin'
        #set other session params
        is_logged_in = 1
        template = 'kva_login_page.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'error_message':'None', 'logintype':request.session.get('type')}
        return render(request, template, returnDict)
    else:
        template = 'kva_login_page.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'error_message':"Wrong Credentials/Non-existent Account",'logintype':request.session.get('type')}
        return render(request, template, returnDict)
        pass

    #endregion
    #import pdb; pdb.set_trace();
    

    template = 'kva_login_page.html'
    returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username")}
    return render(request, template, returnDict)


def get_authentication(_user, _pass, _t):
    try:
        if _t == 'Student':
            s1 = StudentLogin.objects.get(emailid=_user).__dict__
            if s1['password'] == hashlib.sha224(_pass).hexdigest():
                return s1
            else:
                return None
        elif _t == 'Teacher':
            s1 = TeacherLogin.objects.get(emailid=_user).__dict__
            if s1['password'] == hashlib.sha224(_pass).hexdigest():
                return s1
            else:
                return None
        elif _t == 'Admin':
            print 'here', _user, _pass, _t
            s1 = AdminLogin.objects.get(user_name=_user).__dict__
            if s1['password'] == hashlib.sha224(_pass).hexdigest():
                return s1
            else:
                return None
    except:
        return None

def log_out(request):
    context = locals()
    request.session.flush()
    template = 'kva_logged_out.html'
    return render(request, template, context)


def admin_profile_info(request):
    returnDict = {}
    template = 'admin_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Admin':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        admin_object = AdminLogin.objects.get(user_name=_username)

        if admin_object == None:
            #return error page
            template = 'kva_admin_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        template = 'kva_admin_profile_info.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'admin_login':admin_object.__dict__}
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_excel_upload(request):
    excel_file = request.FILES.get("excel_file")
    fs = FileSystemStorage()
    filename = fs.save("teacher_excel.xls", excel_file)
    if filename:
        return render(request, 'kva_teacher_excel_upload.html', {'msg':'Upload Successful'})
    else:
        return render(request, 'kva_teacher_excel_upload.html', {'msg':'Upload Failed'})


def student_excel_upload(request):
    excel_file = request.FILES.get("excel_file")
    class_ = request.POST.get("class")
    section = request.POST.get("section")
    fs = FileSystemStorage()
    file_name = class_+"_" + section + "_student_excel.xls"
    filename = fs.save(file_name, excel_file)
    if filename:
        return render(request, 'kva_student_excel_upload.html', {'msg':'Upload Successful'})
    else:
        return render(request, 'kva_student_excel_upload.html', {'msg':'Upload Failed'})

def admin_view_exam(request):
    returnDict = {}
    template = 'kva_admin_view_exam.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Admin':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        admin_object = AdminLogin.objects.get(user_name=_username)

        if admin_object == None:
            #return error page
            template = 'kva_admin_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        exam_objs = ExamGroupDetail.objects.all().order_by('-session');
        exam_arr = []
        for exam_obj in exam_objs:
            exam_arr.append(exam_obj.__dict__);
        template = 'kva_admin_view_exam.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'admin_login':admin_object.__dict__, 'exam_arr':exam_arr}
        return render(request, template, returnDict)
    else:
        return HttpResponseRedirect('/index/kva/home')


def admin_perform_view(request, exam_id1):
    i_exam_id = int(exam_id1)
    returnDict = {}
    template = 'kva_admin_view_exam.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Admin':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        admin_object = AdminLogin.objects.get(user_name=_username)

        if admin_object == None:
            #return error page
            template = 'kva_admin_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        class_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        sec_arr = ['A', 'B', 'C']
        student_pdf_dict = OrderedDict()
        for _cls in class_arr:
            student_pdf_dict[_cls] = OrderedDict()
            for _sec in sec_arr:
                student_pdf_dict[_cls][_sec] = OrderedDict()
                student_acad_enroll_objs = StudentAcademicEnrollmentDetail.objects.filter(class_field=_cls, section=_sec).order_by('roll_number')
                for student_obj in student_acad_enroll_objs:
                    student_id_1 = int(student_obj.__dict__.get('student_id'))
                    roll_number = student_obj.__dict__.get('roll_number')
                    #print student_id_1, i_exam_id
                    exam_report_objs = ExamGroupReportsSingle.objects.filter(exam_group_id=i_exam_id,student_id=student_id_1)
                    #print exam_report_objs.__dict__
                    if len(exam_report_objs)>0:
                        print student_id_1, i_exam_id
                        print len(exam_report_objs)
                        st_obj = exam_report_objs[0].__dict__
                        st_obj["report_file_name"] = os.path.basename(st_obj.get('report_loc'))[0:-4:]
                        student_pdf_dict[_cls][_sec][roll_number] = st_obj
                        
                    else:
                        student_pdf_dict[_cls][_sec][roll_number] = {'report_loc':''}
        #exam_report_objs = ExamGroupReportsSingle.objects.filter(exam_group_id=i_exam_id).order_by('-session')
        #exam_arr = []
        #for exam_obj in exam_objs:
        #    exam_arr.append(exam_obj.__dict__);
        #print student_pdf_dict        
        template = 'kva_admin_perform_view.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'admin_login':admin_object.__dict__, 'report_dict':student_pdf_dict}
        return render(request, template, returnDict)
    else:
        return HttpResponseRedirect('/index/kva/home')

def admin_download_file(request, file_name):
    path_to_file = '/var/tmp/'+file_name+'.pdf'
    f = open(path_to_file, 'r')
    myfile = File(f)
    response = HttpResponse(myfile, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=' + file_name
    return response


def add_student(request):
    class_ = request.POST.get("class")
    section = request.POST.get("section")
    add_result = False
    try:
        _fullname = request.POST.get("fullname")
        _email = request.POST.get("email")
        _phone = request.POST.get("phone")
        _enrollment_number = request.POST.get("enrollment_number")
        _father_name = request.POST.get("father_name")
        _mother_name = request.POST.get("mother_name")
        _class = request.POST.get("class")
        _sec = request.POST.get("section")
        _roll_number = request.POST.get("roll_number")
        _unencrypted = id_generator()
        _encrypt_password = hashlib.sha224(_unencrypted).hexdigest()
        if not (_roll_number.isdigit()):
            return render(request, 'kva_add_student.html', {'msg':'Student Addition Failed. Details might be incorrect or already present.'})
        student_login_entry = StudentLogin(fullname=_fullname,emailid=_email,phone=_phone,password=_encrypt_password,unencrypted=_unencrypted,enrollment_number=_enrollment_number,father_name=_father_name,mother_name=_mother_name)
        student_login_entry.save()
        _student_id = StudentLogin.objects.get(enrollment_number=_enrollment_number).student_id
        student_academic_detail_entry = StudentAcademicEnrollmentDetail(student_id=_student_id,roll_number=_roll_number,class_field=_class,section=_sec)  
        student_academic_detail_entry.save()
        add_result = True      
    except Exception as ex:
        print 'b'    
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Successful'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Failed. Details might be already present.'})

def id_generator(size=10, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
    return ''.join(random.choice(chars) for _ in range(size))


def add_teacher(request):
    #class_ = request.POST.get("class")
    #section = request.POST.get("section")
    add_result = False
    try:
        _fullname = request.POST.get("fullname")
        _email = request.POST.get("email")
        _phone = request.POST.get("phone")
        #_enrollment_number = request.POST.get("enrollment_number")
        #_father_name = request.POST.get("father_name")
        #_mother_name = request.POST.get("mother_name")
        #_class = request.POST.get("class")
        #_sec = request.POST.get("section")
        #_roll_number = request.POST.get("roll_number")
        _unencrypted = id_generator()
        _encrypt_password = hashlib.sha224(_unencrypted).hexdigest()
        #if not (_roll_number.isdigit()):
        #    return render(request, 'kva_add_student.html', {'msg':'Student Addition Failed. Details might be incorrect or already present.'})
        teacher_login_entry = TeacherLogin(fullname=_fullname,emailid=_email,phone=_phone,password=_encrypt_password,unencrypted=_unencrypted)
        teacher_login_entry.save()
        #_teacher_id = TeacherLogin.objects.get(enrollment_number=_enrollment_number).student_id
        #student_academic_detail_entry = StudentAcademicEnrollmentDetail(student_id=_student_id,roll_number=_roll_number,class_field=_class,section=_sec)
        #student_academic_detail_entry.save()
        add_result = True
    except Exception as ex:
        print 'b'
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Teacher Addition Successful'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Teacher Addition Failed. Details might be already present.'})


def view_student_admin(request):
    class_ = request.POST.get("class", "1")
    section_ = request.POST.get("section", "A")
    view_result = False
    student_list = []
    try:
        st_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_,section=section_)
        for st_obj in st_arr:
            st_id = st_obj.__dict__.get("student_id")
            st_full_obj = StudentLogin.objects.get(student_id=st_id).__dict__
            st_full_obj["class"]=st_obj.__dict__.get("class_field")
            st_full_obj["section"]=st_obj.__dict__.get("section")
            st_full_obj["roll_number"]=st_obj.__dict__.get("roll_number")
            student_list.append(st_full_obj)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return render(request, 'kva_view_student_admin.html', {'msg':'Teacher Addition Successful', 'studentList':student_list, 'status':1})
    else:
        return render(request, 'kva_view_student_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0})
  

def view_teacher_admin(request):
    #class_ = request.POST.get("class", "1")
    #section_ = request.POST.get("section", "A")
    view_result = False
    teacher_list = []
    try:
        st_arr = TeacherLogin.objects.all()
        for st_obj in st_arr:
            #st_id = st_obj.__dict__.get("student_id")
            #st_full_obj = StudentLogin.objects.get(student_id=st_id).__dict__
            #st_full_obj["class"]=st_obj.__dict__.get("class_field")
            #st_full_obj["section"]=st_obj.__dict__.get("section")
            #st_full_obj["roll_number"]=st_obj.__dict__.get("roll_number")
            teacher_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return render(request, 'kva_view_teacher_admin.html', {'msg':'Teacher Addition Successful', 'studentList':teacher_list, 'status':1})
    else:
        return render(request, 'kva_view_teacher_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0})


