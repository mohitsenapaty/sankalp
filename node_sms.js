

var request = require('request');

var myJSONObject = {"From":"SANKLP", "TemplateName":"Basic", "VAR1":"Transactional SMS Service Test", "To":"8884901207,7024138118"};
//var myJSONObject = {"From":"SANKLP", "Msg":"Transactional SMS Service Test", "To":"8884901207,7024138118"};

request({url:"http://2factor.in/API/V1/41398bea-aaf7-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS", method:"POST", json:true, body:myJSONObject},function(error,response,body){if (error){console.log(error);} else{ console.log(response) } });
