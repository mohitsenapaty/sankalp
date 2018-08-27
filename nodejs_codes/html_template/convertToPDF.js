var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./nodejs_codes/html_template/report.html', 'utf8');
var options = { format: 'A4' };
 
pdf.create(html, options).toFile('/Users/msenapaty/Documents/react_native_ios/sankalp/report.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});
