var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString1 = "postgres://postgres:postgres@localhost:5432/sankalp_";
var crypto = require('crypto');

var request = require('request');

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
  var subject = req.body.subject;
  var message = req.body.message;
  var noticeFor = req.body.noticeFor;
  var all_class_selected =req.body.all_class_selected;
  var classes_selected = req.body.classes_selected;
  var all_section_selected =req.body.all_section_selected;
  var sections_selected = req.body.sections_selected;
  var singleStudent = req.body.singleStudent;
  var student_id=req.body.student_id;
  
  var login_data = {'success':0,'data':'','token':''};

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
      //first try to sms everyone.

      //then insert to database.
      db_client.query("INSERT INTO notification_detail(notification_creator, creator_id, subject, message, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING notification_id;",
        [loginType, userID, subject, message], function(err, res)
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
          if (noticeFor=='All'){

            db_client.query("select a.phone from student_login a union select b.phone from teacher_login b;",
              function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                //console.log(res.rows);
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                phoneStr = "";
                for (var i = 0; i < res1_.rows.length-1; i++){
                  phoneStr+=res1_.rows[i].phone+",";
                }
                phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                console.log(phoneStr);
                var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};
                try
                {
                  request(
                    {
                      url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                      method:"POST", 
                      json:true, 
                      body:myJSONObject
                    },
                    function(error,response,body)
                    {
                      if (error){
                        console.log(error);
                        //make query to delete the id may be
                        resp.send(login_data);
                        db_client.query("delete from notification_detail where notification_id=$1;",
                          [res.rows[0].notification_id], function(err1, res1)
                        {
                          if (err1){
                            db_client.end(function(err2){

                              if (err1){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;

                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                        });
                      } 
                      else{ 
                        console.log(response);
                        //make query to add to the notification creator

                        db_client.query("insert into notification_target(notification_id, target_type) VALUES ($1, $2);",
                          [res.rows[0].notification_id, noticeFor], function(err1, res1)
                        {
                          if (err1){
                            console.log(err1);
                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err2){
                                console.log(err2);
                              }
                            });
                          }
                        });

                      } 
                    }
                  );
                }
                catch(err){
                  console.log(err);
                }
              }
            });
          }
          if (noticeFor=='Teacher'){
            db_client.query("select b.phone from teacher_login b;",
              function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                phoneStr = "";
                for (var i = 0; i < res1_.rows.length-1; i++){
                  phoneStr+=res1_.rows[i].phone+",";
                }
                phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};
                try{
                  request(
                    {
                      url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                      method:"POST", 
                      json:true, 
                      body:myJSONObject
                    },
                    function(error,response,body)
                    {
                      if (error){
                        console.log(error);
                        //make query to delete the id may be
                        resp.send(login_data);
                        db_client.query("delete from notification_detail where notification_id=$1;",
                          [res.rows[0].notification_id], function(err1, res1)
                        {
                          if (err1){
                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;

                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                        });
                      } 
                      else{ 
                        console.log(response);
                        //make query to add to the notification creator

                        db_client.query("insert into notification_target(notification_id, target_type) VALUES ($1, $2);",
                          [res.rows[0].notification_id, "All "+noticeFor], function(err1, res1)
                        {
                          if (err1){
                            console.log(err1);
                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err2){
                                console.log(err2);
                              }
                            });
                          }
                        });

                      } 
                    }
                  );
                }
                catch (err){
                  console.log(error);
                }
              }
            });
          }
          if (noticeFor=='Student' && all_class_selected==true){
            db_client.query("select a.phone from student_login a;",
              function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                phoneStr = "";
                for (var i = 0; i < res1_.rows.length-1; i++){
                  phoneStr+=res1_.rows[i].phone+",";
                }
                phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};
                try{
                  request(
                    {
                      url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                      method:"POST", 
                      json:true, 
                      body:myJSONObject
                    },
                    function(error,response,body)
                    {
                      if (error){
                        console.log(error);
                        //make query to delete the id may be
                        resp.send(login_data);
                        db_client.query("delete from notification_detail where notification_id=$1;",
                          [res.rows[0].notification_id], function(err1, res1)
                        {
                          if (err1){
                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;

                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err1){console.log(err2);}
                            });
                          }
                        });
                      } 
                      else{ 
                        console.log(response);
                        //make query to add to the notification creator

                        db_client.query("insert into notification_target(notification_id, target_type) VALUES ($1, $2);",
                          [res.rows[0].notification_id, "All "+noticeFor], function(err1, res1)
                        {
                          if (err1){
                            console.log(err1);
                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err2){
                                console.log(err2);
                              }
                            });
                          }
                        });

                      } 
                    }
                  );
                }
                catch(err){
                  console.log(error);
                }
              }
            });
          }
          if (noticeFor=='Student' && all_class_selected == false && all_section_selected == true){
            db_client.query("select a.phone from student_login a join student_academic_enrollment_detail b on a.student_id=b.student_id where b.class=ANY($1);"
              ,[classes_selected]
              ,function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                phoneStr = "";
                for (var i = 0; i < res1_.rows.length-1; i++){
                  phoneStr+=res1_.rows[i].phone+",";
                }
                phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};

                try{
                  request(
                    {
                      url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                      method:"POST", 
                      json:true, 
                      body:myJSONObject
                    },
                    function(error,response,body)
                    {
                      if (error){
                        console.log(error);
                        //make query to delete the id may be
                        resp.send(login_data);
                        db_client.query("delete from notification_detail where notification_id=$1;",
                          [res.rows[0].notification_id], function(err1, res1)
                        {
                          if (err1){
                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;

                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err1){console.log(err2);}
                            });
                          }
                        });
                      } 
                      else{ 
                        console.log(response);
                        //make query to add to the notification creator

                        db_client.query("insert into notification_target(notification_id, target_type, target_class, target_section) select $1, $2, a.class, a.section from student_academic_enrollment_detail a where a.class=ANY($3);",
                          [res.rows[0].notification_id, noticeFor, classes_selected], function(err1, res1)
                        {
                          if (err1){
                            console.log(err1);
                            db_client.end(function(err2){

                              if (err2){console.log(err2);}
                            });
                          }
                          else{
                            console.log(res.rows.length);
                            //login_data['token'] = got_id;
                            login_data['data'] = "Success";
                            login_data['success'] = 1;
                            resp.send(login_data);

                            db_client.end(function(err2){

                              if (err2){
                                console.log(err2);
                              }
                            });
                          }
                        });

                      } 
                    }
                  );
                }
                catch(err){
                  console.log(err);
                }
              }
            });
          }
          if (noticeFor=='Student' && all_class_selected == false && all_section_selected == false && singleStudent == false){
            db_client.query("select a.phone from student_login a join student_academic_enrollment_detail b on a.student_id=b.student_id where b.class=ANY($1) and b.section=ANY($2);"
              ,[classes_selected, sections_selected]
              ,function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                else{
                  phoneStr = "";
                  for (var i = 0; i < res1_.rows.length-1; i++){
                    phoneStr+=res1_.rows[i].phone+",";
                  }
                  phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                  var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};

                  try{
                    request(
                      {
                        url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                        method:"POST", 
                        json:true, 
                        body:myJSONObject
                      },
                      function(error,response,body)
                      {
                        if (error){
                          console.log(error);
                          //make query to delete the id may be
                          resp.send(login_data);
                          db_client.query("delete from notification_detail where notification_id=$1;",
                            [res.rows[0].notification_id], function(err1, res1)
                          {
                            if (err1){
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;

                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err1){console.log(err2);}
                              });
                            }
                          });
                        } 
                        else{ 
                          console.log(response);
                          //make query to add to the notification creator

                          db_client.query("insert into notification_target(notification_id, target_type, target_class, target_section) select $1, $2, a.class, a.section from student_academic_enrollment_detail a where a.class=ANY($3);",
                            [res.rows[0].notification_id, noticeFor, classes_selected], function(err1, res1)
                          {
                            if (err1){
                              console.log(err1);
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;
                              login_data['data'] = "Success";
                              login_data['success'] = 1;
                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err2){
                                  console.log(err2);
                                }
                              });
                            }
                          });

                        } 
                      }
                    );
                  }
                  catch(err){
                    console.log(err);
                  }
                }
              }
            });
          }
          if (noticeFor=='Student' && all_class_selected == false && all_section_selected == false && singleStudent == true){
            db_client.query("select a.phone from student_login a where a.student_id=$1;"
              ,[student_id]
              ,function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                else{
                  phoneStr = "";
                  for (var i = 0; i < res1_.rows.length-1; i++){
                    phoneStr+=res1_.rows[i].phone+",";
                  }
                  phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                  var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};
                  try{
                    request(
                      {
                        url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                        method:"POST", 
                        json:true, 
                        body:myJSONObject
                      },
                      function(error,response,body)
                      {
                        if (error){
                          console.log(error);
                          //make query to delete the id may be
                          resp.send(login_data);
                          db_client.query("delete from notification_detail where notification_id=$1;",
                            [res.rows[0].notification_id], function(err1, res1)
                          {
                            if (err1){
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;

                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err1){console.log(err2);}
                              });
                            }
                          });
                        } 
                        else{ 
                          console.log(response);
                          //make query to add to the notification creator

                          db_client.query("insert into notification_target(notification_id, target_type, target_id) values($1, $2, $3);",
                            [res.rows[0].notification_id, noticeFor, student_id], function(err1, res1)
                          {
                            if (err1){
                              console.log(err1);
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;
                              login_data['data'] = "Success";
                              login_data['success'] = 1;
                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err2){
                                  console.log(err2);
                                }
                              });
                            }
                          });

                        } 
                      }
                    );
                  }
                  catch(err){
                    console.log(err);
                  }
                }
              }
            });
          }
          
          
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
      //first try to sms everyone.

      //then insert to database.
      db_client.query("INSERT INTO notification_detail(notification_creator, creator_id, subject, message, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING notification_id;",
        [loginType, userID, subject, message], function(err, res)
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
          if (noticeFor=='Student' && all_class_selected == false && all_section_selected == false && singleStudent == false){
            db_client.query("select a.phone from student_login a join student_academic_enrollment_detail b on a.student_id=b.student_id where b.class=ANY($1) and b.section=ANY($2);"
              ,[classes_selected, sections_selected]
              ,function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                else{
                  phoneStr = "";
                  for (var i = 0; i < res1_.rows.length-1; i++){
                    phoneStr+=res1_.rows[i].phone+",";
                  }
                  phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                  var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};

                  try{
                    request(
                      {
                        url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                        method:"POST", 
                        json:true, 
                        body:myJSONObject
                      },
                      function(error,response,body)
                      {
                        if (error){
                          console.log(error);
                          //make query to delete the id may be
                          resp.send(login_data);
                          db_client.query("delete from notification_detail where notification_id=$1;",
                            [res.rows[0].notification_id], function(err1, res1)
                          {
                            if (err1){
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;

                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err1){console.log(err2);}
                              });
                            }
                          });
                        } 
                        else{ 
                          console.log(response);
                          //make query to add to the notification creator

                          db_client.query("insert into notification_target(notification_id, target_type, target_class, target_section) select $1, $2, a.class, a.section from student_academic_enrollment_detail a where a.class=ANY($3);",
                            [res.rows[0].notification_id, noticeFor, classes_selected], function(err1, res1)
                          {
                            if (err1){
                              console.log(err1);
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;
                              login_data['data'] = "Success";
                              login_data['success'] = 1;
                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err2){
                                  console.log(err2);
                                }
                              });
                            }
                          });

                        } 
                      }
                    );
                  }
                  catch(err){
                    console.log(err);
                  }
                }
              }
            });
          }
          if (noticeFor=='Student' && all_class_selected == false && all_section_selected == false && singleStudent == true){
            db_client.query("select a.phone from student_login a where a.student_id=$1;"
              ,[student_id]
              ,function(err1_, res1_)
            {
              if (err1_){
                db_client.end(function(err2_){

                  if (err2_){console.log(err2_);}
                });
              }
              else{
                //select all numbers into a array
                if (res1_.rows.length == 0){
                  resp.send(login_data);

                  db_client.end(function(err2){

                    if (err2){console.log(err2);}
                  });
                }
                else{
                  phoneStr = "";
                  for (var i = 0; i < res1_.rows.length-1; i++){
                    phoneStr+=res1_.rows[i].phone+",";
                  }
                  phoneStr+=res1_.rows[res1_.rows.length-1].phone;
                  var myJSONObject = {"From":"SANKLP", "VAR1":message, "To":phoneStr , "TemplateName":"Basic"};

                  try{
                    request(
                      {
                        url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", 
                        method:"POST", 
                        json:true, 
                        body:myJSONObject
                      },
                      function(error,response,body)
                      {
                        if (error){
                          console.log(error);
                          //make query to delete the id may be
                          resp.send(login_data);
                          db_client.query("delete from notification_detail where notification_id=$1;",
                            [res.rows[0].notification_id], function(err1, res1)
                          {
                            if (err1){
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;

                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err1){console.log(err2);}
                              });
                            }
                          });
                        } 
                        else{ 
                          console.log(response);
                          //make query to add to the notification creator

                          db_client.query("insert into notification_target(notification_id, target_type, target_id) values($1, $2, $3);",
                            [res.rows[0].notification_id, noticeFor, student_id], function(err1, res1)
                          {
                            if (err1){
                              console.log(err1);
                              db_client.end(function(err2){

                                if (err2){console.log(err2);}
                              });
                            }
                            else{
                              console.log(res.rows.length);
                              //login_data['token'] = got_id;
                              login_data['data'] = "Success";
                              login_data['success'] = 1;
                              resp.send(login_data);

                              db_client.end(function(err2){

                                if (err2){
                                  console.log(err2);
                                }
                              });
                            }
                          });

                        } 
                      }
                    );
                  }
                  catch (err)
                  {
                    console.log(err);
                  }
                }
              }
            });
          }
          
        }
      });
    });
  }
  else if (loginType == 'Student'){

  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;