var SerialPort = require('serialport').SerialPort
var http = require('http');
var sp = new SerialPort("COM3", {baudrate: 9600});
var server = http.createServer(function(req,ser){
console.log('server online');
ser.writeHead(200, {"Content-Type": "text/plain"});

var receiveData = "";

sp.on("open", function () {
  console.log('open');
  ser.write('Arduino connected' + 'at port');
  });
  sp.on('data', function(res) {
	receiveData += res.toString();
   // console.log('data received: ' + res);
	ser.write('<p> data = ' + res + '</p>');
  });
  /*
  if(receiveData = 'ready'){
  sp.write("H\r", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  })}*/
  
  ser.end();
  });
  server.listen(1254);