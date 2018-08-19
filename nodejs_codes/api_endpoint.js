//imports
var http = require('http');
var SHA224 = require('sha224');
var multer = require('multer');
var express = require('express');
var app = express();
var loginRouter = require('./login.route');
var fetchAllSubjectsRouter = require('./fetchAllSubjects.route');
var addSubjectRouter = require('./addSubject.route');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/fetchAllSubjects', fetchAllSubjectsRouter);
app.use('/addSubjects', addSubjectRouter);

const server = http.createServer(app);
server.listen(8000, ()=>{
  console.log('Server started!');
});

module.exports=app;