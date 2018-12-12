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
  var schoolName = (req.params.schoolName).toLowerCase();
  //console.log(schoolName);
  var conString = globalExports.school_conn_db_dict[schoolName];
  //console.log(conString);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  var subject_Id = req.body.subject_id;
  var subject_id = parseInt(subject_Id, 10);
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

      //first delete subject assigned to a teacher next delete from students assigned to teacher
      //delete from student_subject_detail a where subject_id=$1 and student_id in (select student_id from student_academic_enrollment_detail where class=$2 and section=$3);
      db_client.query("DELETE FROM teacher_subject_detail WHERE subject_id=$1 AND class=$2 AND section=$3;"
        ,[subject_id, class_, section], function(err, res)
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
          //var data_dict = {'data_arr':data_arr}
          //console.log(data_arr);
          //close connection
          db_client.query("delete from student_subject_detail a where subject_id=$1 and student_id in (select student_id from student_academic_enrollment_detail where class=$2 and section=$3);",
            [subject_id, class_, section], function(err1, res1)
          {
            if (err1){
              db_client.end(function(err2){

                if (err1){console.log(err2);}
              });
            }
            else{
              console.log(res.rows.length);

              login_data['data'] = "Success";
              login_data['success'] = 1;
              //login_data['token'] = got_id;

              resp.send(login_data);

              db_client.end(function(err2){

                if (err1){console.log(err2);}
              });
            }
          }); 
        }
      });
    });
  }
  else if (loginType == 'Teacher'){

  }
  else if (loginType == 'Student'){

  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;