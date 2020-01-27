# tic-tac-toe multiplayer (Colyseus v0.12.x)

Turn-based demonstration project using Colyseus Game Server (v0.12.x)

- [JavaScript/PixiJS](#javascript--pixijs)
- [Defold Engine](#defold-engine)

If you want to see more examples like this and help Colyseus to grow, consider supporting my work on Patreon.

<a href="https://www.patreon.com/bePatron?u=3301115"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" /></a>

# Running the server locally

You'll need two terminal windows open to be able to run this. One for the
client, and one for the server:

**Running the server**

```
cd server
npm install
npm start
```

**Important files to have look at**

- [registering room](server/index.ts#L19)
- [room and state implementation](server/rooms/tictactoe.ts)

## JavaScript / PixiJS

The JavaScript/PixiJS example uses:

- [webpack 4.x](http://npmjs.com/package/webpack)
- [colyseus 0.12.x](http://colyseus.io)
- [pixi.js v4](http://npmjs.com/package/pixi.js)

**Running the JavaScript/PixiJS client**

```
cd javascript-pixi
npm install
npm start
```

**Important files to have look at**

- [room connection](frontend/src/screens/GameScreen.js#L36)
- [receiving state updates](frontend/src/screens/GameScreen.js#L39-L69)

## Defold Engine

The Defold project was made by [Selim Anaç](https://github.com/selimanac/).

Remember to Fetch Libraries on Defold (Project > Fetch Libraries)

## License

MIT
