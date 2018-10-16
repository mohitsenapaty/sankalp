var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString1 = "postgres://postgres:postgres@localhost:5432/sankalp_";
var crypto = require('crypto');

router.post('/:pwd/:schoolName/', function(req, resp, next){

	console.log(req.body);
  //console.log(next);
  var schoolName = (req.params.schoolName).toLowerCase();
  //console.log(schoolName);
  var conString = conString1 + schoolName;
  //console.log(conString);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  //var teacher_name = req.body.teacher_name;
  var student_id = req.body.student_id;
  
  var loginType = req.body.loginType;
  
  var enrollment_number = req.body.enrollment_number;
  var father_name = req.body.father_name;
  var mother_name = req.body.mother_name;
  var fullname = req.body.fullname;
  var emailid = req.body.emailid;
  var phone = req.body.phone;
  
  var login_data = {'success':0,'data':[],'token':''};
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

      db_client.query("update student_login set fullname=$2,emailid=$3,phone=$4,enrollment_number=$5,father_name=$6,mother_name=$7 where student_id=$1;"
        ,[student_id, fullname, emailid, phone, enrollment_number, father_name, mother_name]
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
    
  }
  else if (loginType == 'Student'){

  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;