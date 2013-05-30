var net = require('net');
var http = require('http')

// the machine to scan
var host = '10.14.93.139';
// starting from port number
var start = 9999;
// to port number
var end = 10000;


var s2 = http.createServer(function(req, res){
}).listen(9999, host)

s2.on('error', function(e) {
    console.info(e.code)
})
