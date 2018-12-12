var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString1 = "postgres://postgres:postgres@localhost:5432/sankalp_";
var crypto = require('crypto');
var globalExports = require('./globalExports');

var request = require('request');

var api_key_shatabdi = '6db4aded-e001-11e8-a895-0200cd936042';
var api_key_mohit = '41398bea-aaf7-11e8-a895-0200cd936042';
var api_in_use = api_key_shatabdi;
var TemplateName = 'School'

router.post('/:schoolName/', function(req, resp, next){

	console.log(req.body);
  var schoolName = (req.params.schoolName).toLowerCase();
  //console.log(schoolName);
  var conString = globalExports.school_conn_db_dict[schoolName];
  //console.log(conString);

  var username = req.body.username;
  var phone = req.body.phone;
  var loginType = req.body.loginType;
  
  var login_data = {'success':0,'data':{},'token':''};
  //console.log(SHA224(password, "utf8").toString('hex'));
  //enc_pwd = SHA224(password, "utf8").toString('hex');

  if (!conString){
    console.log(conString);
    resp.send(login_data);
    return;
  }

  if (loginType == 'Admin'){
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("SELECT * FROM admin_login WHERE user_name=$1 AND password=$2;", [username, enc_pwd], function(err, res)
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
          if (res.rows.length==1){
            var api_key = crypto.createCipher('aes-128-cbc', schoolName);
            var got_id = api_key.update((res.rows[0].admin_id).toString(), 'utf8', 'hex');
            got_id += api_key.final('hex');
            console.log("successful login " + got_id);
            login_data['data'] = res.rows[0];
            login_data['success'] = 1;
            login_data['token'] = got_id;
          }
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
      
      db_client.query("select a.*, b.request_time, NOW() as current_time from teacher_login a left outer join teacher_pwd_request b on a.teacher_id=b.teacher_id where a.emailid=$1 and a.phone=$2;"
        , [username, phone], function(err, res)
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
          //send sms to phone
          //check if already exists
          if (res.rows.length==1){

            //login_data['success'] = 1;
            if (res.rows[0].current_time && (res.rows[0].current_time - res.rows[0].request_time > 4)){
              var message = 'You have requested password for ' + username + ". The password is " + res.rows[0].unencrypted + ". Note you can request password only once a day.";
              var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":res.rows[0].phone , "TemplateName":TemplateName};
              console.log(myJSONObject);
              try{
                request(
                  {
                    url:"http://2factor.in/API/V1/"+api_in_use+"/ADDON_SERVICES/SEND/TSMS",
                    method:"POST", 
                    json:true, 
                    body:myJSONObject
                  },
                  function(error,response,body)
                  {
                    if (error){
                      console.log(error);
                      resp.send(login_data);
                      db_client.end(function(err1){

                        if (err1){console.log(err1);}
                      });
                    }
                    else{
                      if (res.rows[0].request_time){
                        db_client.query("update teacher_pwd_request set request_time=NOW() where teacher_id=$1;",
                          [res.rows[0].teacher_id], function(err_1, res_1)
                        {
                          if (err_1){
                            console.log(err_1);
                            resp.send(login_data);
                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }
                          else{
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }

                        });
                      }
                      else{
                        db_client.query("insert into teacher_pwd_request values ($1, NOW());",
                          [res.rows[0].teacher_id], function(err_1, res_1)
                        {
                          if (err_1){
                            console.log(err_1);
                            resp.send(login_data);
                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }
                          else{
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }

                        });
                      }

                    }
                  }
                );
              }
              catch (error_){
                console.log(error_);
                resp.send(login_data);
                db_client.end(function(err1){

                  if (err1){console.log(err1);}
                });
              }
            }
            else{
              resp.send(login_data);
              db_client.end(function(err1){

                if (err1){console.log(err1);}
              });
            }

          }
          else{
            resp.send(login_data);
            db_client.end(function(err1){

              if (err1){console.log(err1);}
            });
          }
          
          //close connection
          
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
      
      db_client.query("select a.*, b.request_time, NOW() as current_time from student_login a left outer join student_pwd_request b on a.student_id=b.student_id where a.enrollment_number=$1 and a.phone=$2;"
        , [username, phone], function(err, res)
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
          //send sms to phone
          //check if already exists
          if (res.rows.length==1){

            //login_data['success'] = 1;
            if (res.rows[0].current_time && (res.rows[0].current_time - res.rows[0].request_time > 4*60*60)){
              var message = 'You have requested password for ' + username + ". The password is " + res.rows[0].unencrypted + ". Note you can request password only once a day.";
              var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":res.rows[0].phone , "TemplateName":TemplateName};
              console.log(myJSONObject);
              try{
                request(
                  {
                    url:"http://2factor.in/API/V1/"+api_in_use+"/ADDON_SERVICES/SEND/TSMS",
                    method:"POST", 
                    json:true, 
                    body:myJSONObject
                  },
                  function(error,response,body)
                  {
                    if (error){
                      console.log(error);
                      resp.send(login_data);
                      db_client.end(function(err1){

                        if (err1){console.log(err1);}
                      });
                    }
                    else{

                      if (res.rows[0].request_time){
                        db_client.query("update student_pwd_request set request_time=NOW() where student_id=$1;",
                          [res.rows[0].student_id], function(err_1, res_1)
                        {
                          if (err_1){
                            console.log(err_1);
                            resp.send(login_data);
                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }
                          else{
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }

                        });
                      }
                      else{
                        db_client.query("insert into student_pwd_request values ($1, NOW());",
                          [res.rows[0].student_id], function(err_1, res_1)
                        {
                          if (err_1){
                            console.log(err_1);
                            resp.send(login_data);
                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }
                          else{
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err1){

                              if (err1){console.log(err1);}
                            });
                          }

                        });  
                      }
                    }
                  }
                );
              }
              catch (error_){
                console.log(error_);
                resp.send(login_data);
                db_client.end(function(err1){

                  if (err1){console.log(err1);}
                });
              }
            }
            else{
              resp.send(login_data);
              db_client.end(function(err1){

                if (err1){console.log(err1);}
              });
            }

          }
          else{
            resp.send(login_data);
            db_client.end(function(err1){

              if (err1){console.log(err1);}
            });
          }
          
          //close connection
          
        }
      });
    });
  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;