var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/sankalp";
var crypto = require('crypto');

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

router.post('/:pwd/', function(req, resp, next){

	console.log(req.body);
  //console.log(next);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  var fullname = req.body.fullname;
  var emailid = req.body.emailid;
  var phone = req.body.phone;
  var class_ = req.body.class;
  var section = req.body.section;
  var roll_number = req.body.roll_number;
  var loginType = req.body.loginType;
  
  var login_data = {'success':0,'data':[],'token':''};
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
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    var enc_pwd = SHA224(rString, "utf8").toString('hex');
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("INSERT INTO student_login(fullname, emailid, phone, password, unencrypted) VALUES ($1,$2,$3,$4,$5) RETURNING student_id;",
        [fullname, emailid, phone, enc_pwd, rString], function(err, res)
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
          db_client.query("INSERT INTO student_academic_enrollment_detail(student_id, class, section, roll_number) VALUES ($1,$2,$3,$4);",
            [res.rows[0].student_id, class_, section, roll_number], function(err1, res1)
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