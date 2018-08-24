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
var assignSubjectToTeacherRouter = require('./assignSubjectToTeacher.route');
var fetchSubjectsAssignedToTeacherRouter = require('./fetchSubjectsAssignedToTeacher.route');
var deleteSubjectAssignedToTeacherRouter = require('./deleteSubjectAssignedToTeacher.route');
var assignSubjectToStudentRouter = require('./assignSubjectToStudent.route');
var fetchSubjectsAssignedToStudentRouter = require('./fetchSubjectsAssignedToStudent.route');
var deleteSubjectAssignedToStudentRouter = require('./deleteSubjectAssignedToStudent.route');
var assignSubjectToClassRouter = require('./assignSubjectToClass.route');
var fetchClassSubjectsRouter = require('./fetchClassSubjects.route');
var deleteSubjectAssignedToClassRouter = require('./deleteSubjectAssignedToClass.route');

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
app.use('/assignSubjectToTeacher', assignSubjectToTeacherRouter);
app.use('/fetchSubjectsAssignedToTeacher', fetchSubjectsAssignedToTeacherRouter);
app.use('/deleteSubjectAssignedToTeacher', deleteSubjectAssignedToTeacherRouter);
app.use('/assignSubjectToStudent', assignSubjectToStudentRouter);
app.use('/fetchSubjectsAssignedToStudent', fetchSubjectsAssignedToStudentRouter);
app.use('/deleteSubjectAssignedToStudent', deleteSubjectAssignedToStudentRouter);
app.use('/assignSubjectToClass', assignSubjectToClassRouter);
app.use('/fetchClassSubjects', fetchClassSubjectsRouter);
app.use('/deleteSubjectAssignedToClass', deleteSubjectAssignedToClassRouter);

const server = http.createServer(app);
server.listen(8000, ()=>{
  console.log('Server started!');
});

module.exports=app;