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
//-----

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

      db_client.query("select a.fullname, a.enrollment_number, a.father_name, a.mother_name,d.*,c.subject_name,e.grade,f.*,h.fullname as class_teacher from student_login a join student_subject_detail b on b.student_id=a.student_id join subject_details c on b.subject_id=c.subject_id join student_academic_enrollment_detail d on d.student_id=a.student_id join exam_group_scoring e on e.student_id=a.student_id and e.subject_id=b.subject_id join exam_group_detail f on e.exam_group_id=f.exam_group_id left outer join class_teacher_detail g on g.class=d.class and g.section=d.section left outer join teacher_login h on h.teacher_id=g.teacher_id where a.student_id=$1 and e.exam_group_id=$2;"
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
            var class_teacher = res.rows[0].class_teacher;

            var subjects = [];
            var grades = [];

            for (var i = 0; i < res.rows.length; i++){
              subjects.push(res.rows[i].subject_name);
              grades.push(res.rows[i].grade);
            }

            var tableRowString = ``;

            for (var i = 0; i < subjects.length; i++){
              var rowString = `<tr><td>${subjects[i]}</td><td>${grades[i]}</td></tr>`;
              tableRowString+=rowString;
            }
            var writeString = ``;
            
            editWriteString = (cb) =>{
              writeString = `

<html>
    <head>
        <style>
        .header {
            position: relative;
            height:10%;
        }

        .topright {
            position: absolute;
            top: 8px;
            right: 16px;
            font-size: 14px;
        }

        .topleft {
            position: absolute;
            top: 1%;
            left: 2%;
            font-size: 12px;
        }
        
        .leftImg {
            position: absolute;
            top: 40%;
            left: 2%;
            font-size: 12px;
        }
        
        .schoolName {
            position: absolute;
            top: 40%;
            left: 15%;
            font-size: 16px;
        }
        
        .studentName {
            position: absolute;
            top: 40%;
            right: 1%;
            font-size: 12px;
        }

        .topcenter {
            position: absolute;
            top: 1%;
            left: 35%;
            font-size: 16px;
        }
        
        .container {
            position: relative;
            height:70%;
        }
        #rcorners2 {
            position:absolute;
            border-radius: 25px;
            border: 2px solid #555555;
            width: 96%;
            height: 60%; 
            top: 30%;
            left: 2%;
            font-size:16px;
        }
        #rcorners3 {
            position:absolute;
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;
            border: 2px solid #555555;
            width: 96%;
            height: 7%; 
            top: 30%;
            left: 2%;
            font-size:16px;
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
                Year: ${session}
            </div>
            <div class="topcenter">Test Report Card - ${examname}</div>
            <div class="leftImg">Logo</div>
            <div class="schoolName">Kaanger Valley Academy</div>
            <div class="studentName">
            ${fullname} </br>
            Class: ${class_}${section}
            </div>
        </div>
        <hr align="center" noshade="false" width="100%">
        <div class="container">
            <div style="position:absolute;top:1%;left:2%;font-size:16px;">
                Student Information
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:6%">
            <div style="position:absolute;top:8%;left:2%;font-size:16px;">
              Roll Number: ${roll_number} &emsp; Date of Birth: 10-10-2010 &emsp; Admission Number: ${enrollment_number}
              </br>
              Father's Name: ${father_name} &emsp; Mother's Name: ${mother_name}
              </br>
              Class Teacher's Name: ${class_teacher}
              </br>
            </div>
            <div id="rcorners3">
                <div style="position:absolute; left:5%; top:20%;">
                Student Information
                </div>
            </div>
            <div id="rcorners2">
                <div style="position:absolute; left:1%; top:15%;">
                <table style="width:100%">
                    <tr style="width:100%">
                      <th style="width:100%"></th>
                      <th>${examname}</th>
                    </tr>
                    <tr style="width:100%">
                      <th style="width:100%">Subject</th>
                      <th>Grade</th>
                    </tr>
                    ${tableRowString}
                </table>
                </div>
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