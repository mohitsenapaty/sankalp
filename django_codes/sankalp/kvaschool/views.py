# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from .models import *
import hashlib
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


