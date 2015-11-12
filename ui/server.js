var express = require('express')
var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.usbmodemfa131", {
  baudrate: 9600
});

var app = express()

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/drinks.json', express.static(__dirname + '/drinks.json'));

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/doit/*', function (request, response) {
  // the route is the first parameter of the URL request:
  var command = request.params[0];
  // send it out the serial port:
  console.log('command = ' , command);
  serialPort.write(command);
  // send an HTTP header to the client:
  response.writeHead(200, {'Content-Type': 'text/html'});
  // send the data and close the connection:
  response.end(command);
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
