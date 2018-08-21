//imports
var http = require('http');
var SHA224 = require('sha224');
var multer = require('multer');
var express = require('express');
var app = express();
var loginRouter = require('./login.route');
var fetchAllSubjectsRouter = require('./fetchAllSubjects.route');
var addSubjectRouter = require('./addSubject.route');
var deleteSubjectRouter = require('./deleteSubject.route');
var fetchAllTeachersRouter = require('./fetchAllTeachers.route');
var addTeacherRouter = require('./addTeacher.route');
var deleteTeacherRouter = require('./deleteTeacher.route');
var fetchAllStudentsRouter = require('./fetchAllStudents.route');
var addStudentRouter = require('./addStudent.route');
var deleteStudentRouter = require('./deleteStudent.route');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/fetchAllSubjects', fetchAllSubjectsRouter);
app.use('/addSubjects', addSubjectRouter);
app.use('/deleteSubjects', deleteSubjectRouter);
app.use('/fetchAllTeachers', fetchAllTeachersRouter);
app.use('/addTeachers', addTeacherRouter);
app.use('/deleteTeachers', deleteTeacherRouter);
app.use('/fetchAllStudents', fetchAllStudentsRouter);
app.use('/addStudents', addStudentRouter);
app.use('/deleteStudents', deleteStudentRouter);


const server = http.createServer(app);
server.listen(8000, ()=>{
  console.log('Server started!');
});

module.exports=app;