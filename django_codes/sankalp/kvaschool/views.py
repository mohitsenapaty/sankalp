# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from .models import *
import random, string, math, requests, json
import hashlib, os, datetime
from collections import OrderedDict
from django.core.files.storage import FileSystemStorage
from django.utils.encoding import smart_str
from django.core.files import File
import xlrd, xlwt, re
# Create your views here.
encrypt_dict = {
    1:'573e73a5fec8d493bee2696c00cafd7b',
    2:'2057d280fb18eb129839b871235f6f22',
    3:'c106d694efa0bed0b4a62b3d9695c85b',
    4:'df063880a8f50afce0535c8226b2d19c',
    5:'c4d70324f9afdfadf18f6f4e514dd134',
    6:'d58014465c493da2d1dff8563b9a3bcf',
    7:'b15a6bd111bed3557ab341d253996dc0',
    8:'38c3cc1cda149ef381a2f4d8e2a6913c',

}
URL_DEV='http://127.0.0.1:8000/api/'
URL_PROD='http://52.27.104.46/api/'
URL_IN_USE = URL_DEV

api_key_shatabdi = '6db4aded-e001-11e8-a895-0200cd936042'
api_key_mohit = '41398bea-aaf7-11e8-a895-0200cd936042'
api_in_use = api_key_shatabdi
TemplateName = 'School'
phone_regex = re.compile(r"[0-9]+-?[0-9]+")


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


def forgot_password(request):
    is_logged_in = 0
    if not request.session.get("username") == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1
        return HttpResponseRedirect('/index/kva/home/')

    #region: authenticate login
    #import pdb; pdb.set_trace();
    _username = request.POST.get("username")
    _phone = request.POST.get("phone")
    _type = request.POST.get("logintype")

    if not _username:
        template = 'kva_forgot_password.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'error_message':'None', 'logintype':request.session.get('type')}
        return render(request, template, returnDict)
    print _username, _phone, _type

    try:
        if _type == 'Teacher':
            if TeacherLogin.objects.filter(phone=_phone, emailid=_username).exists():   
                tl_dict = TeacherLogin.objects.get(phone=_phone, emailid=_username).__dict__
                headers = {'content-type' : 'application/json'}
                URL_ADDR = URL_ADDR = URL_IN_USE+'getPasswordSMS/kaanger_valley_academy_raipur/'
                post_data = {'username':_username, 'loginType':'Teacher', 'phone':_phone}
                rr = requests.post(URL_ADDR, data = json.dumps(post_data), headers=headers)
                req_status = rr.status_code
                response_status = rr.__dict__.get('_content')
                
                if str(req_status) == '200' and json.loads(response_status).get('success') == 1:
                    auth_result = 1
                else:
                    auth_result = 2
            else:
                auth_result = 2
        elif _type == 'Student':
            if StudentLogin.objects.filter(phone=_phone, enrollment_number=_username).exists():
                sl_dict = StudentLogin.objects.get(phone=_phone, enrollment_number=_username).__dict__
                headers = {'content-type' : 'application/json'}
                URL_ADDR = URL_ADDR = URL_IN_USE+'getPasswordSMS/kaanger_valley_academy_raipur/'
                post_data = {'username':_username, 'loginType':'Student', 'phone':_phone}
                rr = requests.post(URL_ADDR, data = json.dumps(post_data), headers=headers)
                req_status = rr.status_code
                response_status = rr.__dict__.get('_content')
                
                if str(req_status) == '200' and json.loads(response_status).get('success') == 1:
                    auth_result = 1
                else:
                    auth_result = 2
            else:
                auth_result = 2
        else:
            auth_result = 2
    except:
        auth_result = 2

    if auth_result == 0:
        template = 'kva_forgot_password.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'error_message':'None', 'logintype':request.session.get('type')}
        return render(request, template, returnDict)
    elif auth_result == 2:
        template = 'kva_forgot_password.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'error_message':"Wrong phone/Non-existent Account",'logintype':request.session.get('type')}
        return render(request, template, returnDict)
    else:
        template = 'kva_forgot_password.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"), 'error_message':"SMS has been sent successfully. Check your phone number.",'logintype':request.session.get('type')}
        return render(request, template, returnDict)
        pass


def get_authentication(_user, _pass, _t):
    try:
        if _t == 'Student':
            s1 = StudentLogin.objects.get(enrollment_number=_user).__dict__
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
        returnDict['sectionList'] = ['A', 'B', 'C']
        returnDict['classList'] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',]
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
        try:
            excel_dict_list = []
            excel_dict = OrderedDict()
            book = xlrd.open_workbook(filename)
            num_sheet = len(book.sheet_names())
            for j_j in range(num_sheet):
                print j_j
                first_sheet = book.sheet_by_index(j_j)
                num_rows = first_sheet.nrows
                excel_col_names = [u'S No.', u'Class', u'Sec', u'Enr. No.', u"Student's Name", u'Father Name', u'Mother Name', u'Address for Correspondence', u'Mobile No ', u'DOB']
                excel_col_names1 = [u'S No.', u'Class', u'Sec', u'Enr. No.', u"Student's Name", u'Father Name', u'Mother Name', u'Address for Correspondence', u'Mobile No', u'DOB']
                excel_col_names2 = [u'S No.', u'Class', u'Sec', u'Enr. No.', u"Student's Name", u'Father Name', u'Mother Name', u'Address for Correspondence', u'MobileNo', u'DOB']
                class_roman_dict = {'I':1, 'II':2, 'III':3, 'IV':4, 'V':5, 'VI':6, 'VII':7, 'VIII':8, 'IX':9, 'X':10, 'XI':11, 'XII':12, }
                got_col_names = False
                print num_rows
                for i_ in range(num_rows):
                    ignore_row = False
                    col_list = first_sheet.row_values(i_)
                    for j_ in col_list:
                        if j_ == '':
                            ignore_row = True
                            break
                    if ignore_row == True:
                        print i_, 'ignore'
                        continue
                    if got_col_names == False:
                        print i_, 'not got col names'
                        print col_list
                        if col_list == excel_col_names or col_list == excel_col_names1 or col_list == excel_col_names2:
                            got_col_names = True
                            print i_, 'got col names'
                        continue
                    #get student details now.
                    _roll_number = int(col_list[0])
                    #print "aaaa"
                    student_class = class_roman_dict.get(col_list[1].strip())
                    student_section = col_list[2].strip()
                    if isinstance(col_list[3], float):
                        _enrollment_number = int(col_list[3])
                    else:
                        _enrollment_number = col_list[3].strip()
                    student_name = col_list[4].strip()
                    _father_name = col_list[5].strip()
                    _mother_name = col_list[6].strip()
                    corr_addr = col_list[7].strip()
                    phone_str = col_list[8].strip()
                    dob_ = datetime.datetime(*xlrd.xldate_as_tuple(col_list[9], book.datemode)).strftime('%Y-%m-%d')
                    _unencrypted = id_generator()
                    _encrypt_password = hashlib.sha224(_unencrypted).hexdigest()
                    all_phone = phone_regex.findall(phone_str)
                    _email = 'a@a.a'
                    if len(all_phone) > 0:
                        _main_phone = all_phone[0]
                    else:
                        _main_phone = '111'
                    #insert student details
                    student_login_entry = StudentLogin(fullname=student_name,emailid=_email,phone=_main_phone,password=_encrypt_password,unencrypted=_unencrypted,enrollment_number=_enrollment_number,father_name=_father_name,mother_name=_mother_name)
                    student_login_entry.save()
                    _student_id = StudentLogin.objects.get(enrollment_number=_enrollment_number).student_id
                    student_academic_detail_entry = StudentAcademicEnrollmentDetail(student_id=_student_id,roll_number=_roll_number,class_field=student_class,section=student_section)  
                    student_academic_detail_entry.save()
                    sca_entry = StudentCorrespondenceAddress(student_id=_student_id,address=corr_addr)
                    sca_entry.save()
                    if len(all_phone) > 0:
                        for i_i in range(1, len(all_phone)):
                            sacn_entry = StudentAlternateContactNumber(student_id=_student_id,contact_number=all_phone[i_i])
                            sacn_entry.save()
                    col_length = len(col_list)
            is_success = 1
        except Exception as ex:
            print ex
            is_success = 0
        if is_success == 1:
            return render(request, 'kva_student_excel_upload.html', {'msg':'Upload Successful'})
        else:
            return render(request, 'kva_student_excel_upload.html', {'msg':'Upload failed'})
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
                student_acad_enroll_objs = StudentAcademicEnrollmentDetail.objects.filter(class_field=_cls, section=_sec)
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
        _address = request.POST.get("address")
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
        sca_entry = StudentCorrespondenceAddress(student_id=_student_id,address=_address)
        sca_entry.save()
        add_result = True      
    except Exception as ex:
        print 'b'    
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Failed. Details might be already present.', 'logintype':'Admin'})


def edit_student_admin(request, student_id1):
    i_student_id = int(student_id1)

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
        if _class and _sec:
            StudentAcademicEnrollmentDetail.objects.filter(student_id=i_student_id).update(class_field=_class, section=_sec)
        if _roll_number:
            StudentAcademicEnrollmentDetail.objects.filter(student_id=i_student_id).update(roll_number=_roll_number)
        if _fullname:
            StudentLogin.objects.filter(student_id=i_student_id).update(fullname=_fullname)
        if _email:
            StudentLogin.objects.filter(student_id=i_student_id).update(emailid=_email)
        if _phone:
            StudentLogin.objects.filter(student_id=i_student_id).update(phone=_phone)
        if _father_name:
            StudentLogin.objects.filter(student_id=i_student_id).update(father_name=_father_name)
        if _mother_name:
            StudentLogin.objects.filter(student_id=i_student_id).update(mother_name=_mother_name)
        add_result = True      
    except Exception as ex:
        print 'b'    
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Failed. Details might be already present.', 'logintype':'Admin'})


def edit_student_residential_admin(request, student_id1):
    i_student_id = int(student_id1)

    add_result = False
    try:
        date_ = request.POST.get('dob')
        if date_:
            date_parts = date_.split('/')
            date_mod = date_parts[1]+'-'+date_parts[0]+'-'+date_parts[2]

        _hostel_resident = request.POST.get("hostel_resident")
        _hostel_id = request.POST.get("hostel_id")
        _residential_address = request.POST.get("residential_address")
        _transportation = request.POST.get("transportation")
        _fdb_db = request.POST.get("fdb_db")

        if StudentResidentialDetail.objects.filter(student_id=i_student_id).exists():
            if date_:
                StudentResidentialDetail.objects.filter(student_id=i_student_id).update(date_of_birth=date_mod)
                pass
            if _fdb_db:
                StudentResidentialDetail.objects.filter(student_id=i_student_id).update(fdb_db=_fdb_db)
                pass
            if _hostel_resident == 'Yes' and _hostel_resident and _hostel_id:
                StudentResidentialDetail.objects.filter(student_id=i_student_id).update(hostel_resident=_hostel_resident,hostel_id=_hostel_id,residential_address='',transportation='')
                pass
            elif _hostel_resident == 'No' and _transportation and _residential_address:
                StudentResidentialDetail.objects.filter(student_id=i_student_id).update(hostel_resident=_hostel_resident,hostel_id=-1,residential_address=_residential_address,transportation=_transportation)
                pass
            else:
                #return render(request, 'kva_add_.html', {'msg':'Student Addition Failed. Details might be already present.', 'logintype':'Admin'})
                pass
            pass
        else:
            if _hostel_resident == 'Yes' and _hostel_resident and _hostel_id:
                #StudentResidentialDetail.objects.filter(student_id=i_student_id).update(hostel_resident=_hostel_resident,hostel_id=_hostel_id,residential_address='',transportation='')
                srd_entry = StudentResidentialDetail(student_id=i_student_id,date_of_birth=date_mod,hostel_resident=_hostel_resident,hostel_id=_hostel_id,residential_address='',transportation='',fdb_db=_fdb_db)
                srd_entry.save()
                pass
            elif _hostel_resident == 'No' and _transportation and _residential_address:
                #StudentResidentialDetail.objects.filter(student_id=i_student_id).update(hostel_resident=_hostel_resident,hostel_id=-1,residential_address=_residential_address,transportation=_transportation)
                srd_entry = StudentResidentialDetail(student_id=i_student_id,date_of_birth=date_mod,hostel_resident=_hostel_resident,hostel_id=-1,residential_address=_residential_address,transportation=_transportation,fdb_db=_fdb_db)
                srd_entry.save()
                pass
            else:
                return render(request, 'kva_add_.html', {'msg':'Student Addition Failed. Details might be already present.', 'logintype':'Admin'})
                pass
            pass

        add_result = True      
    except Exception as ex:
        print 'b'    
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Failed. Details might be already present.', 'logintype':'Admin'})


