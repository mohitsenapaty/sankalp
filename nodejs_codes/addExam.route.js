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
  var loginType = req.body.loginType;
  var exam_group_name = req.body.exam_group_name;
  var exam_group_date = req.body.exam_group_date;
  var exam_group_DATE = new Date(exam_group_date);
  var exam_group_type = req.body.exam_group_type;
  var max_major_marks = parseInt(req.body.max_major_marks);
  var max_minor_marks = parseInt(req.body.max_minor_marks);
  var all_class_selected =req.body.all_class_selected;
  var classes_selected = req.body.classes_selected;
  var session = req.body.session;
  var term_number = req.body.term_number;
  var term_final = req.body.term_final;
  
  var login_data = {'success':0,'data':[],'token':''};

  console.log(all_class_selected);
  //console.log(classes_selected);
  //resp.send(login_data);
  //return;

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

      db_client.query("INSERT INTO exam_group_detail(exam_group_name, exam_group_type, exam_group_date, session, term_number, term_final) VALUES ($1,$2,$3,$4,$5,$6) RETURNING exam_group_id;",
        [exam_group_name, exam_group_type, exam_group_date, session, term_number, term_final], 
        function(err, res)
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
          //4 cases, if all n full, all n not full, not all n full, not all n not full
          if (all_class_selected == true && exam_group_type == 'All Subjects'){
            db_client.query("INSERT INTO exam_group_scoring(exam_group_id, subject_id, student_id) select $1, a.subject_id, a.student_id from student_subject_detail a;",
              [res.rows[0].exam_group_id], function(err1, res1)
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
          if (all_class_selected == true && exam_group_type == 'Only Major'){
            db_client.query("INSERT INTO exam_group_scoring(exam_group_id, subject_id, student_id) select $1, a.subject_id, a.student_id from student_subject_detail a join subject_details b on a.subject_id=b.subject_id where b.is_major=$2;",
              [res.rows[0].exam_group_id, 'Major'], function(err1, res1)
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
          if (all_class_selected == false && exam_group_type == 'All Subjects'){
            db_client.query("INSERT INTO exam_group_scoring(exam_group_id, subject_id, student_id) select $1, a.subject_id, a.student_id from student_subject_detail a join student_academic_enrollment_detail b on a.student_id=b.student_id where b.class=ANY($2);",
              [res.rows[0].exam_group_id, classes_selected], function(err1, res1)
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
          if (all_class_selected == false && exam_group_type == 'Only Major'){
            db_client.query("INSERT INTO exam_group_scoring(exam_group_id, subject_id, student_id) select $1, a.subject_id, a.student_id from student_subject_detail a join student_academic_enrollment_detail b on a.student_id=b.student_id join subject_details c on a.subject_id=c.subject_id where b.class=ANY($2) and c.is_major=$3;",
              [res.rows[0].exam_group_id, classes_selected, 'Major'], function(err1, res1)
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