var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString1 = "postgres://postgres:postgres@localhost:5432/sankalp_";
var crypto = require('crypto');

var async = require('async');

router.post('/:pwd/:schoolName/', function(req, resp, next){

  console.log(req.body);
  //console.log(next);
  var schoolName = (req.params.schoolName).toLowerCase();
  //console.log(schoolName);
  var conString = conString1 + schoolName;
  //console.log(conString);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  var loginType = req.body.loginType;

  var student_id = req.body.student_id;
  var exam_group_id = req.body.exam_group_id;
  var lit_int = req.body.lit_int;
  var com_skill = req.body.com_skill;
  var music = req.body.music;
  var arts_craft = req.body.arts_craft;
  var discipline = req.body.discipline;
  var punctuality = req.body.punctuality;
  var hygiene = req.body.hygiene;
  var total_num_days = parseInt(req.body.total_num_days, 10);
  var present_days = parseInt(req.body.present_days, 10);
  var height = parseFloat(req.body.height);
  var weight = parseFloat(req.body.weight);
  var bmi = parseFloat(req.body.bmi);
  var remarks1 = req.body.remarks;

  console.log(remarks1);
  
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

    

  }
  else if (loginType == 'Teacher'){
    csa = (cb) =>{
      var db_client = new pg.Client(conString);
      db_client.connect(function(err_){

        if (err_){
          console.log(err); //resp.send(login_data);
        }

        db_client.query("DELETE FROM student_csa where student_id=$1 and exam_group_id=$2;"
          ,[student_id, exam_group_id], function(err, res)
        {
          if (err){
            console.log(err); 
            //resp.send(login_data);
            db_client.end(function(err1){

              if (err1){console.log(err1);}
              return cb(null);
            });
          }
          else
          { //console.log(res);
            console.log(res.rows.length);
            //var data_dict = {'data_arr':data_arr}
            //console.log(data_arr);
            db_client.query("INSERT INTO student_csa values($1, $2, $3, $4, $5, $6);"
              ,[exam_group_id, student_id, lit_int, com_skill, music, arts_craft], function(err_, res_)
            {
              if (err_){
                console.log(err_); 
                //resp.send(login_data);
                db_client.end(function(err1_){

                  if (err1_){console.log(err1_);}
                  return cb(null);
                });
              }
              else{
                console.log(res.rows.length);

                login_data['data'] = "Success";
                login_data['success'] = 1;
                login_data['token'] = got_id;

                //resp.send(login_data);
                //close connection
                db_client.end(function(err1){

                  if (err1){console.log(err1);}
                  return cb(null);
                });
              }
            });
          }
        });
      });

    }

    pt = (cb) =>{
      var db_client = new pg.Client(conString);
      db_client.connect(function(err_){

        if (err_){
          console.log(err); //resp.send(login_data);
        }

        db_client.query("DELETE FROM student_personal_trait where student_id=$1 and exam_group_id=$2;"
          ,[student_id, exam_group_id], function(err, res)
        {
          if (err){
            console.log(err); 
            //resp.send(login_data);
            db_client.end(function(err1){

              if (err1){console.log(err1);}
              return cb(null);
            });
          }
          else
          { //console.log(res);
            console.log(res.rows.length);
            //var data_dict = {'data_arr':data_arr}
            //console.log(data_arr);
            db_client.query("INSERT INTO student_personal_trait values($1, $2, $3, $4, $5);"
              ,[exam_group_id, student_id, discipline, punctuality, hygiene], function(err_, res_)
            {
              if (err_){
                console.log(err_); 
                //resp.send(login_data);
                db_client.end(function(err1_){

                  if (err1_){console.log(err1_);}
                  return cb(null);
                });
              }
              else{
                console.log(res.rows.length);
                
                login_data['data'] = "Success";
                login_data['success'] = 1;
                login_data['token'] = got_id;

                //resp.send(login_data);
                //close connection
                db_client.end(function(err1){

                  if (err1){console.log(err1);}
                  return cb(null);
                });
              }
            });
          }
        });
      });
    }

    ahs = (cb) =>{
      var db_client = new pg.Client(conString);
      db_client.connect(function(err_){

        if (err_){
          console.log(err); //resp.send(login_data);
        }

        db_client.query("DELETE FROM student_ahs where student_id=$1 and exam_group_id=$2;"
          ,[student_id, exam_group_id], function(err, res)
        {
          if (err){
            console.log(err); 
            //resp.send(login_data);
            db_client.end(function(err1){

              if (err1){console.log(err1);}
              return cb(null);
            });
          }
          else
          { //console.log(res);
            console.log(res.rows.length);
            //var data_dict = {'data_arr':data_arr}
            //console.log(data_arr);
            db_client.query("INSERT INTO student_ahs values($1, $2, $3, $4, $5, $6, $7);"
              ,[exam_group_id, student_id, total_num_days, present_days, height, weight, bmi], function(err_, res_)
            {
              if (err_){
                console.log(err_); 
                //resp.send(login_data);
                db_client.end(function(err1_){

                  if (err1_){console.log(err1_);}
                  return cb(null);
                });
              }
              else{
                console.log(res.rows.length);
                
                login_data['data'] = "Success";
                login_data['success'] = 0;
                login_data['token'] = got_id;

                //resp.send(login_data);        
                //close connection
                db_client.end(function(err1){

                  if (err1){console.log(err1);}
                  return cb(null);
                });
              }
            });
          }
        });
      });
    }

    remarks = (cb) =>{
      var db_client = new pg.Client(conString);
      db_client.connect(function(err_){

        if (err_){
          console.log(err); //resp.send(login_data);
        }

        db_client.query("DELETE FROM student_remarks where student_id=$1 and exam_group_id=$2;"
          ,[student_id, exam_group_id], function(err, res)
        {
          if (err){
            console.log(err); 
            //resp.send(login_data);
            db_client.end(function(err1){

              if (err1){console.log(err1);}
              return cb(null);
            });
          }
          else
          { //console.log(res);
            console.log(res.rows.length);
            //var data_dict = {'data_arr':data_arr}
            console.log(remarks1);
            db_client.query("INSERT INTO student_remarks values($1, $2, $3);"
              ,[exam_group_id, student_id, remarks1], function(err_, res_)
            {
              if (err_){
                console.log(err_); 
                //resp.send(login_data);
                db_client.end(function(err1_){

                  if (err1_){console.log(err1_);}
                  return cb(null);
                });
              }
              else{
                console.log(res.rows.length);
                
                login_data['data'] = "Success";
                login_data['success'] = 1;
                login_data['token'] = got_id;

                //resp.send(login_data);
                //close connection
                db_client.end(function(err1){

                  if (err1){console.log(err1);}
                  return cb(null);
                });
              }
            });
          }
        });
      });
    }

    async.waterfall([csa, pt, ahs, remarks], (error, result)=>{
      if (error){
        login_data['success'] = 0;
        resp.send(login_data);
      }
      else{
        login_data['success'] = 1;
        resp.send(login_data);
      }
    });
  }
  else if (loginType == 'Student'){

  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;