def edit_student_house_admin(request, student_id1):
    i_student_id = int(student_id1)

    add_result = False
    try:
        _house_id = request.POST.get("house_id")
        if StudentHouseDetail.objects.filter(student_id=i_student_id).exists():
            StudentHouseDetail.objects.filter(student_id=i_student_id).update(house_id=_house_id)
            pass
        else:
            shd_entry = StudentHouseDetail(student_id=i_student_id, house_id=_house_id)
            shd_entry.save()
            pass

        add_result = True      
    except Exception as ex:
        print 'b'    
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Student Addition Failed. Details might be already present.', 'logintype':'Admin'})


def id_generator(size=10, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
    return ''.join(random.choice(chars) for _ in range(size))


def add_teacher(request):
    add_result = False
    try:
        _fullname = request.POST.get("fullname")
        _email = request.POST.get("email")
        _phone = request.POST.get("phone")
        _unencrypted = id_generator()
        _encrypt_password = hashlib.sha224(_unencrypted).hexdigest()
 
        teacher_login_entry = TeacherLogin(fullname=_fullname,emailid=_email,phone=_phone,password=_encrypt_password,unencrypted=_unencrypted)
        teacher_login_entry.save()

        add_result = True
    except Exception as ex:
        print 'b'
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Teacher Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'logintype':'Admin'})


def add_exam(request):
    add_result = False
    try:
        #print request.POST
        date_ = request.POST.get('exam_date')
        date_parts = date_.split('/')
        date_mod = date_parts[1]+'-'+date_parts[0]+'-'+date_parts[2]
        #print date_mod 
        _exam_group_name = request.POST.get('exam_name')
        _exam_session = request.POST.get('exam_session')
        _all_class = request.POST.get('all_class')
        _exam_term = request.POST.get('exam_term')
        _is_final = request.POST.get('is_final')
        _exam_type = request.POST.get('exam_type')
        classes_selected = request.POST.getlist('selected_class[]')
        print classes_selected
        egd_entry = ExamGroupDetail(exam_group_name=_exam_group_name,exam_group_date=date_mod,exam_group_type=_exam_type,session=_exam_session,results_declared='N',term_number=_exam_term,term_final=_is_final)
        egd_entry.save()
        egd_id = egd_entry.exam_group_id
        if _all_class:
            if _exam_type == 'All Subjects':
                ssd_arr = StudentSubjectDetail.objects.all()
                for ssd_obj in ssd_arr:
                    ssd_dict = ssd_obj.__dict__
                    egs_entry = ExamGroupScoring(exam_group_id=egd_id,student_id=ssd_dict.get('student_id'),subject_id=ssd_dict.get('subject_id'))
                    egs_entry.save()
                pass
            elif _exam_type == 'Only Major':
                ssd_arr = StudentSubjectDetail.objects.all()
                for ssd_obj in ssd_arr:
                    ssd_dict = ssd_obj.__dict__
                    sd_dict = SubjectDetails.objects.get(subject_id=ssd_dict.get('subject_id')).__dict__
                    if sd_dict.get('is_major') == 'Minor':
                        continue
                    egs_entry = ExamGroupScoring(exam_group_id=egd_id,student_id=ssd_dict.get('student_id'),subject_id=ssd_dict.get('subject_id'))
                    egs_entry.save()
                pass
            else:
                return render(request, 'kva_add_.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'logintype':'Admin'})
            pass
        else:
            if len(classes_selected) == 0:
                return render(request, 'kva_add_.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'logintype':'Admin'})
                pass
            else:
                if _exam_type == 'All Subjects':
                    for _class in classes_selected:
                        saed_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=_class)
                        for saed_obj in saed_arr:
                            saed_dict = saed_obj.__dict__
                            ssd_arr = StudentSubjectDetail.objects.filter(student_id=saed_dict.get('student_id'))
                            for ssd_obj in ssd_arr:
                                ssd_dict = ssd_obj.__dict__
                                egs_entry = ExamGroupScoring(exam_group_id=egd_id,student_id=ssd_dict.get('student_id'),subject_id=ssd_dict.get('subject_id'))
                                egs_entry.save()
                    pass
                elif _exam_type == 'Only Major':
                    for _class in classes_selected:
                        saed_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=_class)
                        for saed_obj in saed_arr:
                            saed_dict = saed_obj.__dict__
                            ssd_arr = StudentSubjectDetail.objects.filter(student_id=saed_dict.get('student_id'))
                            for ssd_obj in ssd_arr:
                                ssd_dict = ssd_obj.__dict__
                                sd_dict = SubjectDetails.objects.get(subject_id=ssd_dict.get('subject_id')).__dict__
                                if sd_dict.get('is_major') == 'Minor':
                                    continue
                                egs_entry = ExamGroupScoring(exam_group_id=egd_id,student_id=ssd_dict.get('student_id'),subject_id=ssd_dict.get('subject_id'))
                                egs_entry.save()
                    pass
                else:
                    return render(request, 'kva_add_.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'logintype':'Admin'})
                pass
        #if 
        #teacher_login_entry = TeacherLogin(fullname=_fullname,emailid=_email,phone=_phone,password=_encrypt_password,unencrypted=_unencrypted)
        #teacher_login_entry.save()

        add_result = True
    except Exception as ex:
        print 'b'
        print ex
    if add_result:
        returnDict = {'msg':'Exam Addition Successful', 'logintype':'Admin'}
        return render(request, 'kva_add_.html', returnDict)
    else:
        return render(request, 'kva_add_.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'logintype':'Admin'})


def add_subject(request):
    #class_ = request.POST.get("class")
    #section = request.POST.get("section")
    add_result = False
    try:
        _subject_name = request.POST.get("subject_name")
        _subject_code = request.POST.get("subject_code")
        _is_major = request.POST.get("is_major")
        _unencrypted = id_generator()
        _encrypt_password = hashlib.sha224(_unencrypted).hexdigest()
        #if not (_roll_number.isdigit()):
        #    return render(request, 'kva_add_student.html', {'msg':'Student Addition Failed. Details might be incorrect or already present.'})
        teacher_login_entry = SubjectDetails(subject_name=_subject_name,subject_code=_subject_code,is_major=_is_major)
        teacher_login_entry.save()
        add_result = True
    except Exception as ex:
        print 'b'
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Subject Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Subject Addition Failed. Details might be already present.', 'logintype':'Admin'})


def declare_result(request, exam_id1):
    i_exam_id = int(exam_id1)
    add_result = False
    if not request.session.get("type") == 'Admin':
        return HttpResponseRedirect('/index/kva/home/')
    admin_id = request.session.get('id')
    request_key = encrypt_dict[int(admin_id)]
    
    try:
        headers = {'content-type' : 'application/json'}
        URL_ADDR = URL_ADDR = URL_IN_USE+'addEvents/'+request_key+'/kaanger_valley_academy_raipur/'
        post_data = {'user_id':int(admin_id), 'loginType':'Admin', 'exam_group_id':i_exam_id}
        rr = requests.post(URL_ADDR, data = json.dumps(post_data), headers=headers)
        req_status = rr.status_code
        response_status = rr.__dict__.get('_content')
        
        if str(req_status) == '200' and json.loads(response_status).get('success') == 1:
            add_result = True
    except Exception as ex:
        print 'b'
        print ex
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Teacher Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'logintype':'Admin'})


def create_notice_admin(request):
    add_result = False
    if not request.session.get("type") == 'Admin':
        return HttpResponseRedirect('/index/kva/home/')
    admin_id = request.session.get('id')
    request_key = encrypt_dict[int(admin_id)]
    subject_ = request.POST.get('subject')
    message_ = request.POST.get('message')
    _all_class = request.POST.get('all_class')
    if _all_class == 'True':
        _all_class = True
        pass
    else:
        _all_class = False
    _all_sec = request.POST.get('all_sec')
    if _all_sec == 'True':
        _all_sec = True
        pass
    else:
        _all_sec = False
    target_type_ = request.POST.get('target_type')
    classes_selected = request.POST.getlist('selected_class[]')
    sec_selected = request.POST.getlist('selected_sec[]')
    single_student_ = False
    print subject_, message_, _all_class, _all_sec, target_type_, classes_selected, sec_selected
    
    try:
        headers = {'content-type' : 'application/json'}
        URL_ADDR = URL_IN_USE+'addNotice/'+request_key+'/kaanger_valley_academy_raipur/'
        post_data = {'user_id':int(admin_id), 'loginType':'Admin', 'subject':subject_ , 'message':message_ , 'noticeFor':target_type_ ,'all_class_selected': _all_class, 'classes_selected': classes_selected, 'all_section_selected': _all_sec,'sections_selected':sec_selected,'singleStudent':single_student_}
        rr = requests.post(URL_ADDR, data = json.dumps(post_data), headers=headers)
        req_status = rr.status_code
        response_status = rr.__dict__.get('_content')
        
        if str(req_status) == '200' and json.loads(response_status).get('success') == 1:
            add_result = True
    except Exception as ex:
        print 'b'
        print ex
    
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition Failed. Details might be already present.', 'logintype':'Admin'})


def add_event_admin(request):
    add_result = False
    if not request.session.get("type") == 'Admin':
        return HttpResponseRedirect('/index/kva/home/')
    admin_id = request.session.get('id')
    request_key = encrypt_dict[int(admin_id)]
    occasion_ = request.POST.get('occasion')
    details_ = request.POST.get('details')
    start_date_ = request.POST.get('start_date')
    start_date_parts = start_date_.split('/')
    start_date_mod = start_date_parts[1]+'-'+start_date_parts[0]+'-'+start_date_parts[2]
    end_date_ = request.POST.get('end_date')
    end_date_parts = end_date_.split('/')
    end_date_mod = end_date_parts[1]+'-'+end_date_parts[0]+'-'+end_date_parts[2]
    session_ = request.POST.get('session')
    single_student_ = False
    #print subject_, message_, _all_class, _all_sec, target_type_, classes_selected, sec_selected
    
    try:
        headers = {'content-type' : 'application/json'}
        URL_ADDR = URL_IN_USE+'addEvents/'+request_key+'/kaanger_valley_academy_raipur/'
        post_data = {'user_id':int(admin_id), 'loginType':'Admin', 'occasion':occasion_ , 'details':details_ , 'session':session_ ,'event_start_date': start_date_mod, 'event_end_date': end_date_mod,}
        rr = requests.post(URL_ADDR, data = json.dumps(post_data), headers=headers)
        req_status = rr.status_code
        response_status = rr.__dict__.get('_content')
        
        if str(req_status) == '200' and json.loads(response_status).get('success') == 1:
            add_result = True
    except Exception as ex:
        print 'b'
        print ex
    
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition Successful', 'logintype':'Admin'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition Failed. Details might be already present.', 'logintype':'Admin'})


