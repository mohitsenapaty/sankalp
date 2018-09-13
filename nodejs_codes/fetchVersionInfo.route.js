var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/sankalp";
var crypto = require('crypto');

router.post('/:pwd/', function(req, resp, next){

	console.log(req.body);
  //console.log(next);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  //var teacher_name = req.body.teacher_name;
  var loginType = req.body.loginType;
  
  var login_data = {'success':0,'data':'','token':''};
  //console.log(SHA224(password, "utf8").toString('hex'));
  //enc_pwd = SHA224(password, "utf8").toString('hex');
  try{
    var api_key = crypto.createDecipher('aes-128-cbc', 'shatabdi');
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

      //db_client.query("select distinct a.*, b.fullname,d.class,d.section,d.roll_number from exam_group_scoring a join student_login b on a.student_id=b.student_id join teacher_subject_detail c on c.subject_id=a.subject_id join student_academic_enrollment_detail d on a.student_id=d.student_id where a.subject_id=$2 and c.teacher_id=$1 and a.exam_group_id=$3 and d.class=$4 and d.section=$5 order by d.roll_number;"
      db_client.query("select version_info from version_db;"
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
          console.log(res.rows[0].version_info);
          login_data['data'] = res.rows[0].version_info;
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

      //db_client.query("select distinct a.*, b.fullname,d.class,d.section,d.roll_number from exam_group_scoring a join student_login b on a.student_id=b.student_id join teacher_subject_detail c on c.subject_id=a.subject_id join student_academic_enrollment_detail d on a.student_id=d.student_id where a.subject_id=$2 and c.teacher_id=$1 and a.exam_group_id=$3 and d.class=$4 and d.section=$5 order by d.roll_number;"
      db_client.query("select version_info from version_db;"
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

          login_data['data'] = res.rows[0].version_info;
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

      //db_client.query("select distinct a.*, b.fullname,d.class,d.section,d.roll_number from exam_group_scoring a join student_login b on a.student_id=b.student_id join teacher_subject_detail c on c.subject_id=a.subject_id join student_academic_enrollment_detail d on a.student_id=d.student_id where a.subject_id=$2 and c.teacher_id=$1 and a.exam_group_id=$3 and d.class=$4 and d.section=$5 order by d.roll_number;"
      db_client.query("select version_info from version_db;"
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

          login_data['data'] = res.rows[0].version_info;
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
  else{
    resp.send(login_data);
  }

});

module.exports = router;