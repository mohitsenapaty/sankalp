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
  var exam_group_id = req.body.exam_group_id;
  //var teacher_name = req.body.teacher_name;
  var student_id = req.body.student_id;
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
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("select a.*,b.* from exam_group_scoring a join subject_details b on a.subject_id=b.subject_id where a.student_id=$1 and a.exam_group_id=$2;"
        ,[student_id, exam_group_id]
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
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("select a.*,b.* from exam_group_scoring a join subject_details b on a.subject_id=b.subject_id where a.student_id=$1 and a.exam_group_id=$2;"
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
  else if (loginType == 'Student'){
    var db_client = new pg.Client(conString);
    db_client.connect(function(err_){

      if (err_){
        console.log(err); resp.send(login_data);
      }

      db_client.query("select * from exam_group_reports_single where student_id=$1 and exam_group_id=$2;"
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
          if (res.rows.length==1){
            console.log("pdf location " + res.rows[0].report_loc);
            login_data['data'] = res.rows[0];
            login_data['success'] = 1;
            login_data['token'] = got_id;
          }
          //resp.send(login_data);
          //close connection
          resp.download(res.rows[0].report_loc);
          
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