def add_hostel_admin(request):
    hostel_name_ = request.POST.get('hostel_name')
    hostel_address_ = request.POST.get('hostel_address')
    view_result = False
    hostel_list = []
    try:
        hd_entry = HostelDetail(hostel_name=hostel_name_, hostel_address=hostel_address_)
        hd_entry.save()
        st_arr = HostelDetail.objects.all()
        for st_obj in st_arr:
            hostel_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'hostelList':hostel_list, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_hostel_admin.html', returnDict)
    else:
        return render(request, 'kva_view_hostel_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def add_house_admin(request):
    house_name_ = request.POST.get('house_name')
    house_code_ = request.POST.get('house_code')
    view_result = False
    house_list = []
    try:
        hd_entry = HouseDetail(house_name=house_name_, house_code=house_code_)
        hd_entry.save()
        st_arr = HouseDetail.objects.all()
        for st_obj in st_arr:
            house_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'houseList':house_list, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_house_admin.html', returnDict)
    else:
        return render(request, 'kva_view_house_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def assign_teacher_subject_admin(request, teacher_id1):
    #class_ = request.POST.get("class", "1")
    #section_ = request.POST.get("section", "A")
    i_teacher_id = int(teacher_id1)
    view_result = False
    teacher_list = []
    subject_list = []
    t_s_list = []
    try:
        #handle request
        class_ = request.POST.get("class")
        section_ = request.POST.get("section")
        subject_id_ = request.POST.get("subject_id")
        print class_, section_, subject_id_
        post_status = 0
        if class_ and section_ and subject_id_:
            try:
                tsd_entry = TeacherSubjectDetail(teacher_id=i_teacher_id,subject_id=subject_id_,class_field=class_,section=section_)
                tsd_entry.save()
                post_status = 1
                pass
            except Exception as ex:
                pass
        st_arr = TeacherLogin.objects.all()
        sd_arr = SubjectDetails.objects.all()
        for st_obj in sd_arr:
            st_obj_dict = st_obj.__dict__
            subject_list.append(st_obj.__dict__)
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            teacher_list.append(st_obj.__dict__)
        if i_teacher_id == 0:
            pass
        else:
            try:
                tsd_arr = TeacherSubjectDetail.objects.filter(teacher_id=i_teacher_id)
                for tsd_obj in tsd_arr:
                    tsd_obj_dict = tsd_obj.__dict__
                    sd_obj = SubjectDetails.objects.get(subject_id=tsd_obj_dict.get('subject_id')).__dict__
                    tsd_obj_dict['subject_name'] = sd_obj['subject_name']
                    tsd_obj_dict['subject_code'] = sd_obj['subject_code']
                    tsd_obj_dict['is_major'] = sd_obj['is_major']
                    t_s_list.append(tsd_obj_dict)
                subject_status = 1
            except Exception as ex:
                print ex
                subject_status = 0
            pass
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'teacherList':teacher_list, 'status':1}
        returnDict['subject_status'] = subject_status
        returnDict['teacher_subjects'] = t_s_list
        returnDict['teacher_id'] = i_teacher_id
        returnDict['subjectList'] = subject_list
        returnDict['post_status'] = post_status
        returnDict['logintype'] = 'Admin'
        return render(request, 'kva_assign_teacher_subject_admin.html', returnDict)
    else:
        return render(request, 'kva_assign_teacher_subject_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def assign_class_subject_admin(request):
    #class_ = request.POST.get("class", "1")
    #section_ = request.POST.get("section", "A")
    #i_teacher_id = int(teacher_id1)
    class_field1 = request.POST.get("class", "1")
    section1 = request.POST.get("section", "A")
    _subject_id = request.POST.get("subject_id")
    view_result = False
    student_list = []
    subject_list = []
    t_s_list = []
    subject_assigned_dict = {}
    subject_assign_status = 0
    try:
        st_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_field1,section=section1)
        sd_arr = SubjectDetails.objects.all()
        if _subject_id:
            try:
                for st_obj in st_arr:
                    if StudentSubjectDetail.objects.filter(subject_id=_subject_id, student_id=st_obj.__dict__.get('student_id')).exists():
                        pass
                    else:
                        ssd_entry = StudentSubjectDetail(subject_id=_subject_id, student_id=st_obj.__dict__.get('student_id'))
                        ssd_entry.save()
                subject_assign_status = 2
                pass
            except Exception as ex:
                print ex
                subject_assign_status = 1
        else:
            subject_assign_status = 0

        for st_obj in sd_arr:
            st_obj_dict = st_obj.__dict__
            subject_list.append(st_obj.__dict__)
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            try:
                sl_obj = StudentLogin.objects.get(student_id=st_obj_dict.get('student_id')).__dict__
                st_obj_dict['fullname'] = sl_obj.get('fullname')
                tsd_arr = StudentSubjectDetail.objects.filter(student_id=st_obj_dict.get('student_id'))
                t_s_list = []
                for tsd_obj in tsd_arr:
                    tsd_obj_dict = tsd_obj.__dict__
                    sd_obj = SubjectDetails.objects.get(subject_id=tsd_obj_dict.get('subject_id')).__dict__
                    tsd_obj_dict['subject_name'] = sd_obj['subject_name']
                    tsd_obj_dict['subject_code'] = sd_obj['subject_code']
                    tsd_obj_dict['is_major'] = sd_obj['is_major']
                    t_s_list.append(tsd_obj_dict)
                subject_status = 1
            except Exception as ex:
                print ex
                subject_status = 0
            st_obj_dict['subject_arr'] = t_s_list
            student_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'studentList':student_list, 'status':1}
        #returnDict['subject_status'] = subject_status
        returnDict['subjectList'] = subject_list
        #returnDict['post_status'] = post_status
        returnDict['logintype'] = 'Admin'
        returnDict['class_val'] = class_field1
        returnDict['section'] = section1
        returnDict['sectionList'] = ['A', 'B', 'C']
        returnDict['classList'] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',]
        returnDict['subject_assigned'] = subject_assign_status
        return render(request, 'kva_assign_class_subject_admin.html', returnDict)
    else:
        return render(request, 'kva_assign_class_subject_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def assign_student_subject_admin(request, student_id1):
    #class_ = request.POST.get("class", "1")
    #section_ = request.POST.get("section", "A")
    i_student_id = int(student_id1)
    view_result = False
    student_list = []
    subject_list = []
    t_s_list = []
    try:
        #handle request
        subject_id_ = request.POST.get("subject_id")
        post_status = 0
        if subject_id_:
            try:
                tsd_entry = StudentSubjectDetail(student_id=i_student_id,subject_id=subject_id_)
                tsd_entry.save()
                post_status = 1
                pass
            except Exception as ex:
                print ex
                pass
        
        sd_arr = SubjectDetails.objects.all()
        for st_obj in sd_arr:
            st_obj_dict = st_obj.__dict__
            subject_list.append(st_obj.__dict__)
        try:
            tsd_arr = StudentSubjectDetail.objects.filter(student_id=i_student_id)
            sad_obj = StudentAcademicEnrollmentDetail.objects.get(student_id=i_student_id).__dict__
            sld_obj = StudentLogin.objects.get(student_id=i_student_id).__dict__
            sld_obj['class_val'] = sad_obj.get('class_field')
            sld_obj['section'] = sad_obj.get('section')
            sld_obj['roll_number'] = sad_obj.get('roll_number')
            for tsd_obj in tsd_arr:
                tsd_obj_dict = tsd_obj.__dict__
                sd_obj = SubjectDetails.objects.get(subject_id=tsd_obj_dict.get('subject_id')).__dict__
                if TeacherSubjectDetail.objects.filter(subject_id=tsd_obj_dict.get('subject_id'), class_field=sad_obj.get('class_field'), section=sad_obj.get('section')).exists():
                    pre_tl_dict = TeacherSubjectDetail.objects.get(subject_id=tsd_obj_dict.get('subject_id'), class_field=sad_obj.get('class_field'), section=sad_obj.get('section')).__dict__
                    tl_dict = TeacherLogin.objects.get(teacher_id=pre_tl_dict.get('teacher_id')).__dict__
                    tsd_obj_dict['subject_teacher'] = tl_dict.get('fullname')
                    pass
                else:
                    tl_dict = {}
                    tsd_obj_dict['subject_teacher'] = ''
                tsd_obj_dict['subject_name'] = sd_obj['subject_name']
                tsd_obj_dict['subject_code'] = sd_obj['subject_code']
                tsd_obj_dict['is_major'] = sd_obj['is_major']
                t_s_list.append(tsd_obj_dict)
            subject_status = 1
        except Exception as ex:
            print ex
            subject_status = 0
            sld_obj = {}
        pass
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1}
        returnDict['subject_status'] = subject_status
        returnDict['student_subjects'] = t_s_list
        returnDict['student_id'] = i_student_id
        returnDict['subjectList'] = subject_list
        returnDict['post_status'] = post_status
        returnDict['logintype'] = 'Admin'
        returnDict['student_obj'] = sld_obj
        return render(request, 'kva_assign_student_subject_admin.html', returnDict)
    else:
        return render(request, 'kva_assign_teacher_subject_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def assign_classteacher_admin(request, teacher_id1):
    #class_ = request.POST.get("class", "1")
    #section_ = request.POST.get("section", "A")
    i_teacher_id = int(teacher_id1)
    view_result = False

    try:
        #handle request
        _class = request.POST.get('class')
        _sec = request.POST.get('section')
        if _class and _sec:
            ctd_entry = ClassTeacherDetail(teacher_id=i_teacher_id, class_field=_class, section=_sec)
            ctd_entry.save()
        tl_dict = TeacherLogin.objects.get(teacher_id=i_teacher_id).__dict__
        if ClassTeacherDetail.objects.filter(teacher_id=i_teacher_id).exists():
            ctd_dict = ClassTeacherDetail.objects.get(teacher_id=i_teacher_id).__dict__
            ctd_dict['status']=1
            ctd_dict['fullname']=tl_dict.get('fullname')
        else:
            ctd_dict = {}
            ctd_dict['status']=0
            ctd_dict['fullname']=tl_dict.get('fullname')
            ctd_dict['teacher_id'] = tl_dict.get('teacher_id')
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1}
        returnDict['sectionList'] = ['A', 'B', 'C']
        returnDict['classList'] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',]
        returnDict['ctd']=ctd_dict
        return render(request, 'kva_assign_classteacher_admin.html', returnDict)
    else:
        return render(request, 'kva_assign_classteacher_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


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
        return render(request, 'kva_view_student_admin.html', {'msg':'Teacher Addition Successful', 'studentList':student_list, 'status':1, 'class_value':class_, 'section':section_, 'logintype':'Admin'})
    else:
        return render(request, 'kva_view_student_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def view_single_student_admin(request, student_id1):
    i_student_id = int(student_id1)
    view_result = False
    student_dict = {}
    try:
        st_dict = StudentAcademicEnrollmentDetail.objects.get(student_id=i_student_id).__dict__
        sl_dict = StudentLogin.objects.get(student_id=i_student_id).__dict__
        if StudentHouseDetail.objects.filter(student_id=i_student_id).exists():
            shd_dict = StudentHouseDetail.objects.get(student_id=i_student_id).__dict__
            house_dict = HouseDetail.objects.get(house_id=shd_dict.get('house_id')).__dict__
            shd_dict['house_name'] = house_dict.get('house_name')
            shd_dict['is_added'] = 1
        else:
            shd_dict = {'is_added':0,}
        sl_dict['shd']=shd_dict
        if StudentResidentialDetail.objects.filter(student_id=i_student_id).exists():
            srd_dict = StudentResidentialDetail.objects.get(student_id=i_student_id).__dict__
            if srd_dict.get('hostel_resident') == 'Yes':
                hd_dict = HostelDetail.objects.get(hostel_id=int(srd_dict.get('hostel_id'))).__dict__
                srd_dict['hostel_name'] = hd_dict.get('hostel_name')
            else:
                srd_dict['hostel_name'] = 'None'
            srd_dict['is_added'] = 1
        else:
            srd_dict = {'is_added':0,}
        sl_dict['srd']=srd_dict
        sl_dict["class_val"]=st_dict.get("class_field")
        sl_dict["section"]=st_dict.get("section")
        sl_dict["roll_number"]=st_dict.get("roll_number")
        #get houses
        hsd_arr = HouseDetail.objects.all()
        houseList = []
        for hsd_obj in hsd_arr:
            hsd_dict = hsd_obj.__dict__
            houseList.append(hsd_dict)
        htd_arr = HostelDetail.objects.all()
        hostelList = []
        for htd_obj in htd_arr:
            htd_dict = htd_obj.__dict__
            hostelList.append(htd_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'studentDict':sl_dict, 'status':1, 'logintype':'Admin'}
        returnDict['sectionList'] = ['A', 'B', 'C']
        returnDict['classList'] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',]
        returnDict['hostelList'] = hostelList
        returnDict['houseList'] = houseList
        return render(request, 'kva_view_single_student_admin.html', returnDict)
    else:
        return render(request, 'kva_view_single_student_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def admin_student_performance_view(request, exam_id1):
    i_exam_id = int(exam_id1)
    class_ = request.POST.get("class", "1")
    section_ = request.POST.get("section", "A")
    view_result = False
    student_list = []
    try:
        st_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_,section=section_)
        for st_obj in st_arr:
            if not ExamGroupScoring.objects.filter(student_id=st_obj.__dict__.get("student_id"), exam_group_id=i_exam_id).exists():
                continue
            st_id = st_obj.__dict__.get("student_id")
            st_full_obj = StudentLogin.objects.get(student_id=st_id).__dict__
            st_full_obj["class"]=st_obj.__dict__.get("class_field")
            st_full_obj["section"]=st_obj.__dict__.get("section")
            st_full_obj["roll_number"]=st_obj.__dict__.get("roll_number")
            st_full_obj["subj_grade_arr"] = []
            egs_arr = ExamGroupScoring.objects.filter(exam_group_id=i_exam_id, student_id=st_id).order_by('subject_id')
            for egs_obj in egs_arr:
                egs_dict = egs_obj.__dict__
                sd_dict = SubjectDetails.objects.get(subject_id=egs_dict.get('subject_id')).__dict__
                egs_dict['subject_name'] = sd_dict.get('subject_name')
                egs_dict['subject_id'] = sd_dict.get('subject_id')
                st_full_obj["subj_grade_arr"].append(egs_dict)
            student_list.append(st_full_obj)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'studentList':student_list, 'status':1, 'class_value':class_, 'section':section_, 'logintype':'Admin'}
        returnDict['exam_id']=i_exam_id
        return render(request, 'kva_admin_student_performance_view.html', returnDict)
    else:
        return render(request, 'kva_admin_student_performance_view.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def admin_student_value_view(request, exam_id1):
    i_exam_id = int(exam_id1)
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
            st_full_obj["subj_grade_arr"] = []
            if not StudentCsa.objects.filter(student_id=st_obj.__dict__.get("student_id"), exam_group_id=i_exam_id).exists():
                st_csa_dict = {'csa_status':0}
                pass
            else:
                st_csa_dict = StudentCsa.objects.get(exam_group_id=i_exam_id, student_id=st_id).__dict__
                st_csa_dict['csa_status']=1
            st_full_obj['csa'] = st_csa_dict

            if not StudentPersonalTrait.objects.filter(student_id=st_obj.__dict__.get("student_id"), exam_group_id=i_exam_id).exists():
                st_pt_dict = {'pt_status':0}
                pass
            else:
                st_pt_dict = StudentPersonalTrait.objects.get(exam_group_id=i_exam_id, student_id=st_id).__dict__
                st_pt_dict['pt_status']=1
            st_full_obj['pt'] = st_pt_dict

            if not StudentAhs.objects.filter(student_id=st_obj.__dict__.get("student_id"), exam_group_id=i_exam_id).exists():
                st_ahs_dict = {'ahs_status':0}
                pass
            else:
                st_ahs_dict = StudentAhs.objects.get(exam_group_id=i_exam_id, student_id=st_id).__dict__
                st_ahs_dict['ahs_status']=1
            st_full_obj['ahs'] = st_ahs_dict

            if not StudentRemarks.objects.filter(student_id=st_obj.__dict__.get("student_id"), exam_group_id=i_exam_id).exists():
                st_rm_dict = {'rm_status':0}
                pass
            else:
                st_rm_dict = StudentRemarks.objects.get(exam_group_id=i_exam_id, student_id=st_id).__dict__
                st_rm_dict['rm_status']=1
            st_full_obj['rm'] = st_rm_dict

            student_list.append(st_full_obj)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'studentList':student_list, 'status':1, 'class_value':class_, 'section':section_, 'logintype':'Admin'}
        returnDict['exam_id']=i_exam_id
        return render(request, 'kva_admin_student_value_view.html', returnDict)
    else:
        return render(request, 'kva_admin_student_value_view.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})
  

def view_teacher_admin(request):
    view_result = False
    teacher_list = []
    try:
        st_arr = TeacherLogin.objects.all()
        for st_obj in st_arr:
            st_dict = st_obj.__dict__
            if ClassTeacherDetail.objects.filter(teacher_id=st_dict.get('teacher_id')).exists():
                ctd_dict = ClassTeacherDetail.objects.get(teacher_id=st_dict.get('teacher_id')).__dict__
                st_dict['ctd'] = {'status':1, 'class_':ctd_dict.get('class_field'), 'sec_':ctd_dict.get('section')}
                pass
            else:
                st_dict['ctd'] = {'status':0}
                pass
            teacher_list.append(st_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return render(request, 'kva_view_teacher_admin.html', {'msg':'Teacher Addition Successful', 'studentList':teacher_list, 'status':1, 'logintype':'Admin'})
    else:
        return render(request, 'kva_view_teacher_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def view_subject_admin(request):
    view_result = False
    subject_list = []
    try:
        st_arr = SubjectDetails.objects.all()
        for st_obj in st_arr:
            subject_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return render(request, 'kva_view_subject_admin.html', {'msg':'Teacher Addition Successful', 'subjectList':subject_list, 'status':1, 'logintype':'Admin'})
    else:
        return render(request, 'kva_view_subject_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def view_notice_admin(request):
    view_result = False
    notice_list = []
    returnDict = {}
    try:
        st_arr = NotificationDetail.objects.all().order_by('-created_at')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if st_obj_dict.get('notification_creator') == 'Admin':
                st_obj_dict['creator_name'] = AdminLogin.objects.get(admin_id=int(st_obj_dict.get('creator_id'))).__dict__.get('user_name')
            elif st_obj_dict.get('notification_creator') == 'Teacher':
                st_obj_dict['creator_name'] = TeacherLogin.objects.get(teacher_id=int(st_obj_dict.get('creator_id'))).__dict__.get('fullname')
            else:
                print st_obj_dict.get('notification_creator') == 'Admin'
                st_obj_dict['creator_name'] = 'Invalid'
            #nt_obj = NotificationTarget.objects.get(notification_id=st_obj_dict.get('notification_id')).__dict__
            #st_obj_dict['target_type'] = nt_obj.get('target_type')
            #st_obj_dict['target_id'] = nt_obj.get('target_id')
            #st_obj_dict['target_class'] = nt_obj.get('target_class')
            #st_obj_dict['target_section'] = nt_obj.get('target_section')
            notice_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'noticeList':notice_list, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_notice_admin.html', returnDict)
    else:
        return render(request, 'kva_view_notice_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def view_single_notice_admin(request, notice_id1):
    i_notice_id = int(notice_id1)
    view_result = False
    notice_list = []
    returnDict = {}
    try:
        st_arr = NotificationDetail.objects.filter(notification_id=i_notice_id)
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if st_obj_dict.get('notification_creator') == 'Admin':
                st_obj_dict['creator_name'] = AdminLogin.objects.get(admin_id=int(st_obj_dict.get('creator_id'))).__dict__.get('user_name')
            elif st_obj_dict.get('notification_creator') == 'Teacher':
                st_obj_dict['creator_name'] = TeacherLogin.objects.get(teacher_id=int(st_obj_dict.get('creator_id'))).__dict__.get('fullname')
            else:
                print st_obj_dict.get('notification_creator') == 'Admin'
                st_obj_dict['creator_name'] = 'Invalid'
            nt_arr = NotificationTarget.objects.filter(notification_id=st_obj_dict.get('notification_id'))
            target_arr = []
            
            for nt_obj in nt_arr:
                nt_dict = nt_obj.__dict__
                print nt_dict.get('target_id')
                if nt_dict.get('target_type') == 'All':
                    nt_dict['target_name'] = 'All'
                elif nt_dict.get('target_type') == 'All Student':
                    nt_dict['target_name'] = 'All Student'
                elif nt_dict.get('target_type') == 'All Teacher':
                    nt_dict['target_name'] = 'All Teacher'
                elif nt_dict.get('target_type') == 'Student' and not (nt_dict.get('target_id') == None):
                    #fetch the student id
                    print 1
                    i_student_id = int(nt_dict.get('target_id'))
                    sl_arr = StudentLogin.objects.filter(student_id=i_student_id)
                    if len(sl_arr) == 1:
                        nt_dict['target_name'] = sl_arr[0].__dict__.get('fullname')
                    else:
                        nt_dict['target_name'] = 'Invalid'
                elif nt_dict.get('target_type') == 'Student' and not (nt_dict.get('target_class', 'None') == 'None') and not (nt_dict.get('target_section', 'None') == 'None'):
                    print 3
                    nt_dict['target_name'] = 'Students of Class ' + nt_dict.get('target_class') + ' and Section ' + nt_dict.get('target_section')
                else:
                    print 2
                    nt_dict['target_name'] = 'Invalid'
                target_arr.append(nt_dict)
            #st_obj_dict['target_type'] = nt_obj.get('target_type')
            #st_obj_dict['target_id'] = nt_obj.get('target_id')
            #st_obj_dict['target_class'] = nt_obj.get('target_class')
            #st_obj_dict['target_section'] = nt_obj.get('target_section')
            st_obj_dict['target'] = target_arr
            notice_list.append(st_obj_dict)
        if len(notice_list) == 1:
            noticeDict = notice_list[0]
            pass
        else:
            return render(request, 'kva_view_notice_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'noticeDict':noticeDict, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_single_notice_admin.html', returnDict)
    else:
        return render(request, 'kva_view_notice_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def view_calendar_admin(request):
    view_result = False
    before_event_list = []
    after_event_list = []
    returnDict = {}
    try:
        current_date_str = datetime.datetime.today().strftime('%Y-%m-%d')
        st_arr = CalenderEventDetail.objects.all().order_by('start_dt')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            print st_obj_dict.get('start_dt'), current_date_str
            if str(st_obj_dict.get('start_dt')) < current_date_str:
                before_event_list.append(st_obj_dict)
            else:
                after_event_list.append(st_obj_dict)
            #notice_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1, 'logintype':'Admin'}
        returnDict['beforeEventList'] = before_event_list
        returnDict['afterEventList'] = after_event_list
        return render(request, 'kva_view_event_admin.html', returnDict)
    else:
        return render(request, 'kva_view_event_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def view_hostel_admin(request):
    view_result = False
    hostel_list = []
    try:
        st_arr = HostelDetail.objects.all()
        for st_obj in st_arr:
            hostel_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'hostelList':hostel_list, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_hostel_admin.html', returnDict)
    else:
        return render(request, 'kva_view_hostel_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def view_house_admin(request):
    view_result = False
    house_list = []
    try:
        st_arr = HouseDetail.objects.all()
        for st_obj in st_arr:
            house_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'houseList':house_list, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_house_admin.html', returnDict)
    else:
        return render(request, 'kva_view_house_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_student_admin(request, student_id1):
    i_student_id = int(student_id1)
    add_result = False
    class_ = request.POST.get("class", "1")
    section_ = request.POST.get("section", "A")
    student_list = []
    try:
        StudentAcademicEnrollmentDetail.objects.filter(student_id=i_student_id).delete()
        StudentLogin.objects.filter(student_id=i_student_id).delete()
        StudentSubjectDetail.objects.filter(student_id=i_student_id).delete()
        StudentCsa.objects.filter(student_id=i_student_id).delete()
        StudentAhs.objects.filter(student_id=i_student_id).delete()
        StudentPersonalTrait.objects.filter(student_id=i_student_id).delete()
        StudentRemarks.objects.filter(student_id=i_student_id).delete()
        ExamGroupScoring.objects.filter(student_id=i_student_id).delete()
        ExamGroupReportsSingle.objects.filter(student_id=i_student_id).delete()
        StudentHouseDetail.objects.filter(student_id=i_student_id).delete()
        StudentPwdRequest.objects.filter(student_id=i_student_id).delete()
        StudentResidentialDetail.objects.filter(student_id=i_student_id).delete()
        StudentCorrespondenceAddress.objects.filter(student_id=i_student_id).delete()

        st_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_,section=section_)
        for st_obj in st_arr:
            if not ExamGroupScoring.objects.filter(student_id=st_obj.__dict__.get("student_id"), exam_group_id=i_exam_id).exists():
                continue
            st_id = st_obj.__dict__.get("student_id")
            st_full_obj = StudentLogin.objects.get(student_id=st_id).__dict__
            st_full_obj["class"]=st_obj.__dict__.get("class_field")
            st_full_obj["section"]=st_obj.__dict__.get("section")
            st_full_obj["roll_number"]=st_obj.__dict__.get("roll_number")
            st_full_obj["subj_grade_arr"] = []
            egs_arr = ExamGroupScoring.objects.filter(exam_group_id=i_exam_id, student_id=st_id)
            for egs_obj in egs_arr:
                egs_dict = egs_obj.__dict__
                sd_dict = SubjectDetails.objects.get(subject_id=egs_dict.get('subject_id')).__dict__
                egs_dict['subject_name'] = sd_dict.get('subject_name')
                egs_dict['subject_id'] = sd_dict.get('subject_id')
                st_full_obj["subj_grade_arr"].append(egs_dict)
            student_list.append(st_full_obj)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return render(request, 'kva_view_student_admin.html', {'msg':'Student Deletion Successful', 'studentList':student_list, 'status':1, 'class_value':class_, 'section':section_, 'logintype':'Admin'})
    else:
        return render(request, 'kva_view_student_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_teacher_admin(request, teacher_id1):
    i_teacher_id = int(teacher_id1)
    view_result = False
    teacher_list = []
    try:
        TeacherLogin.objects.filter(teacher_id=i_teacher_id).delete()
        ClassTeacherDetail.objects.filter(teacher_id=i_teacher_id).delete()
        TeacherSubjectDetail.objects.filter(teacher_id=i_teacher_id).delete()
        st_arr = TeacherLogin.objects.all()
        for st_obj in st_arr:
            teacher_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return render(request, 'kva_view_teacher_admin.html', {'msg':'Teacher deletion Successful', 'studentList':teacher_list, 'status':1, 'logintype':'Admin'})
    else:
        return render(request, 'kva_view_teacher_admin.html', {'msg':'Teacher deletion Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_hostel_admin(request, hostel_id1):
    i_hostel_id = int(hostel_id1)
    view_result = False
    hostel_list = []
    try:
        HostelDetail.objects.filter(hostel_id=i_hostel_id).delete()
        st_arr = HostelDetail.objects.all()
        for st_obj in st_arr:
            hostel_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'hostelList':hostel_list, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_hostel_admin.html', returnDict)
    else:
        return render(request, 'kva_view_hostel_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_house_admin(request, house_id1):
    i_house_id = int(house_id1)
    view_result = False
    house_list = []
    try:
        HouseDetail.objects.filter(house_id=i_house_id).delete()
        st_arr = HouseDetail.objects.all()
        for st_obj in st_arr:
            house_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'houseList':house_list, 'status':1, 'logintype':'Admin'}
        return render(request, 'kva_view_house_admin.html', returnDict)
    else:
        return render(request, 'kva_view_house_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_event_admin(request, event_id1):
    i_event_id = int(event_id1)
    view_result = False
    before_event_list = []
    after_event_list = []
    returnDict = {}
    try:
        CalenderEventDetail.objects.filter(holiday_id=i_event_id).delete()
        current_date_str = datetime.datetime.today().strftime('%Y-%m-%d')
        st_arr = CalenderEventDetail.objects.all().order_by('start_dt')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            print st_obj_dict.get('start_dt'), current_date_str
            if str(st_obj_dict.get('start_dt')) < current_date_str:
                before_event_list.append(st_obj_dict)
            else:
                after_event_list.append(st_obj_dict)
            #notice_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1, 'logintype':'Admin'}
        returnDict['beforeEventList'] = before_event_list
        returnDict['afterEventList'] = after_event_list
        return render(request, 'kva_view_event_admin.html', returnDict)
    else:
        return render(request, 'kva_view_event_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_subject_admin(request, subject_id1):
    i_subject_id = int(subject_id1)
    view_result = False
    subject_list = []
    try:
        SubjectDetails.objects.filter(subject_id=i_subject_id).delete()
        TeacherSubjectDetail.objects.filter(subject_id=i_subject_id).delete()
        StudentSubjectDetail.objects.filter(subject_id=i_subject_id).delete()
        ExamGroupScoring.objects.filter(subject_id=i_subject_id).delete()
        st_arr = SubjectDetails.objects.all()
        for st_obj in st_arr:
            subject_list.append(st_obj.__dict__)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return render(request, 'kva_view_subject_admin.html', {'msg':'Subject deletion Successful', 'subjectList':subject_list, 'status':1, 'logintype':'Admin'})
    else:
        return render(request, 'kva_view_subject_admin.html', {'msg':'Subject deletion Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_classteacher_admin(request, teacher_id1):
    #class_ = request.POST.get("class", "1")
    #section_ = request.POST.get("section", "A")
    i_teacher_id = int(teacher_id1)
    view_result = False

    try:
        #handle request
        ClassTeacherDetail.objects.filter(teacher_id=i_teacher_id).delete()
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return HttpResponseRedirect('/index/kva/view_teacher_admin/')
    else:
        return render(request, 'kva_assign_classteacher_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def delete_teacher_subject_admin(request, teacher_id1, subject_id1, class_field1, section1):
    #class_ = request.POST.get("class", "1")
    #section_ = request.POST.get("section", "A")
    i_teacher_id = int(teacher_id1)
    i_subject_id = int(subject_id1)
    view_result = False

    try:
        #handle request
        print i_teacher_id, i_subject_id, class_field1, section1
        TeacherSubjectDetail.objects.filter(teacher_id=i_teacher_id,subject_id=i_subject_id,class_field=class_field1,section=section1).delete()
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        return HttpResponseRedirect('/index/kva/assign_teacher_subject_admin/'+teacher_id1+'/')
    else:
        return render(request, 'kva_view_subject_admin.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Admin'})


def teacher_profile_info(request):
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username).__dict__

        if teacher_object == None:
            #return error page
            template = 'kva_teacher_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            cld = ClassTeacherDetail.objects.get(teacher_id=teacher_object.get("teacher_id",0)).__dict__
            cld_status = 1
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex

        try:
            tsa = []
            teacher_subj_arr = TeacherSubjectDetail.objects.filter(teacher_id=teacher_object.get("teacher_id", 0))
            for tso in teacher_subj_arr:
                tso_act = tso.__dict__
                subj_obj = SubjectDetails.objects.get(subject_id=tso_act.get('subject_id')).__dict__
                tso_act['subject_name'] = subj_obj.get('subject_name')
                tso_act['subject_code'] = subj_obj.get('subject_code')
                tso_act['is_major'] = subj_obj.get('is_major')
                tsa.append(tso_act)
            subjects_added = len(tsa)
        except Exception as ex:
            teacher_subj_arr = []
            subjects_added = 0
            print ex
            

        template = 'kva_teacher_profile_info.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object, 'cld_status':cld_status, 'cld':cld, 'subjects_added':subjects_added, 'subjects':tsa}
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_view_exam(request):
    returnDict = {}
    template = 'kva_teacher_view_exam.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    print _username
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username)
        #print teacher_object.__dict__
        if teacher_object == None:
            #return error page
            template = 'kva_teacher_view_exam.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            cld = ClassTeacherDetail.objects.get(teacher_id=teacher_object.get("teacher_id",0)).__dict__
            cld_status = 1
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex

        exam_objs = ExamGroupDetail.objects.all().order_by('-session');
        exam_arr = []
        for exam_obj in exam_objs:
            exam_arr.append(exam_obj.__dict__);
        template = 'kva_teacher_view_exam.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object.__dict__, 'exam_arr':exam_arr}
        return render(request, template, returnDict)
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_single_exam_view(request, exam_id1):
    i_exam_id = int(exam_id1)
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username).__dict__

        if teacher_object == None:
            #return error page
            template = 'kva_teacher_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            cld = ClassTeacherDetail.objects.get(teacher_id=teacher_object.get("teacher_id",0)).__dict__
            cld_status = 1
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex

        try:
            egd = ExamGroupDetail.objects.get(exam_group_id=i_exam_id).__dict__
            if (egd.get('term_final') == 'Y'):
                egd_status_final = 1
            else:
                egd_status_final = 0
        except Exception as ex:
            cld = {}
            egd_status_final = 0
            print ex

        try:
            tsa = []
            teacher_subj_arr = TeacherSubjectDetail.objects.filter(teacher_id=teacher_object.get("teacher_id", 0))
            for tso in teacher_subj_arr:
                tso_act = tso.__dict__
                subj_obj = SubjectDetails.objects.get(subject_id=tso_act.get('subject_id')).__dict__
                tso_act['subject_name'] = subj_obj.get('subject_name')
                tso_act['subject_code'] = subj_obj.get('subject_code')
                tso_act['is_major'] = subj_obj.get('is_major')
                tsa.append(tso_act)
            subjects_added = len(tsa)
        except Exception as ex:
            teacher_subj_arr = []
            subjects_added = 0
            print ex
            
        template = 'kva_teacher_single_exam_view.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object, 'cld_status':cld_status, 'cld':cld, 'subjects_added':subjects_added, 'subjects':tsa, 'exam_id':i_exam_id}
        returnDict['is_final']=egd_status_final
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_view_grade(request, exam_id1, subject_id1, class_field1, section1):
    i_exam_id = int(exam_id1)
    i_subject_id = int(subject_id1)
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username).__dict__

        if teacher_object == None:
            #return error page
            template = 'kva_teacher_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            cld = ClassTeacherDetail.objects.get(teacher_id=teacher_object.get("teacher_id",0)).__dict__
            cld_status = 1
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex

        try:
            tsa = []
            teacher_subj_arr = TeacherSubjectDetail.objects.filter(teacher_id=teacher_object.get("teacher_id", 0))
            for tso in teacher_subj_arr:
                tso_act = tso.__dict__
                subj_obj = SubjectDetails.objects.get(subject_id=tso_act.get('subject_id')).__dict__
                tso_act['subject_name'] = subj_obj.get('subject_name')
                tso_act['subject_code'] = subj_obj.get('subject_code')
                tso_act['is_major'] = subj_obj.get('is_major')
                tsa.append(tso_act)
            subjects_added = len(tsa)
        except Exception as ex:
            teacher_subj_arr = []
            subjects_added = 0
            print ex

        try:
            soa = []
            subject_name = SubjectDetails.objects.get(subject_id=i_subject_id)
            stud_obj_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_field1, section=section1)
            for s_obj in stud_obj_arr:
                try:
                    sg_obj = ExamGroupScoring.objects.get(exam_group_id=i_exam_id, subject_id=i_subject_id, student_id=s_obj.__dict__.get('student_id', 0))
                    sl_obj = StudentLogin.objects.get(student_id=s_obj.__dict__.get('student_id', 0))
                    sg_obj_act = sg_obj.__dict__
                    sg_obj_act['roll_number'] = s_obj.__dict__.get('roll_number')
                    sg_obj_act['fullname'] = sl_obj.__dict__.get('fullname')
                    soa.append(sg_obj_act)
                except Exception as ex1:
                    print ex1
            #subjects_added = len(tsa)
            exam_students = len(soa)
        except Exception as ex:
            teacher_subj_arr = []
            exam_students = 0
            print ex
            

        template = 'kva_teacher_view_grade.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object, 'cld_status':cld_status, 'cld':cld, 'subjects_added':subjects_added, 'subjects':tsa, 'exam_id':i_exam_id}
        returnDict['exam_students']=exam_students
        returnDict['exam_students_arr']=soa
        returnDict['class_value'] = class_field1
        returnDict['section'] = section1
        returnDict['subject_name'] = subject_name.__dict__.get("subject_name")
        returnDict['subject_id'] = i_subject_id
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_assign_grade(request, exam_id1, subject_id1, student_id1, class_field1, section1):
    i_exam_id = int(exam_id1)
    i_subject_id = int(subject_id1)
    i_student_id = int(student_id1)
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username).__dict__

        if teacher_object == None:
            #return error page
            template = 'kva_teacher_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            #egs = ExamGroupScoring.objects.get(exam_group_id=i_exam_id, subject_id=i_subject_id, student_id=i_student_id)
            max_marks = request.POST.get("max_score")
            cur_marks = request.POST.get("cur_score")
            i_max_marks = int(max_marks)
            i_cur_marks = int(cur_marks)
            percentage_ = (i_cur_marks*100)/i_max_marks
            grade_dict = {0:'E', 1:'D', 2:'C', 3:'B', 4:'B+', 5:'A', 6:'A+', 7:'A+'}
            grade_ = grade_dict[int(math.floor(percentage_/14))]
            #egs.max_score = i_max_marks
            #egs.cur_score = i_cur_marks
            #egs.percentage = percentage_
            #egs.grade = grade_
            #egs.save()
            ExamGroupScoring.objects.filter(exam_group_id=i_exam_id, subject_id=i_subject_id, student_id=i_student_id).update(max_score = i_max_marks, cur_score = i_cur_marks,percentage = percentage_,grade = grade_)
            cld_status = 1
            msg = 'Marks update successful'
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex
            msg = 'Error while updating marks'
            

        template = 'kva_teacher_assign_grade.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object}
        returnDict['msg']=msg
        returnDict['class_val']=class_field1
        returnDict['section']=section1
        returnDict['exam_id']=i_exam_id
        returnDict['subject_id']=i_subject_id
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_subject_student_view(request, subject_id1, class_field1, section1):
    #i_exam_id = int(exam_id1)
    i_subject_id = int(subject_id1)
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username).__dict__

        if teacher_object == None:
            #return error page
            template = 'kva_teacher_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            cld = ClassTeacherDetail.objects.get(teacher_id=teacher_object.get("teacher_id",0)).__dict__
            cld_status = 1
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex

        try:
            tsa = []
            teacher_subj_arr = TeacherSubjectDetail.objects.filter(teacher_id=teacher_object.get("teacher_id", 0))
            for tso in teacher_subj_arr:
                tso_act = tso.__dict__
                subj_obj = SubjectDetails.objects.get(subject_id=tso_act.get('subject_id')).__dict__
                tso_act['subject_name'] = subj_obj.get('subject_name')
                tso_act['subject_code'] = subj_obj.get('subject_code')
                tso_act['is_major'] = subj_obj.get('is_major')
                tsa.append(tso_act)
            subjects_added = len(tsa)
        except Exception as ex:
            teacher_subj_arr = []
            subjects_added = 0
            print ex

        try:
            soa = []
            subject_name = SubjectDetails.objects.get(subject_id=i_subject_id).__dict__.get('subject_name')
            stud_obj_arr = StudentAcademicEnrollmentDetail.objects.filter( class_field=class_field1, section=section1)
            for s_obj in stud_obj_arr:
                try:
                    #sg_obj = ExamGroupScoring.objects.get(exam_group_id=i_exam_id, subject_id=i_subject_id, student_id=s_obj.__dict__.get('student_id', 0))
                    sl_obj = StudentLogin.objects.get(student_id=s_obj.__dict__.get('student_id', 0))
                    ss = StudentSubjectDetail.objects.get(student_id=s_obj.__dict__.get('student_id', 0),subject_id=i_subject_id)
                    sg_obj_act = sl_obj.__dict__
                    sg_obj_act['roll_number'] = s_obj.__dict__.get('roll_number')
                    sg_obj_act['class_field'] = s_obj.__dict__.get('class_field')
                    sg_obj_act['section'] = s_obj.__dict__.get('section')
                    #sg_obj_act['fullname'] = sl_obj.__dict__.get('fullname')
                    soa.append(sg_obj_act)
                except Exception as ex1:
                    print ex1
            #subjects_added = len(tsa)
            subject_students = len(soa)
        except Exception as ex:
            teacher_subj_arr = []
            subject_students = 0
            print ex
            

        template = 'kva_teacher_subject_students.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object, 'cld_status':cld_status, 'cld':cld, 'subjects_added':subjects_added, 'subjects':tsa}
        returnDict['subject_students']=subject_students
        returnDict['subject_students_arr']=soa
        returnDict['class_value'] = class_field1
        returnDict['section'] = section1
        returnDict['subject_name'] = subject_name
        returnDict['subject_id'] = i_subject_id
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_view_value(request, exam_id1, class_field1, section1):
    i_exam_id = int(exam_id1)
    #i_subject_id = int(subject_id1)
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username).__dict__

        if teacher_object == None:
            #return error page
            template = 'kva_teacher_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            cld = ClassTeacherDetail.objects.get(teacher_id=teacher_object.get("teacher_id",0)).__dict__
            cld_status = 1
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex

        try:
            soa = []
            s_csa = []
            s_ps = []
            s_ahs = []
            s_remarks = []
            #subject_name = SubjectDetails.objects.get(subject_id=i_subject_id)
            stud_obj_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_field1, section=section1)
            for s_obj in stud_obj_arr:
                try:
                    #sg_obj = ExamGroupScoring.objects.get(exam_group_id=i_exam_id, subject_id=i_subject_id, student_id=s_obj.__dict__.get('student_id', 0))
                    sl_obj = StudentLogin.objects.get(student_id=s_obj.__dict__.get('student_id', 0))
                    sg_obj_act = sl_obj.__dict__
                    sg_obj_act['roll_number'] = s_obj.__dict__.get('roll_number')
                    #sg_obj_act['fullname'] = sl_obj.__dict__.get('fullname')
                    soa.append(sg_obj_act)
                except Exception as ex1:
                    print ex1
            #subjects_added = len(tsa)
            exam_students = len(soa)
            for soa_obj in soa:
                try:
                    csa_obj = StudentCsa.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    csa_obj['fullname'] = soa_obj.get('fullname')
                    csa_obj['roll_number'] = soa_obj.get('roll_number')
                    s_csa.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_csa.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id,'literary_interest':'None','communication_skill':'None','music':'None','art_craft':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

            for soa_obj in soa:
                try:
                    csa_obj = StudentPersonalTrait.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    s_ps.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_ps.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id,'discipline':'None','punctuality':'None','hygiene':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

            for soa_obj in soa:
                try:
                    csa_obj = StudentAhs.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    s_ahs.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_ahs.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id,'total_working_days':'None','attendance':'None','height':'None','weight':'None','bmi':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

            for soa_obj in soa:
                try:
                    csa_obj = StudentRemarks.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    s_remarks.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_remarks.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id, 'remarks':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

        except Exception as ex:
            teacher_subj_arr = []
            exam_students = 0
            print ex
            

        template = 'kva_teacher_view_value.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object, 'cld_status':cld_status, 'cld':cld, 'exam_id':i_exam_id}
        returnDict['exam_students']=exam_students
        returnDict['exam_students_arr']=soa
        returnDict['class_value'] = class_field1
        returnDict['section'] = section1
        returnDict['csa'] = s_csa
        returnDict['ahs'] = s_ahs
        returnDict['pt'] = s_ps
        returnDict['remarks'] = s_remarks
        returnDict['req_status'] = 0
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_assign_value(request, exam_id1, student_id1, table1, row1, class_field1, section1):
    i_exam_id = int(exam_id1)
    i_student_id = int(student_id1)
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        teacher_object = TeacherLogin.objects.get(emailid=_username).__dict__

        if teacher_object == None:
            #return error page
            template = 'kva_teacher_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)

        try:
            cld = ClassTeacherDetail.objects.get(teacher_id=teacher_object.get("teacher_id",0)).__dict__
            cld_status = 1
        except Exception as ex:
            cld = {}
            cld_status = 0
            print ex

        if table1 == 'csa':
            req_success=0
            try:
                grade_ = request.POST.get(row1)
                if StudentCsa.objects.filter(exam_group_id=i_exam_id, student_id=i_student_id).exists():
                    #PASS
                    if row1 == 'literary_interest':
                        StudentCsa.objects.filter(exam_group_id=i_exam_id, student_id=i_student_id).update(literary_interest=grade_)
                        #s_csa_entry.save()
                        req_success=1
                    if row1 == 'communication_skill':
                        StudentCsa.objects.filter(exam_group_id=i_exam_id, student_id=i_student_id).update(communication_skill=grade_)
                        #s_csa_entry.save()
                        req_success=1
                    if row1 == 'music':
                        StudentCsa.objects.filter(exam_group_id=i_exam_id, student_id=i_student_id).update(music=grade_)
                        #s_csa_entry.save()
                        req_success=1
                    if row1 == 'art_craft':
                        StudentCsa.objects.filter(exam_group_id=i_exam_id, student_id=i_student_id).update(art_craft=grade_)
                        #s_csa_entry.save()
                        req_success=1
                    pass
                else:
                    #pass
                    if row1 == 'literary_interest':
                        s_csa_entry = StudentCsa(exam_group_id=i_exam_id, student_id=i_student_id, literary_interest=grade_)
                        s_csa_entry.save()
                        req_success=1
                    if row1 == 'communication_skill':
                        s_csa_entry = StudentCsa(exam_group_id=i_exam_id, student_id=i_student_id, communication_skill=grade_)
                        s_csa_entry.save()
                        req_success=1
                    if row1 == 'music':
                        s_csa_entry = StudentCsa(exam_group_id=i_exam_id, student_id=i_student_id, music=grade_)
                        s_csa_entry.save()
                        req_success=1
                    if row1 == 'art_craft':
                        s_csa_entry = StudentCsa(exam_group_id=i_exam_id, student_id=i_student_id, art_craft=grade_)
                        s_csa_entry.save()
                        req_success=1
            except Exception as ex:
                print ex

        try:
            soa = []
            s_csa = []
            s_ps = []
            s_ahs = []
            s_remarks = []
            #subject_name = SubjectDetails.objects.get(subject_id=i_subject_id)
            stud_obj_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_field1, section=section1)
            for s_obj in stud_obj_arr:
                try:
                    #sg_obj = ExamGroupScoring.objects.get(exam_group_id=i_exam_id, subject_id=i_subject_id, student_id=s_obj.__dict__.get('student_id', 0))
                    sl_obj = StudentLogin.objects.get(student_id=s_obj.__dict__.get('student_id', 0))
                    sg_obj_act = sl_obj.__dict__
                    sg_obj_act['roll_number'] = s_obj.__dict__.get('roll_number')
                    #sg_obj_act['fullname'] = sl_obj.__dict__.get('fullname')
                    soa.append(sg_obj_act)
                except Exception as ex1:
                    print ex1
            #subjects_added = len(tsa)
            exam_students = len(soa)
            for soa_obj in soa:
                try:
                    csa_obj = StudentCsa.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    csa_obj['fullname'] = soa_obj.get('fullname')
                    csa_obj['roll_number'] = soa_obj.get('roll_number')
                    s_csa.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_csa.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id,'literary_interest':'None','communication_skill':'None','music':'None','art_craft':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

            for soa_obj in soa:
                try:
                    csa_obj = StudentPersonalTrait.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    s_ps.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_ps.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id,'discipline':'None','punctuality':'None','hygiene':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

            for soa_obj in soa:
                try:
                    csa_obj = StudentAhs.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    s_ahs.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_ahs.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id,'total_working_days':'None','attendance':'None','height':'None','weight':'None','bmi':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

            for soa_obj in soa:
                try:
                    csa_obj = StudentRemarks.objects.get(exam_group_id=i_exam_id, student_id=soa_obj.get('student_id', 0)).__dict__
                    s_remarks.append(csa_obj)
                except Exception as ex:
                    print ex
                    s_remarks.append({'student_id':soa_obj.get('student_id', 0),'exam_group_id':i_exam_id, 'remarks':'None', 'fullname':soa_obj.get('fullname'), 'roll_number':soa_obj.get('roll_number')})

        except Exception as ex:
            teacher_subj_arr = []
            exam_students = 0
            print ex
            

        template = 'kva_teacher_view_value.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'teacher_login':teacher_object, 'cld_status':cld_status, 'cld':cld, 'exam_id':i_exam_id}
        returnDict['exam_students']=exam_students
        returnDict['exam_students_arr']=soa
        returnDict['class_value'] = class_field1
        returnDict['section'] = section1
        returnDict['csa'] = s_csa
        returnDict['ahs'] = s_ahs
        returnDict['pt'] = s_ps
        returnDict['remarks'] = s_remarks
        returnDict['req_status'] = req_success
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def teacher_send_notice(request, class_field1, section1, student_id1):
    add_result = False
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    subject_ = request.POST.get('subject')
    message_ = request.POST.get('message')
    
    i_student_id = int(student_id1)
    
    try:
        #verify
        if StudentAcademicEnrollmentDetail.objects.filter(student_id=i_student_id,class_field=class_field1,section=section1).exists():
            if TeacherSubjectDetail.objects.filter(teacher_id=request.session.get("id"), class_field=class_field1,section=section1).exists():
                pass
            else:
                print "teacher not assigned to student"
                return render(request, 'kva_add_.html', {'msg':'Notice Addition Failed. Details might be already present.', 'logintype':'Teacher'})
            pass
        else:
            print "class and subject not assigned to student"
            return render(request, 'kva_add_.html', {'msg':'Notice Addition Failed. Details might be already present.', 'logintype':'Teacher'})
        #try to send sms
        if message_ and subject_:
            phoneStr = ""
            sl_dict = StudentLogin.objects.get(student_id=i_student_id).__dict__
            phoneStr += sl_dict.get('phone') + ','
            myJSONObject = {"From":"SANKLP", "VAR1":message_, "To":phoneStr , "TemplateName":TemplateName};
            headers = {'content-type' : 'application/json'}
            REQUEST_URL = "http://2factor.in/API/V1/"+api_in_use+"/ADDON_SERVICES/SEND/TSMS"
            rr = requests.post(REQUEST_URL, data = json.dumps(myJSONObject), headers=headers)
            req_status = rr.status_code
            response_status = rr.__dict__.get('_content')
            print req_status, response_status
            if str(req_status) == '200' and json.loads(response_status).get('Status') == "Success":
                #create entry into NotificationDetails
                nd_entry = NotificationDetail(notification_creator='Teacher',creator_id=request.session.get("id"),subject=subject_,message=message_,created_at=datetime.datetime.now())
                nd_entry.save()
                #create entry into NotificationTarget
                nt_entry = NotificationTarget(notification_id=nd_entry.notification_id, target_type='Student', target_id=i_student_id)
                nt_entry.save()
                add_result = True
            print add_result
        else:
            sl_dict = StudentLogin.objects.get(student_id=i_student_id).__dict__
            sa_dict = StudentAcademicEnrollmentDetail.objects.get(student_id=i_student_id).__dict__
            sl_dict['roll_number'] = sa_dict.get('roll_number')
            sl_dict['class_val'] = sa_dict.get('class_field')
            sl_dict['section'] = sa_dict.get('section')
            returnDict = {'msg':'No message sent', 'logintype':'Teacher', 'studentDict':sl_dict}
            return render(request, 'kva_teacher_send_notice.html', returnDict)
            pass
    except Exception as ex:
        print 'b'
        print ex
    
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition Successful', 'logintype':'Teacher'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition.. Failed. Details might be already present.', 'logintype':'Teacher'})


def teacher_send_class_notice(request, subject_id1, class_field1, section1):
    add_result = False
    if not request.session.get("type") == 'Teacher':
        return HttpResponseRedirect('/index/kva/home/')
    subject_ = request.POST.get('subject')
    message_ = request.POST.get('message')
    
    i_subject_id = int(subject_id1)
    
    try:
        #verify
        if message_ and subject_:
            sa_arr = StudentAcademicEnrollmentDetail.objects.filter(class_field=class_field1,section=section1)
            phoneStr = ""
            for sa_obj in sa_arr:
                sa_dict = sa_obj.__dict__
                if StudentSubjectDetail.objects.filter(student_id=sa_dict.get('student_id'), subject_id=i_subject_id).exists():
                    sl_dict = StudentLogin.objects.get(student_id=sa_dict.get('student_id')).__dict__
                    phoneStr += sl_dict.get('phone') + ','
            if not phoneStr == "":
                myJSONObject = {"From":"SANKLP", "VAR1":message_, "To":phoneStr , "TemplateName":TemplateName};
                headers = {'content-type' : 'application/json'}
                REQUEST_URL = "http://2factor.in/API/V1/"+api_in_use+"/ADDON_SERVICES/SEND/TSMS"
                rr = requests.post(REQUEST_URL, data = json.dumps(myJSONObject), headers=headers)
                req_status = rr.status_code
                response_status = rr.__dict__.get('_content')
                print req_status, response_status
                if str(req_status) == '200' and json.loads(response_status).get('Status') == "Success":
                    #create entry into NotificationDetails
                    nd_entry = NotificationDetail(notification_creator='Teacher',creator_id=request.session.get("id"),subject=subject_,message=message_,created_at=datetime.datetime.now())
                    nd_entry.save()
                    #create entry into NotificationTarget
                    nt_entry = NotificationTarget(notification_id=nd_entry.notification_id, target_type='Student', target_class=class_field1, target_section=section1)
                    nt_entry.save()
                    add_result = True
                print add_result
        else:
            return render(request, 'kva_add_.html', {'msg':'Notice Addition.. Failed. Details might be already present.', 'logintype':'Teacher'})
            pass
    except Exception as ex:
        print 'b'
        print ex
    
    if add_result:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition Successful', 'logintype':'Teacher'})
    else:
        return render(request, 'kva_add_.html', {'msg':'Notice Addition.. Failed. Details might be already present.', 'logintype':'Teacher'})


def teacher_view_calendar(request):
    view_result = False
    before_event_list = []
    after_event_list = []
    returnDict = {}
    try:
        current_date_str = datetime.datetime.today().strftime('%Y-%m-%d')
        st_arr = CalenderEventDetail.objects.all().order_by('start_dt')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            print st_obj_dict.get('start_dt'), current_date_str
            if str(st_obj_dict.get('start_dt')) < current_date_str:
                before_event_list.append(st_obj_dict)
            else:
                after_event_list.append(st_obj_dict)
            #notice_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1, 'logintype':'Teacher'}
        returnDict['beforeEventList'] = before_event_list
        returnDict['afterEventList'] = after_event_list
        return render(request, 'kva_view_event_teacher.html', returnDict)
    else:
        return render(request, 'kva_view_event_teacher.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Teacher'})


def teacher_view_sent_notice(request):
    view_result = False
    notice_list = []
    returnDict = {}
    try:
        st_arr = NotificationDetail.objects.filter(notification_creator='Teacher', creator_id=request.session.get("id")).order_by('-created_at')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationTarget.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationTarget.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                st_obj_dict['target_type'] = nt_obj.get('target_type')
                st_obj_dict['target_id'] = nt_obj.get('target_id')
                st_obj_dict['target_class'] = nt_obj.get('target_class')
                st_obj_dict['target_section'] = nt_obj.get('target_section')
                st_obj_dict['creator_name'] = request.session.get("username")
                notice_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'noticeList':notice_list, 'status':1, 'logintype':'Teacher'}
        return render(request, 'kva_view_notice_teacher.html', returnDict)
    else:
        return render(request, 'kva_view_notice_teacher.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Teacher'})


def teacher_view_received_notice(request):
    view_result = False
    notice_list = []
    returnDict = {}
    try:
        st_arr = NotificationTarget.objects.filter(target_type='All')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                nt_obj['target_type'] = st_obj_dict.get('target_type')
                nt_obj['target_id'] = st_obj_dict.get('target_id')
                nt_obj['target_class'] = st_obj_dict.get('target_class')
                nt_obj['target_section'] = st_obj_dict.get('target_section')
                notice_list.append(nt_obj)
        st_arr = NotificationTarget.objects.filter(target_type='All Teacher')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                nt_obj['target_type'] = st_obj_dict.get('target_type')
                nt_obj['target_id'] = st_obj_dict.get('target_id')
                nt_obj['target_class'] = st_obj_dict.get('target_class')
                nt_obj['target_section'] = st_obj_dict.get('target_section')
                notice_list.append(nt_obj)
        st_arr = NotificationTarget.objects.filter(target_type='Teacher', target_id=request.session.get("id"))
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                nt_obj['target_type'] = st_obj_dict.get('target_type')
                nt_obj['target_id'] = st_obj_dict.get('target_id')
                nt_obj['target_class'] = st_obj_dict.get('target_class')
                nt_obj['target_section'] = st_obj_dict.get('target_section')
                notice_list.append(nt_obj)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'noticeList':notice_list, 'status':1, 'logintype':'Teacher'}
        return render(request, 'kva_view_received_notice_teacher.html', returnDict)
    else:
        return render(request, 'kva_view_received_notice_teacher.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Teacher'})


