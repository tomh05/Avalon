var Room = require('colyseus').Room

class TicTacToe extends Room {

  constructor (options) {
    // call 'update' method each 50ms
    super(options, 1000 / 20)

    this.setState({
      currentTurn: 0,
      board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    })
  }

  requestJoin(options) {
    // only 2 players are allowed to play
    return this.clients.length < 2;
  }

  onJoin (client) {
    this.state.messages.push(`${ client.id } joined. Say hello!`)
  }

  onMessage (client, data) {
    this.state.messages.push(`${ client.id }: ${ data }`)
  }

  onLeave (client) {
    this.state.messages.push(`${ client.id } leaved.`)
  }
}

module.exports = TicTacToe
