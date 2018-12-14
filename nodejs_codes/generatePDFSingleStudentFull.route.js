var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString1 = "postgres://postgres:postgres@localhost:5432/sankalp_";
var crypto = require('crypto');
var globalExports = require('./globalExports');

//-----
var fs = require('fs');
var async = require('async');
const AWS = require('aws-sdk');
//var maths = require('maths');
//-----

//---
var gradeDict = {'A+':6, 'A':5, 'B+':4, 'B':3, 'C':2, 'D':1, 'E':0};
var gradeArr = ['E', 'D', 'C', 'B', 'B+', 'A', 'A+'];
var access_key_id='AKIAJL7PKMZWIBBKU72A';
var secret_access_key='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';

const s3 = new AWS.S3({accessKeyId: access_key_id, secretAccessKey: secret_access_key});

router.post('/:pwd/:schoolName/', function(req, resp, next){

	console.log(req.body);
  //console.log(next);
  var schoolName = (req.params.schoolName).toLowerCase();
  //console.log(schoolName);
  var conString = globalExports.school_conn_db_dict[schoolName];
  //console.log(conString);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  //var teacher_name = req.body.teacher_name;
  var exam_group_id = req.body.exam_group_id;

  var loginType = req.body.loginType;
  
  var login_data = {'success':0,'data':[],'token':''};

  if (!conString){
    console.log(conString);
    resp.send(login_data);
    return;
  } 
  //console.log(SHA224(password, "utf8").toString('hex'));
  //enc_pwd = SHA224(password, "utf8").toString('hex');
  try{
    var api_key = crypto.createDecipher('aes-128-cbc', schoolName);
    var got_id = api_key.update(req.params.pwd, 'hex', 'utf8');
    got_id += api_key.final('utf8');
    console.log(got_id + " qqq" );
  }
  catch(error){
    console.log(error);
    resp.send(login_data);
    return;
  }
  if (got_id != userid){
    console.log(got_id);
    console.log(userid);
    resp.send(login_data);
    console.log("01");
    return;
  }

  if (loginType == 'Admin'){
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("update exam_group_detail set results_declared='Y' where exam_group_id=$1;"
        ,[exam_group_id]
        , function(err, res)
      {
        if (err){
          console.log(err); 
          resp.send(login_data);
          db_client.end(function(err1){

            if (err1){console.log(err1);}
          });
        }
        else
        { //console.log(res);
          console.log(res.rows.length);

          //console.log(res.rows.length);

          login_data['data'] = "Success";
          login_data['success'] = 1;
          //login_data['token'] = got_id;

          resp.send(login_data);
          //close connection
          db_client.end(function(err1){

            if (err1){console.log(err1);}
          });
        }
      });
    });
  }
  else if (loginType == 'Teacher'){
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("select a.fullname,d.*,c.subject_name,e.grade,f.* from student_login a join student_subject_detail b on b.student_id=a.student_id join subject_details c on b.subject_id=c.subject_id join student_academic_enrollment_detail d on d.student_id=a.student_id join exam_group_scoring e on e.student_id=a.student_id and e.subject_id=b.subject_id join exam_group_detail f on e.exam_group_id=f.exam_group_id where a.student_id=$1 and e.exam_group_id=$2;"
        ,[user_id,exam_group_id]
        , function(err, res)
      {
        if (err){
          console.log(err); 
          resp.send(login_data);
          db_client.end(function(err1){

            if (err1){console.log(err1);}
          });
        }
        else
        { //console.log(res);
          console.log(res.rows.length);

          //console.log(res.rows.length);

          login_data['data'] = "Success";
          login_data['success'] = 1;
          //login_data['token'] = got_id;

          resp.send(login_data);
          //close connection
          db_client.end(function(err1){

            if (err1){console.log(err1);}
          });
        }
      });
    });
  }
  else if (loginType == 'Student'){
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      var long_query = ``;
      long_query = `

        select a.fullname, a.enrollment_number, a.father_name, a.mother_name,d.*,c.subject_name,c.is_major,
        e.grade,f.*,h.fullname as class_teacher,i.*, j.*, k.*, l.* 
        from student_login a join student_subject_detail b on b.student_id=a.student_id 
        join subject_details c on b.subject_id=c.subject_id 
        join student_academic_enrollment_detail d on d.student_id=a.student_id 
        join exam_group_scoring e on e.student_id=a.student_id and e.subject_id=b.subject_id 
        join exam_group_detail f on e.exam_group_id=f.exam_group_id 
        left outer join class_teacher_detail g on g.class=d.class and g.section=d.section 
        left outer join teacher_login h on h.teacher_id=g.teacher_id 
        left outer join student_csa i on i.student_id=a.student_id and i.exam_group_id=e.exam_group_id
        left outer join student_personal_trait j on j.student_id=a.student_id and j.exam_group_id=e.exam_group_id 
        left outer join student_ahs k on k.student_id=a.student_id and k.exam_group_id=e.exam_group_id
        left outer join student_remarks l on l.student_id=a.student_id and l.exam_group_id=e.exam_group_id
        where a.student_id=$1 and 
        e.exam_group_id in (select exam_group_id from exam_group_detail a 
          where a.session in (select session from exam_group_detail where exam_group_id=$2) 
          and a.term_number in (select term_number from exam_group_detail where exam_group_id=$2));

      `;

      db_client.query(long_query
        ,[userID, exam_group_id]
        , function(err, res)
      {
        if (err){
          console.log(err); 
          resp.send(login_data);
          db_client.end(function(err1){

            if (err1){console.log(err1);}
          });
        }
        else
        { //console.log(res);
          console.log(res.rows.length);
          console.log(res.rows[0]);

          if (res.rows.length >= 1){
            var examname = res.rows[0].exam_group_name;
            var roll_number = res.rows[0].roll_number;
            var fullname = res.rows[0].fullname;
            var class_ = res.rows[0].class;
            var section = res.rows[0].section;
            var session = res.rows[0].session;
            var father_name = res.rows[0].father_name;
            var mother_name = res.rows[0].mother_name;
            var enrollment_number = res.rows[0].enrollment_number;
            var enc_file_name = SHA224(res.rows[0].exam_group_id+res.rows[0].student_id+fullname, "utf8").toString('hex');
            var class_teacher = res.rows[0].class_teacher

            var discipline = res.rows[0].discipline;
            var punctuality = res.rows[0].punctuality;
            var hygiene = res.rows[0].hygiene;

            var lit_int = res.rows[0].literary_interest;
            var com_skill = res.rows[0].communication_skill;
            var music = res.rows[0].music;
            var art_craft = res.rows[0].art_craft;

            var remarks = res.rows[0].remarks;

            var total_working_days = res.rows[0].total_working_days;
            var attendance = res.rows[0].attendance;
            var height = res.rows[0].height;
            var weight = res.rows[0].weight;
            var bmi = res.rows[0].bmi;

            var all_major_subject_obj = {};
            var avg_major_subject_obj = {};
            var exam_dict_major = {};
            var exam_dict_minor = {};
            //console.log(res.rows);
            for (var i = 0; i < res.rows.length; i++){
              //subjects.push(res.rows[i].subject_name);
              //grades.push(res.rows[i].grade);
              if (res.rows[i].term_final == 'Y'){
                var discipline = res.rows[i].discipline;
                var punctuality = res.rows[i].punctuality;
                var hygiene = res.rows[i].hygiene;

                var lit_int = res.rows[i].literary_interest;
                var com_skill = res.rows[i].communication_skill;
                var music = res.rows[i].music;
                var art_craft = res.rows[i].art_craft;

                var remarks = res.rows[i].remarks;

                var total_working_days = res.rows[i].total_working_days;
                var attendance = res.rows[i].attendance;
                var height = res.rows[i].height;
                var weight = res.rows[i].weight;
                var bmi = res.rows[i].bmi;
              }
              if (res.rows[i].is_major == 'Major'){
                if (!all_major_subject_obj[res.rows[i].subject_name])
                  all_major_subject_obj[res.rows[i].subject_name] = {};

                if (!avg_major_subject_obj[res.rows[i].subject_name])
                  avg_major_subject_obj[res.rows[i].subject_name] = {};
                //var exam_obj = {}
                //exam_obj[res.rows[i].exam_group_name] = res.rows[i].grade;
                all_major_subject_obj[res.rows[i].subject_name][res.rows[i].exam_group_name] = res.rows[i].grade;
                if (res.rows[i].exam_group_type == 'All Subjects'){
                  avg_major_subject_obj[res.rows[i].subject_name][res.rows[i].exam_group_name] = res.rows[i].grade;
                }

              }

            }
            //console.log(all_major_subject_obj);
            //console.log(avg_major_subject_obj);
            //find average
            //only major means assignment
            //All subjects -- name speaks for itself
            var max_length_exam_major = 0;
            for (var subj in avg_major_subject_obj){
              var i = 0;
              var grade_total = 0.0;
              for (var exam_ in avg_major_subject_obj[subj]){
                i++;
                
                var cur_grade = gradeDict[avg_major_subject_obj[subj][exam_]];
                grade_total += cur_grade;
              }
              var grade_avg = Math.ceil(grade_total/i);
              all_major_subject_obj[subj]["Average"] = gradeArr[grade_avg];
              //console.log(subj);
              //console.log(gradeArr[grade_avg]);
            }

            for (var subj in all_major_subject_obj){
              var i = 0;
              for (var exam_ in all_major_subject_obj[subj]){
                i++;
                exam_dict_major[exam_] = 1;
                if (i > max_length_exam_major){
                  max_length_exam_major = i;
                }
              }
            }

            //console.log(all_major_subject_obj);
            //console.log(avg_major_subject_obj);


            var all_minor_subject_obj = {};
            for (var i = 0; i < res.rows.length; i++){
              //subjects.push(res.rows[i].subject_name);
              //grades.push(res.rows[i].grade);
              if (res.rows[i].is_major == 'Minor'){
                if (!all_minor_subject_obj[res.rows[i].subject_name])
                  all_minor_subject_obj[res.rows[i].subject_name] = {};
                //var exam_obj = {}
                //exam_obj[res.rows[i].exam_group_name] = res.rows[i].grade;
                all_minor_subject_obj[res.rows[i].subject_name][res.rows[i].exam_group_name] = res.rows[i].grade;

              }

            }

            for (var subj in all_minor_subject_obj){
              var i = 0;
              console.log(subj);
              for (var exam_ in all_minor_subject_obj[subj]){
                i++;
                exam_dict_minor[exam_] = 1;
                console.log(exam_);
              }
            }

            var max_length_exam_minor = 0;
            for (var subj in all_minor_subject_obj){
              var i = 0;
              for (var exam_ in all_minor_subject_obj[subj]){
                i++;
                if (i > max_length_exam_minor){
                  max_length_exam_minor = i;
                }
              }
            }

            /*
            var subjects = [];
            var grades = [];

            for (var i = 0; i < res.rows.length; i++){
              subjects.push(res.rows[i].subject_name);
              grades.push(res.rows[i].grade);
            }*/

            var majortableRowString = ``;
            var minortableRowString = ``;

            
            var major_exam_header = ``;
            for (var exam_ in exam_dict_major){
              var rowString = `<th>${exam_}</th>`;
              
              major_exam_header += rowString;
              
            }
            var grade_row_body = ``;
            for (var subj in all_major_subject_obj){
              var grade_row =`<td>${subj}</td>`;
              for (var exam_ in exam_dict_major){
                var grade_ = '';
                if (!all_major_subject_obj[subj][exam_]){
                  grade_ = '';
                }
                else{
                  grade_ = all_major_subject_obj[subj][exam_];
                }
                var rowString_grade =  `<td>${grade_}</td>`;
                grade_row += rowString_grade
              }
              grade_row_body += `<tr>${grade_row}</tr>`;
            }

            majortableRowString += `<tr>
                      <th rowspan="2">Subject</th>
                      <th colspan="${max_length_exam_major}" >Term 1</th>
                    </tr>
                    <tr>
                    ${major_exam_header}
                    </tr>
                    ${grade_row_body}
                    `;

            /*
            for (var i = 0; i < subjects.length; i++){
              var rowString = `<tr><td>${subjects[i]}</td><td>${grades[i]}</td></tr>`;
              tableRowString+=rowString;
            }
            */
            var minor_exam_header = ``;
            for (var exam_ in exam_dict_minor){
              var rowString = `<th>${exam_}</th>`;
              
              minor_exam_header += rowString;
              
            }
            console.log(exam_dict_minor);
            console.log(all_minor_subject_obj);

            grade_row_body = ``;
            for (var subj in all_minor_subject_obj){
              var grade_row =`<td>${subj}</td>`;
              for (var exam_ in exam_dict_minor){
                var grade_ = '';
                if (!all_minor_subject_obj[subj][exam_]){
                  grade_ = '';
                }
                else{
                  grade_ = all_minor_subject_obj[subj][exam_];
                }
                var rowString_grade =  `<td>${grade_}</td>`;
                grade_row += rowString_grade
              }
              grade_row_body += `<tr>${grade_row}</tr>`;
            }

            minortableRowString += `
                    <tr>
                    <th rowspan="1">Subject</th>
                    ${minor_exam_header}
                    </tr>
                    ${grade_row_body}
                    `;

            var writeString = ``;
            
            editWriteString = (cb) =>{
              writeString = `

<html>
    <head>
        <style>
        .header {
            position: relative;
            height:8%;
        }

        .topright {
            position: absolute;
            top: 8px;
            right: 16px;
            font-size: 12px;
        }

        .topleft {
            position: absolute;
            top: 1%;
            left: 2%;
            font-size: 10px;
        }
        
        .leftImg {
            position: absolute;
            top: 40%;
            left: 2%;
            font-size: 10px;
        }
        
        .schoolName {
            position: absolute;
            top: 40%;
            left: 15%;
            font-size: 14px;
        }
        
        .studentName {
            position: absolute;
            top: 40%;
            right: 1%;
            font-size: 10px;
        }

        .topcenter {
            position: absolute;
            top: 1%;
            left: 35%;
            font-size: 10px;
        }
        
        .container {
            position: relative;
            height:70%;
        }
        .minor_subjects{
            position:absolute;
            width: 95%;
            height: 40%; 
            top: 47%;
            left: 3%;
            font-size:10px;
        }
        .csa{
            position:absolute;
            width: 95%;
            height: 40%; 
            top: 67%;
            left: 3%;
            font-size:10px;
        }
        .personal_traits{
            position:absolute;
            width: 95%;
            height: 40%; 
            top: 93%;
            left: 3%;
            font-size:10px;
        }
        #rcorners2 {
            position:absolute;
            //border-radius: 25px;
            //border: 2px solid #555555;
            width: 96%;
            height: 40%; 
            top: 15%;
            left: 2%;
            font-size:10px;
        }
        #rcorners3 {
            position:absolute;
            //border-top-left-radius: 25px;
            //border-top-right-radius: 25px;
            //border: 2px solid #555555;
            width: 96%;
            height: 7%; 
            top: 11%;
            //left: 2%;
            font-size:10px;
        }
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
        th {
          height:20px;
        }
        th, td {
            padding: 5px;
        }
        </style>
    </head>
    <body>
        <div class="header" >
            <div class="topleft">
                Year: 2018-2019
            </div>
            <div class="topcenter">Test Report Card - ${examname}</div>
            <div class="leftImg">Logo</div>
            <div class="schoolName">${schoolName}</div>
            <div class="studentName">
            ${fullname} </br>
            Class: ${class_}${section}
            </div>
        </div>
        <hr align="center" noshade="false" width="100%" style="position:relative;top:0%">
        <div class="container">
            <div style="position:absolute;top:0%;left:2%;font-size:10px;">
                Student Information
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:3%">
            <div style="position:absolute;top:4%;left:2%;font-size:10px;">
              Roll Number: ${roll_number} &emsp; Date of Birth: 10-10-2010 &emsp; Admission Number: ${enrollment_number}
              </br>
              Father's Name: ${father_name} &emsp; Mother's Name: ${mother_name}
              </br>
              Class Teacher's Name: ${class_teacher}
              </br>
            </div>
            <div id="rcorners3">
                <div style="position:absolute; left:5%; top:15%;">
                Scholastic Area
                </div>
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:12%">
            <div id="rcorners2">
                <div style="position:absolute; left:1%; top:0%;">
                <table style="width: 100%; table-layout: fixed; font-size: 10px">
                    ${majortableRowString}
                </table>
                </div>
            </div>
            <div style="position:absolute; left:5%; top:44%; font-size: 10px;">
                Additional subjects
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:42%" />
            <div class="minor_subjects">
                <table style="width: 100%; table-layout: fixed; font-size: 10px;">
                    ${minortableRowString}
                </table>
            </div>
            <div style="position:absolute; left:5%; top:63%;font-size: 10px;">
                Co-Scholastic Activities.
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:60%" />
            <div class="csa">
                <table style="width: 100%; table-layout: fixed;font-size: 10px;">
                    <tr>
                      <th rowspan="1">Activities</th>
                      <th>Grade</th>
                    </tr>
                    <tr>
                        <td>Literary Interest</td>
                        <td>${lit_int}</td>
                    </tr>
                    <tr>
                        <td>Communication skill</td>
                        <td>${com_skill}</td>
                    </tr>
                    <tr>
                        <td>Music</td>
                        <td>${music}</td>
                    </tr>
                    <tr>
                        <td>Art and Craft</td>
                        <td>${art_craft}</td>
                    </tr>
                </table>
            </div>
            <div style="position:absolute; left:5%; top:89%;font-size: 10px;">
                Personal Traits
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:84%" />
            
            <div class="personal_traits">
                <table style="width: 100%; table-layout: fixed;font-size: 10px;">
                    <tr>
                      <th rowspan="1">Qualities</th>
                      <th>Grade</th>
                    </tr>
                    <tr>
                        <td>Discipline</td>
                        <td>${discipline}</td>
                    </tr>
                    <tr>
                        <td>Punctuality</td>
                        <td>${punctuality}</td>
                    </tr>
                    <tr>
                        <td>Hygiene</td>
                        <td>${hygiene}</td>
                    </tr>
                </table>
            </div>

            <div style="position:absolute; left:5%; top:110%;font-size: 10px;">
                Attendance and Health status
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:104%" />
            <div style="position:absolute; left:5%; top:114%;font-size: 10px;">
                Attnd: ${attendance}/${total_working_days} Height: ${height}cm Weight: ${weight} kg BMI:${bmi} 
            </div>  
        </div>
    </body>
<html>

`;
              console.log("write string created");
              return cb(null);

            }

            writeToHtml = (cb) =>{
              var writeStream = fs.createWriteStream('/var/tmp/'+enc_file_name+'.html');
              //console.log(writeString);
              writeStream.write(writeString);
              writeStream.end();
              console.log('1');
              return cb(null);
            }

            writeToPDF = (cb) =>{
              var pdf = require('html-pdf');
              var html = fs.readFileSync('/var/tmp/'+enc_file_name+'.html', 'utf8');
              //console.log(html);
              var options = { format: 'A4' };

              pdf.create(writeString, options).toFile('/var/tmp/'+enc_file_name+'.pdf', function(err, res) {
                if (err) {return cb(null,console.log(err));}
                console.log(res); // { filename: '/app/businesscard.pdf' }
                return cb(null, "2");
              });
              //return 3;

            }
            async.waterfall([editWriteString, writeToHtml, writeToPDF], (error, result)=>{
              if (error){
                console.log(error);
                resp.send(login_data);
                db_client.end(function(err1){

                  if (err1){console.log(err1);}
                });
              }
              else{
                if (result == '2'){
                  //means success
                  var reportLoc='/var/tmp/'+enc_file_name+'.pdf';
                  db_client.query("insert into exam_group_reports_single(exam_group_id,student_id,report_loc,remote_link,status) values($1,$2,$3,$4,$5);"
                    ,[exam_group_id, userID, reportLoc, 'None', 'A'] //A for report added
                    , function(err2, res2)
                  {
                    if (err2){
                      console.log(err2); 
                      resp.send(login_data);
                      db_client.end(function(err3){

                        if (err3){console.log(err3);}
                      });
                    }
                    else
                    { //console.log(res);
                      console.log(res.rows.length);

                      //console.log(res.rows.length);

                      login_data['data'] = "Success";
                      login_data['success'] = 1;
                      //login_data['token'] = got_id;

                      resp.send(login_data);
                      //close connection
                      db_client.end(function(err3){

                        if (err3){console.log(err3);}
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
    });
  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;