def student_profile_info(request):
    returnDict = {}
    template = 'teacher_profile_info.html'
    is_logged_in = 0
    if not request.session.get("type") == 'Student':
        return HttpResponseRedirect('/index/kva/home/')
    _username = request.session.get("username")
    if not _username == None:
        #return HttpResponseRedirect('/combined_app/')
        is_logged_in = 1

        student_object = StudentLogin.objects.get(enrollment_number=_username).__dict__
        sa_dict = StudentAcademicEnrollmentDetail.objects.get(student_id=request.session.get('id')).__dict__
        if StudentHouseDetail.objects.filter(student_id=request.session.get('id')).exists():    
            shd_dict = StudentHouseDetail.objects.get(student_id=request.session.get('id')).__dict__
        else:
            shd_dict = {}

        if StudentResidentialDetail.objects.filter(student_id=request.session.get('id')).exists(): 
            srd_dict = StudentResidentialDetail.objects.get(student_id=request.session.get('id')).__dict__
            if srd_dict.get('hostel_resident') == 'Yes':
                hd_dict = HostelDetail.objects.get(hostel_id=srd_dict.get('hostel_id')).__dict__
                srd_dict['hostel_name'] = hd_dict.get('hostel_name')
        else:
            srd_dict = {}
        student_object['sa_dict'] = sa_dict
        student_object['shd_dict'] = shd_dict
        student_object['srd_dict'] = srd_dict

        if student_object == None:
            #return error page
            template = 'kva_student_profile_info.html'
            returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'Some network or Internal Error. Try after some time.'}
            return render(request, template, returnDict)            

        template = 'kva_student_profile_info.html'
        returnDict = {'is_logged_in':is_logged_in, 'username':request.session.get("username"),'logintype':request.session.get('type'), 'error':'None', 'student_login':student_object}
        return render(request, template, returnDict) 
    else:
        return HttpResponseRedirect('/index/kva/home')


