var express = require('express');
var SHA224 = require('sha224');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/sankalp";
var crypto = require('crypto');

htmlString=`

<html>
  <body>
    <h1>Welcome to dharna</h1>
    <p>
      Hello World.
    </p>
  </body>
</html>

`;

router.get('/', function(req, resp, next){
  //resp.send(htmlString);
  resp.writeHead(301, {"Location":"http://localhost:8000/index/"});
  return resp.end();
});

module.exports=router;
