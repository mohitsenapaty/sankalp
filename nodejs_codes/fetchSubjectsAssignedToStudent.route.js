var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString1 = "postgres://postgres:postgres@localhost:5432/sankalp_";
var crypto = require('crypto');
var globalExports = require('./globalExports');

router.post('/:pwd/:schoolName/', function(req, resp, next){

	console.log(req.body);
  //console.log(next);
  //console.log(next);
  var schoolName = (req.params.schoolName).toLowerCase();
  //console.log(schoolName);
  var conString = globalExports.school_conn_db_dict[schoolName];
  //console.log(conString);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  var student_Id = req.body.student_id;
  var student_id = parseInt(student_Id, 10);
  var class_ = req.body.class;
  var section = req.body.section;
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

      db_client.query("select c.*,d.*,f.fullname from student_login a join student_subject_detail b on a.student_id=b.student_id join subject_details c on b.subject_id=c.subject_id join student_academic_enrollment_detail d on a.student_id=d.student_id left outer join teacher_subject_detail e on e.subject_id=c.subject_id and e.class=d.class and e.section=d.section left outer join teacher_login f on e.teacher_id=f.teacher_id where a.student_id=$1;"
        ,[student_id]
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

          var data_arr = [];
          for (var i = 0; i < res.rows.length; i++){
            data_arr.push(res.rows[i]);
          }
          //var data_dict = {'data_arr':data_arr}
          console.log(data_arr);
          login_data['data'] = data_arr;
          login_data['success'] = 1;
          login_data['token'] = got_id;

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

  }
  else if (loginType == 'Student'){
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("select c.*,d.*,f.fullname from student_login a join student_subject_detail b on a.student_id=b.student_id join subject_details c on b.subject_id=c.subject_id join student_academic_enrollment_detail d on a.student_id=d.student_id left outer join teacher_subject_detail e on e.subject_id=c.subject_id and e.class=d.class and e.section=d.section left outer join teacher_login f on e.teacher_id=f.teacher_id where a.student_id=$1;"
        ,[userID]
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

          var data_arr = [];
          for (var i = 0; i < res.rows.length; i++){
            data_arr.push(res.rows[i]);
          }
          //var data_dict = {'data_arr':data_arr}
          console.log(data_arr);
          login_data['data'] = data_arr;
          login_data['success'] = 1;
          login_data['token'] = got_id;

          resp.send(login_data);
          //close connection
          db_client.end(function(err1){

            if (err1){console.log(err1);}
          });
        }
      });
    });
  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;