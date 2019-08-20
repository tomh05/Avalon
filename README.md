# tic-tac-toe multiplayer (Colyseus v0.11.x)

Turn-based demonstration project using Colyseus Game Server (v0.11.x)

If you want to see more examples like this and help Colyseus to grow, consider supporting my work on Patreon.

<a href="https://www.patreon.com/bePatron?u=3301115"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" /></a>

## Tooling

- [webpack 4.x](http://npmjs.com/package/webpack)
- [colyseus 0.11.x](http://colyseus.io)
- [pixi.js v4](http://npmjs.com/package/pixi.js)

## Running it locally

You'll need two terminal windows open to be able to run this. One for the
client, and one for the server:

**Running the client**

```
cd frontend
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
  - [registering room](server/index.ts#L19)
  - [room and state implementation](server/rooms/tictactoe.ts)

- Client-side
  - [room connection](frontend/src/screens/GameScreen.js#L36)
  - [receiving state updates](frontend/src/screens/GameScreen.js#L39-L69)

## License

MIT
