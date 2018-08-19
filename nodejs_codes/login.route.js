var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/sankalp";
var crypto = require('crypto');

router.post('/', function(req, resp, next){

	console.log(req.body);
  //console.log(next);

  var username = req.body.username;
  var password = req.body.password;
  var loginType = req.body.loginType;
  
  var login_data = {'success':0,'data':{},'token':''};
  //console.log(SHA224(password, "utf8").toString('hex'));
  enc_pwd = SHA224(password, "utf8").toString('hex');

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
            var api_key = crypto.createCipher('aes-128-cbc', 'shatabdi');
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

  }
  else if (loginType == 'Student'){

  }
  else{
    resp.send(login_data);
  }

});

module.exports = router;