def student_view_received_notice(request):
    view_result = False
    notice_list = []
    returnDict = {}
    try:
        st_arr = NotificationTarget.objects.filter(target_type='All')
        sa_dict = StudentAcademicEnrollmentDetail.objects.get(student_id=request.session.get('id')).__dict__
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                nt_obj['target_type'] = st_obj_dict.get('target_type')
                nt_obj['target_id'] = st_obj_dict.get('target_id')
                nt_obj['target_class'] = st_obj_dict.get('target_class')
                nt_obj['target_section'] = st_obj_dict.get('target_section')
                nt_obj['creator_name'] = 'Admin'
                notice_list.append(nt_obj)
        st_arr = NotificationTarget.objects.filter(target_type='All Student')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                nt_obj['target_type'] = st_obj_dict.get('target_type')
                nt_obj['target_id'] = st_obj_dict.get('target_id')
                nt_obj['target_class'] = st_obj_dict.get('target_class')
                nt_obj['target_section'] = st_obj_dict.get('target_section')
                nt_obj['creator_name'] = 'Admin'
                notice_list.append(nt_obj)
        st_arr = NotificationTarget.objects.filter(target_type='Student', target_id=request.session.get("id"))
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                if nt_obj.get('notification_creator') == 'Teacher':
                    if TeacherLogin.objects.filter(teacher_id=int(nt_obj.get('creator_id'))).exists():
                        tl_dict = TeacherLogin.objects.get(teacher_id=int(nt_obj.get('creator_id'))).__dict__
                        nt_obj['creator_name'] = tl_dict.get('fullname')
                    else:
                        nt_obj['creator_name'] = 'Invalid'    
                    #nt_obj['creator_name'] = 'Admin'
                else:
                    nt_obj['creator_name'] = 'Admin'
                nt_obj['target_type'] = st_obj_dict.get('target_type')
                nt_obj['target_id'] = st_obj_dict.get('target_id')
                nt_obj['target_class'] = st_obj_dict.get('target_class')
                nt_obj['target_section'] = st_obj_dict.get('target_section')
                notice_list.append(nt_obj)
        st_arr = NotificationTarget.objects.filter(target_type='Student', target_class=sa_dict.get('class_field'), target_section=sa_dict.get('section'))
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            if NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id')).exists():
                nt_obj = NotificationDetail.objects.filter(notification_id=st_obj_dict.get('notification_id'))[0].__dict__
                nt_obj['target_type'] = st_obj_dict.get('target_type')
                nt_obj['target_id'] = st_obj_dict.get('target_id')
                nt_obj['target_class'] = st_obj_dict.get('target_class')
                nt_obj['target_section'] = st_obj_dict.get('target_section')
                notice_list.append(nt_obj)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'noticeList':notice_list, 'status':1, 'logintype':'Student'}
        return render(request, 'kva_view_received_notice_student.html', returnDict)
    else:
        return render(request, 'kva_view_received_notice_student.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Student'})


