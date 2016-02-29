"use strict";

var colyseus = require('colyseus')
  , http = require('http')

  , express = require('express')
  , app = express()
  , port = process.env.PORT || 3553

  , server = http.createServer(app)
  , gameServer = new colyseus.Server({server: server})

gameServer.register('tictactoe', require('./rooms/tictactoe'))
server.listen(port);

app.use(express.static(__dirname + "/../frontend/public"))

console.log(`Listening on ws://localhost:${ port }`)
