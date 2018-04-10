# tic-tac-toe multiplayer (Colyseus v0.9.x)

Turn-based demonstration project using Colyseus Game Server (v0.9.x)

Consider backing Colyseus' development and support on Patreon. It takes time
to keep demos and examples like this up-to-date.

<a href="https://www.patreon.com/bePatron?u=3301115"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" /></a>

**Important files to look at**:

- Server-side
  - [registering room](server/index.js#L13)
  - [room implementation](server/rooms/tictactoe.js)

- Client-side
  - [room connection](frontend/src/screens/GameScreen.js#L13-L14)
  - [patch handling](frontend/src/screens/GameScreen.js#L96-L122)

## License

MIT