def student_view_calendar(request):
    view_result = False
    before_event_list = []
    after_event_list = []
    returnDict = {}
    try:
        current_date_str = datetime.datetime.today().strftime('%Y-%m-%d')
        st_arr = CalenderEventDetail.objects.all().order_by('start_dt')
        for st_obj in st_arr:
            st_obj_dict = st_obj.__dict__
            print st_obj_dict.get('start_dt'), current_date_str
            if str(st_obj_dict.get('start_dt')) < current_date_str:
                before_event_list.append(st_obj_dict)
            else:
                after_event_list.append(st_obj_dict)
            #notice_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1, 'logintype':'Student'}
        returnDict['beforeEventList'] = before_event_list
        returnDict['afterEventList'] = after_event_list
        return render(request, 'kva_view_event_student.html', returnDict)
    else:
        return render(request, 'kva_view_event_student.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Student'})


def student_view_subjects(request):
    view_result = False
    subject_list = []
    returnDict = {}
    try:
        #current_date_str = datetime.datetime.today().strftime('%Y-%m-%d')
        st_arr = StudentSubjectDetail.objects.filter(student_id=request.session.get('id'))
        for st_obj in st_arr:
            sa_dict = StudentAcademicEnrollmentDetail.objects.get(student_id=request.session.get('id')).__dict__
            st_obj_dict = st_obj.__dict__
            sd_dict = SubjectDetails.objects.get(subject_id=st_obj_dict.get('subject_id'))
            if TeacherSubjectDetail.objects.filter(subject_id=st_obj_dict.get('subject_id'),class_field=sa_dict.get('class_field'),section=sa_dict.get('section')).exists():
                tsd_dict = TeacherSubjectDetail.objects.get(subject_id=st_obj_dict.get('subject_id'),class_field=sa_dict.get('class_field'),section=sa_dict.get('section')).__dict__
                tl_dict = TeacherLogin.objects.get(teacher_id=tsd_dict.get('teacher_id'))
                st_obj_dict['tl'] = tl_dict
            else:
                st_obj_dict['tl'] = {}
            st_obj_dict['sa'] = sa_dict
            st_obj_dict['sd'] = sd_dict
            subject_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1, 'logintype':'Student'}
        returnDict['subjectList'] = subject_list
        return render(request, 'kva_student_view_subjects.html', returnDict)
    else:
        return render(request, 'kva_student_view_subjects.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Student'})


