tic-tac-toe
===

Simple Tic-Tac-Toe game powered by Colyseus Game Server.

**Important files to look at**:

- Server-side
  - [registering room](server/index.js#L13)
  - [room implementation](server/rooms/tictactoe.js)
- Client-side
  - [room connection](frontend/src/screens/GameScreen.js#L13-L14)
  - [patch handling](frontend/src/screens/GameScreen.js#L96-L122)
