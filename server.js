"use strict";

let http = require('http');
let fs = require('fs');

const PORT = 8080; 

// Check if client html file exists
fs.readFile('client/echo.html', function (err, html) {
  if (err) throw err;

  var httpServer = http.createServer(function(request, response) {
    // This code will run on every connecting client via HTTP

    console.log(`${(new Date())} Client HTTP request: [${request.url}]`);

    // Basic router
    if (request.url == '/' || request.url == '/index.html') {
      response.writeHeader(200, {"Content-Type": "text/html"}); 
      response.write(html);
      response.end();
    } else {
      response.writeHeader(404);
      response.end();
    }
  }).listen(PORT, function () {
    // We've started listening on HTTP
    console.log(`${(new Date())} Server is listening on port ${PORT}`);

    // Create WebSocket server
    let WebSocketServer = require('websocket').server;
    let wsServer = new WebSocketServer({
      httpServer: httpServer
    });

    wsServer.on('request', function(request) {
      // This code will run on every new WebSocket connection

      // This line will crash the server if the client requests something
      // other than 'echo-protocol'
      let connection = request.accept('echo-protocol', request.origin);
      console.log(`${(new Date())} WebSocket connection accepted [${connection.remoteAddress}]`);

      connection.on('message', function(message) {
        // Sends the message back to the client
        connection.sendUTF(message.utf8Data);
        console.log(`${(new Date())} Message received from [${connection.remoteAddress}]: ${message.utf8Data}`);
      });

      connection.on('close', function(reasonCode, description) {
        console.log(`${(new Date())} Peer ${connection.remoteAddress} disconnected.`);
      });
    });
  });
});
