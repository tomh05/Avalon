import http from 'http';
import express from 'express';
import cors from "cors";
import { Server } from 'colyseus';
import { Avalon } from "./rooms/avalon"

const app = express();
const port = Number(process.env.PORT || 3553);

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server: server,
  express: app
});

gameServer.define('avalon', Avalon);
gameServer.listen(port);

app.use(express.static(__dirname + "/../frontend/public"));
console.log(`Listening on ws://localhost:${ port }`);
