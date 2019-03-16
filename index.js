const moment = require('moment');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


let clientList = [];

let chathist = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  console.log(moment().format("h:mm:ss a") +': a user connected');
  clientList.push({id : socket.id, nickname: Math.random() * 800});
  socket.emit('util message', {nickname: clientList[clientList.length - 1].nickname});
  chathist.forEach(function(histmsg){
    socket.emit('chat message',{ time: histmsg.time, message: histmsg.message})
  }); 
  io.emit('chat message', {message:{ nickname: '' , message:  clientList[clientList.length - 1].nickname + " has connected!"}})

  clientList.forEach(function (element){
    console.log(element.nickname + "  " + element.id);
  });

  socket.on('chat message', function(msg){
    chathist.push({time: moment(), message: msg});
    if (chathist.length > 250){
      chathist.shift();
    }
    io.emit( 'chat message', {time: moment(), message: msg});
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});