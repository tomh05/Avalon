# tic-tac-toe multiplayer (Colyseus v0.9.x)

Turn-based demonstration project using Colyseus Game Server (v0.9.x)

Consider backing Colyseus development and its support on Patreon. I'll start
making guided video tutorials once I reach a considerable amount of donations.

<a href="https://www.patreon.com/bePatron?u=3301115"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" /></a>

## Tooling

- [webpack 4.x](http://npmjs.com/package/webpack)
- [colyseus 0.9.x](http://colyseus.io)
- [pixi.js v4](http://npmjs.com/package/pixi.js)

## Running it locally

You'll need two terminal windows open to be able to run this. One for the
client, and one for the server:

**Running the client**

```
cd client
npm install
npm start
```

**Running the server**

```
cd server
npm install
npm start
```

## Important files to have look at

- Server-side
  - [registering room](server/index.js#L11)
  - [room implementation](server/rooms/tictactoe.js)

- Client-side
  - [room connection](frontend/src/screens/GameScreen.js#L34)
  - [patch handling](frontend/src/screens/GameScreen.js#L38-L69)

## License

MIT
