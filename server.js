"use strict";

let http = require('http');
let fs = require('fs');

// let server = http.createServer(function(request, response) {});

const PORT=8080; 

// Phil's changes
// fs.readFile('client/index.html', function (err, html) {
// if (err) throw err; 
var server = http.createServer(function(request, response) { 
  response.writeHeader(200, {"Content-Type": "text/html"}); 
  // response.write(html);
  response.write(console.dir(request.url));
  response.end();
}).listen(PORT, function () {
  console.log(`${(new Date())} Server is listening on port ${PORT}`);
});
// });

let WebSocketServer = require('websocket').server;

let wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function(r){
  // runs on connection
  let connection = r.accept('echo-protocol', r.origin);
  let count = 0;
  let clients = {};
  // Specific id for this client & increment count
  let id = count++;
  // Stores the connection method for looping through & contacting all clients
  clients[id] = connection;

  console.log(`${(new Date())} Connection accepted [${id}]`);
  connection.on('message', function(message) {

    // The string message sent to us
    let msgString = message.utf8Data;

    // Loops through all clients
    for(let i in clients){
      // Sends a message to the client with the message
      clients[i].sendUTF(msgString);
    }
  });
  connection.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log(`${(new Date())} Peer ${connection.remoteAddress} disconnected.`);
  });
});
