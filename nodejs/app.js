var http = require('http');
var fs = require('fs');
var SerialPort = require('serialport').SerialPort;
var serialPort;
var portName = 'COM5'; //change this to your Arduino port
var sendData = "";
var receivedData = "";
	
// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./interface.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

    serialPort = new SerialPort(portName, {
        baudrate: 115200,
        // defaults for Arduino serial communication
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
    });
 
    serialPort.on("open", function () {
      console.log('open serial communication');
            // Listens to incoming data
         
    });
	
io.sockets.on('connection', function (socket, pseudo) {
    // Quand on client se connecte, on lui envoie un message
    socket.emit('bienvenue', 'Vous êtes bien connecté !');
    // On signale aux autres clients qu'il y a un nouveau venu
    socket.broadcast.emit('message', 'Un autre client vient de se connecter ! ');

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.username = pseudo;
	  console.log('salut ' + socket.username);
    });
	
	serialPort.on('data', function(data) {
             receivedData += data.toString();
          if (receivedData .indexOf('E') >= 0 && receivedData .indexOf('B') >= 0) {
           sendData = receivedData .substring(receivedData .indexOf('B') + 1, receivedData .indexOf('E'));
           receivedData = '';
         }
         // send the incoming data to browser with websockets.
       socket.emit('update', sendData );
	   
	  //console.log(sendData);
      }); 
    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('message', function (message) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
       // socket.get('pseudo', function (error, pseudo) {
            console.log(socket.username + ' me parle ! Il me dit : ' + message);
       // });
    }); 
	
	socket.on('buttonval', function(data) {
		serialPort.write(data + 'E');
	});
	socket.on('sliderval', function(data) {
		serialPort.write(data + 'P');
	});
});


server.listen(3000);