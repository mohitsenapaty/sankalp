import psycopg2
import hashlib
import xlrd, os, re, sys
#conn = psycopg2.connect("dbname=suppliers user=postgres password=postgres")
from collections import OrderedDict


conn = psycopg2.connect(host="127.0.0.1",database="sankalp", user="postgres", password="postgres")

cur = conn.cursor()
target_table = 'teacher_login'
#target_table = 'student_login'
target_table1= 'student_academic_enrollment_detail'
#target_method = 'Teacher'
target_method = 'Student'

def read_from_teacher_excel(input_file):
    excel_dict_list = []
    excel_dict = OrderedDict()
    book = xlrd.open_workbook(input_file)
    #print book.nsheets
    #print book.sheet_names()
    first_sheet = book.sheet_by_index(0)
    col_list = first_sheet.row_values(0)
    num_cols = len(col_list)
    num_rows = first_sheet.nrows
    #print first_sheet.row_values(0)
    for i in range(0, num_rows):
        excel_dict = OrderedDict()
        if i == 0:
            continue
        else:
            for j in range(0, num_cols):
                key = col_list[j]
                val = first_sheet.cell(i, j).value
                excel_dict[key] = val
            pass
        excel_dict_list.append(excel_dict)

    return excel_dict_list

def read_from_student_excel(input_file):
    excel_dict_list = []
    excel_dict = OrderedDict()
    book = xlrd.open_workbook(input_file)
    #print book.nsheets
    #print book.sheet_names()
    first_sheet = book.sheet_by_index(0)
    col_list = first_sheet.row_values(0)
    num_cols = len(col_list)
    num_rows = first_sheet.nrows
    #print first_sheet.row_values(0)
    for i in range(0, num_rows):
        excel_dict = OrderedDict()
        if i == 0:
            continue
        else:
            for j in range(0, num_cols):
                key = col_list[j]
                val = first_sheet.cell(i, j).value
                excel_dict[key] = val
            pass
        excel_dict_list.append(excel_dict)

    return excel_dict_list

def insert_db():
    #insert to teacher db
    #read file first
    if target_method == 'Teacher':
        #read into teacher_login
        print "Teacher section"
        teacher_dict_list = read_from_teacher_excel("teacher_excel.xls")
        if len(teacher_dict_list) > 0:
            print "There are entries in teacher dict list"
            print teacher_dict_list[0]
            
            #for i in range(0, len(teacher_dict_list)):
            for i in range(0,1):
                fullname = "aa bb"
                emailid = "baab@ba.ba"
                phone = "23232"
                unencrypted = "22222"
                password = hashlib.sha224(unencrypted).hexdigest()
                sql = "insert into teacher_login(fullname, emailid, phone, password, unencrypted) values(%s, %s, %s, %s, %s) RETURNING teacher_id"
                print sql 
                try:
                    cur.execute(sql, (fullname, emailid, phone, password, unencrypted))
                    teacher_id = cur.fetchone()[0]
                    print teacher_id
                except:
                    print "Failed sql"
 
    elif target_method == 'Student':
        #read into student_login
        print "Student section"
        student_dict_list = read_from_student_excel("student_excel.xls")

        if len(student_dict_list) > 0:
            print "There are entries in student dict list"
            print student_dict_list[0]

            #for i in range(0, len(student_dict_list)):
            for i in range(0,1):
                fullname = "aa bb"
                emailid = "baab@ba.ba"
                phone = "23232"
                unencrypted = "22222"
                password = hashlib.sha224(unencrypted).hexdigest()
                enrollment_number = "25"
                father_name = "sdas asda"
                mother_name = "sddq cscsd"
                sql = "insert into student_login(fullname, emailid, phone, password, unencrypted, enrollment_number, father_name, mother_name) values(%s, %s, %s, %s, %s, %s, %s, %s) RETURNING student_id"
                sql1 = "insert into student_academic_enrollment_detail(student_id, class, section, roll_number) values(%s, %s, %s, %s)"
                print sql
                print sql1
                try:
                    cur.execute(sql, (fullname, emailid, phone, password, unencrypted, enrollment_number, father_name, mother_name))
                    student_id = cur.fetchone()[0]
                    print student_id

                    class_ = "2"
                    section = "A"
                    roll_number = "1"

                    cur.execute(sql1, (student_id, class_, section, roll_number))

                except:
                    print "Failed sql"

    pass

insert_db()

conn.commit()
cur.close()


