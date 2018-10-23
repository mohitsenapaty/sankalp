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
  var student_id = req.body.student_id;
  var loginType = req.body.loginType;
  var hostel_id = req.body.hostel_id;
  var date_of_birth = req.body.date_of_birth;
  var transportation = req.body.transportation;
  var hostel_resident = req.body.hostel_resident;
  var residential_address = req.body.residential_address;
  var fdb_db = req.body.fdb_db;
  if (hostel_resident == 'Yes'){
    residential_address = "";
    transportation = "";
  }
  else{
    hostel_id = -1;
  }

  
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

      db_client.query("DELETE FROM student_residential_detail WHERE student_id=$1;"
        ,[student_id], function(err, res)
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
          db_client.query("INSERT INTO student_residential_detail values($1, $2, $3, $4, $5, $6, $7);",
            [student_id, date_of_birth, hostel_resident, residential_address, hostel_id, transportation, fdb_db], function(err1, res1)
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