def student_view_exam(request):
    view_result = False
    before_event_list = []
    after_event_list = []
    returnDict = {}
    try:
        exam_objs = ExamGroupDetail.objects.all()
        exam_arr = []
        for exam_obj in exam_objs:
            exam_arr.append(exam_obj.__dict__)
            #notice_list.append(st_obj_dict)
        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1, 'logintype':'Student'}
        returnDict['examList'] = exam_arr
        return render(request, 'kva_student_view_exam.html', returnDict)
    else:
        return render(request, 'kva_student_view_exam.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Student'})


def student_single_exam_view(request, exam_id1):
    i_exam_id = int(exam_id1)
    view_result = False
    minor_subject_list = []
    major_subject_list = []
    returnDict = {}
    csa_dict = {}
    pt_dict = {}
    ahs_dict = {}
    remarks_dict = {}
    try:
        ed_dict = ExamGroupDetail.objects.get(exam_group_id=i_exam_id).__dict__
        egs_arr = ExamGroupScoring.objects.filter(exam_group_id=i_exam_id,student_id=request.session.get('id'))
        sl_dict = StudentLogin.objects.filter(student_id=request.session.get('id')).__dict__
        sa_dict = StudentAcademicEnrollmentDetail.objects.filter(student_id=request.session.get('id')).__dict__
        if ed_dict.get('term_final') == 'Y':
            #add csa, ahs, pt and remarks
            if StudentCsa.objects.filter(exam_group_id=i_exam_id, student_id=request.session.get('id')).exists:
                csa_dict = StudentCsa.objects.get(exam_group_id=i_exam_id, student_id=request.session.get('id'))
                csa_dict['status'] = 1
                pass
            else:
                csa_dict['status'] = 0
                pass
            if StudentPersonalTrait.objects.filter(exam_group_id=i_exam_id, student_id=request.session.get('id')).exists:
                pt_dict = StudentPersonalTrait.objects.get(exam_group_id=i_exam_id, student_id=request.session.get('id'))
                pt_dict['status'] = 1
                pass
            else:
                pt_dict['status'] = 0
                pass
            if StudentAhs.objects.filter(exam_group_id=i_exam_id, student_id=request.session.get('id')).exists:
                ahs_dict = StudentAhs.objects.get(exam_group_id=i_exam_id, student_id=request.session.get('id'))
                ahs_dict['status'] = 1
                pass
            else:
                csa_dict['status'] = 0
                pass
            if StudentRemarks.objects.filter(exam_group_id=i_exam_id, student_id=request.session.get('id')).exists:
                remarks_dict = StudentRemarks.objects.get(exam_group_id=i_exam_id, student_id=request.session.get('id'))
                remarks_dict['status'] = 1
                pass
            else:
                remarks_dict['status'] = 0
                pass
            pass
        else:
            csa_dict['status'] = 0
            pt_dict['status'] = 0
            ahs_dict['status'] = 0
            remarks_dict['status'] = 0
            #don't add
            pass
        sl_dict['sa'] = sa_dict
        if len(egs_arr) == 0:
            return render(request, 'kva_student_view_single_exam.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Student'})
        for egs_obj in egs_arr:
            egs_dict = egs_obj.__dict__
            sd_dict = SubjectDetails.objects.get(subject_id=egs_dict.get('subject_id')).__dict__
            egs_dict['subject_name'] = sd_dict.get('subject_name')
            egs_dict['is_major'] = sd_dict.get('is_major')
            if egs_dict['is_major'] == 'Major':
                major_subject_list.append(egs_dict)
            else:
                minor_subject_list.append(egs_dict)

        add_result = True
    except Exception as ex:
        add_result = False
        print ex
    if add_result:
        returnDict = {'msg':'Teacher Addition Successful', 'status':1, 'logintype':'Student'}
        returnDict['examDict'] = ed_dict
        returnDict['studentDict'] = sl_dict
        returnDict['minorSubjectList'] = minor_subject_list
        returnDict['majorSubjectList'] = major_subject_list
        returnDict['csa'] = csa_dict
        returnDict['pt'] = pt_dict
        returnDict['ahs'] = ahs_dict
        returnDict['remarks'] = remarks_dict
        return render(request, 'kva_student_view_single_exam.html', returnDict)
    else:
        return render(request, 'kva_student_view_single_exam.html', {'msg':'Teacher Addition Failed. Details might be already present.', 'status':0, 'logintype':'Student'})


