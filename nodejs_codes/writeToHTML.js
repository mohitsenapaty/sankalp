var fs = require('fs');
var createStream = fs.createWriteStream("/Users/msenapaty/Documents/react_native_ios/sankalp/test.html");
createStream.end();
var async = require('async');
var examname = 'Unit Test';
var roll_number = '10';
var fullname = 'Aaaa BBBBaaa';
var class_ = '3';
var section = 'A';
var session = '2018-2019';

var subjects = ['HINDI', 'ENGLISH', 'MATHEMATICS', 'SCIENCE', 'SOCIAL STUDIES'];
var grades = ['A', 'A+', 'B+', 'B', 'C'];

var tableRowString = ``;

for (var i = 0; i < subjects.length; i++){
  var rowString = `<tr><td>${subjects[i]}</td><td>${grades[i]}</td></tr>`;
  tableRowString+=rowString;
}

var writeString = `

<html>
    <head>
        <style>
        .header {
            position: relative;
            height:10%;
        }

        .topright {
            position: absolute;
            top: 8px;
            right: 16px;
            font-size: 14px;
        }

        .topleft {
            position: absolute;
            top: 1%;
            left: 2%;
            font-size: 12px;
        }
        
        .leftImg {
            position: absolute;
            top: 40%;
            left: 2%;
            font-size: 12px;
        }
        
        .schoolName {
            position: absolute;
            top: 40%;
            left: 15%;
            font-size: 16px;
        }
        
        .studentName {
            position: absolute;
            top: 40%;
            right: 1%;
            font-size: 12px;
        }

        .topcenter {
            position: absolute;
            top: 1%;
            left: 35%;
            font-size: 16px;
        }
        
        .container {
            position: relative;
            height:70%;
        }
        #rcorners2 {
            position:absolute;
            border-radius: 25px;
            border: 2px solid #555555;
            width: 96%;
            height: 60%; 
            top: 30%;
            left: 2%;
            font-size:16px;
        }
        #rcorners3 {
            position:absolute;
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;
            border: 2px solid #555555;
            width: 96%;
            height: 7%; 
            top: 30%;
            left: 2%;
            font-size:16px;
        }
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
        th {
          height:20px;
        }
        th, td {
            padding: 5px;
        }
        </style>
    </head>
    <body>
        <div class="header" >
            <div class="topleft">
                Year: 2018-2019
            </div>
            <div class="topcenter">Test Report Card - ${examname}</div>
            <div class="leftImg">Logo</div>
            <div class="schoolName">Kaanger Valley Academy</div>
            <div class="studentName">
            AAAAA ZZZZZZZZ </br>
            Class: 3c
            </div>
        </div>
        <hr align="center" noshade="false" width="100%">
        <div class="container">
            <div style="position:absolute;top:1%;left:2%;font-size:16px;">
                Student Information
            </div>
            <hr align="center" noshade="false" width="96%" style="position:relative;top:6%">
            <div style="position:absolute;top:8%;left:2%;font-size:16px;">
              Roll Number: 10 &emsp; Date of Birth: 10-10-2010 &emsp; Admission Number: 1
              </br>
              Father's Name: aAAAA BbBbC &emsp; Mother's Name: xcxca Asamsa
              </br>
              Teacher's Name: bckjsackvbkd bdsakj
              </br>
            </div>
            <div id="rcorners3">
                <div style="position:absolute; left:5%; top:20%;">
                Student Information
                </div>
            </div>
            <div id="rcorners2">
                <div style="position:absolute; left:1%; top:15%;">
                <table style="width:100%">
                    <tr style="width:100%">
                      <th style="width:100%"></th>
                      <th>Unit Test</th>
                    </tr>
                    <tr style="width:100%">
                      <th style="width:100%">Subject</th>
                      <th>Grade</th>
                    </tr>
                    ${tableRowString}
                </table>
                </div>
            </div>
        </div>
    </body>
<html>

`;

writeToHtml = (cb) =>{
	var writeStream = fs.createWriteStream("/Users/msenapaty/Documents/react_native_ios/sankalp/test.html");
	writeStream.write(writeString);
	writeStream.end();
  console.log('1');
  return cb(null);
}

writeToPDF = (cb) =>{
	var pdf = require('html-pdf');
	var html = fs.readFileSync('/Users/msenapaty/Documents/react_native_ios/sankalp/test.html', 'utf8');
	var options = { format: 'A4' };

	pdf.create(html, options).toFile('/Users/msenapaty/Documents/react_native_ios/sankalp/test.pdf', function(err, res) {
	  if (err) return console.log(err);
	  console.log(res); // { filename: '/app/businesscard.pdf' }
    return cb(null, "2");
	});
  //return 3;

}
var tasks = [
  function a(){
    var writeStream = fs.createWriteStream("/Users/msenapaty/Documents/react_native_ios/sankalp/test.html");
  writeStream.write(writeString);
  writeStream.end();
  console.log('1');
  },
  function b(){
    var pdf = require('html-pdf');
  var html = fs.readFileSync('/Users/msenapaty/Documents/react_native_ios/sankalp/test.html', 'utf8');
  var options = { format: 'A4' };

  pdf.create(html, options).toFile('/Users/msenapaty/Documents/react_native_ios/sankalp/test.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });
  }
];
async.waterfall([writeToHtml, writeToPDF], (err, result)=>{
  if (err){console.log(err);}
  else{
    console.log("success");
  }
});