import * as PIXI from 'pixi.js'
import TextInput from 'pixi-text-input'

import Application from '../Application'
import TitleScreen from './TitleScreen'
import EndGameScreen from './EndGameScreen'

import Board from '../components/Board'
import Lobby from '../components/Lobby'
import RoleExplainer from '../components/RoleExplainer'

export default class GameScreen extends PIXI.Container {

    constructor () {
        super()

        let text = (colyseus.readyState === WebSocket.CLOSED)
            ? "Couldn't connect."
            : "Waiting for enough players..."

        this.waitingText = new PIXI.Text(text, {
            font: "40px Pirata One",
            fill: '#000',
            textAlign: 'center'
        })
        this.waitingText.pivot.x = this.waitingText.width / 2
        this.waitingText.pivot.y = this.waitingText.height / 2
        this.addChild(this.waitingText)


        this.lobby = new Lobby();
        this.lobby.pivot.x = this.lobby.width / 2
        this.lobby.pivot.y = this.lobby.height / 2
        this.lobby.on('nameChanged', this.onNameChanged.bind(this))
        this.lobby.on('ready', this.onReadyClick.bind(this))
        this.addChild(this.lobby)

        console.log("waitingText",this.waitingText)

        this.on('dispose', this.onDispose.bind(this))
        this.connect()
        this.onResize()
    }

    async connect () {
        this.room = await colyseus.joinOrCreate('avalon')

        let numPlayers = 0;
        this.room.state.players.onAdd = () => {
            numPlayers++;

            if (numPlayers >= 2) {
                this.waitingText.text = "Waiting for all players to be ready";
            }
        }

        /*
    this.room.state.board.onChange = (value, index) => {
        const x = index % 3;
        const y = Math.floor(index / 3);
        //this.board.set(x, y, value);
    }
    */

        this.room.state.onChange = (changes) => {
            console.log('changes',changes);
            changes.forEach(change => {

                if (change.field === "players") {
                    this.lobby.updatePlayers(change.value);
                }

                if (change.field === "gamePhase") {
                    // go to next turn after a little delay, to ensure "onJoin" gets called before this.
                    this.handlePhaseChange(change.value, change.previousValue);

                } else if (change.field === "currentKing") {
                    //this.drawGame();

                } else if (change.field === "winner") {
                    this.showWinner(change.value);

                }
            });
        }

        this.room.onError.once(() => this.emit('goto', TitleScreen));

    }

    handlePhaseChange(newPhase, oldPhase) {
        console.log(`Handling phase change from ${oldPhase} to ${newPhase}`)
        if (newPhase == "EXPLAINING_ROLES") {

            this.removeChild(this.lobby)

            //setTimeout(() => this.nextTurn(change.value), 10)
            this.clientRole = this.room.state.players[this.room.sessionId].role;
            this.clientAllegiance = this.room.state.players[this.room.sessionId].allegiance;

            this.roleExplainer = new RoleExplainer(this.clientRole, this.clientAllegiance);
            this.roleExplainer.pivot.x = this.roleExplainer.width / 2
            this.roleExplainer.pivot.y = this.roleExplainer.height / 2
            this.roleExplainer.x = Application.WIDTH / 2
            this.roleExplainer.y = Application.HEIGHT / 2
            this.roleExplainer.on('ready', this.onReadyClick.bind(this))
            this.addChild(this.roleExplainer);
            console.log("my role is", this.clientRole);
            console.log("my allegiance is", this.clientAllegiance);
        }
        else if (newPhase == "CHOOSING_KNIGHTS") {

            if (oldPhase == "EXPLAINING_ROLES") {
                this.removeChild(this.roleExplainer)
                this.board = new Board(this.room.state.players, this.room.state.playerOrder, this.room.sessionId );
                this.board.pivot.x = this.board.width / 2
                this.board.pivot.y = this.board.height / 2
                console.log('width', this.board.pivot.x);
                console.log('pivot y', this.board.pivot.y);
                this.board.x = Application.WIDTH / 2
                this.board.y = Application.HEIGHT / 2
                this.board.setKing(this.room.state.currentKing);
                //this.board.on('nameChanged', this.onNameChanged.bind(this))
                //this.board.on('ready', this.onReadyClick.bind(this))
                this.addChild(this.board)

            }

        }
    }

    onReadyClick(ready) {
        console.log('sending ready',ready);
        this.room.send({ready: ready});
    }

    transitionIn () {
        tweener.add(this.waitingText).from({ alpha: 0 }, 300, Tweener.ease.quintOut)
        return tweener.add(this.waitingText.scale).from({x: 1.5, y: 1.5}, 300, Tweener.ease.quintOut)
    }

    transitionOut () {
        if (this.timeIcon) {
            tweener.add(this.timeIcon).to({y: this.timeIcon.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
            tweener.add(this.clientRole).to({y: this.clientRole.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
            //tweener.add(this.board).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
            return tweener.add(this.statusText).to({ y: this.statusText.y + 10, alpha: 0 }, 300, Tweener.ease.quintOut)

        } else {
            return tweener.add(this.waitingText).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
        }
    }

    onNameChanged(name) {
        this.room.send({name: name})
    }

    nextTurn (playerId) {
        tweener.add(this.statusText).to({
            y: Application.HEIGHT - Application.MARGIN + 10,
            alpha: 0
        }, 200, Tweener.ease.quintOut).then(() => {

            if (playerId == this.room.sessionId) {
                this.statusText.text = "Your move!"

            } else {
                this.statusText.text = "Opponent's turn..."
            }

            this.statusText.x = Application.WIDTH / 2 - this.statusText.width / 2

            tweener.add(this.statusText).to({
                y: Application.HEIGHT - Application.MARGIN,
                alpha: 1
            }, 200, Tweener.ease.quintOut)

        })

    }

    drawGame () {
        this.room.leave()
        this.emit('goto', EndGameScreen, { draw: true })
    }

    showWinner (clientId) {
        this.room.leave()
        this.emit('goto', EndGameScreen, {
            won: (this.room.sessionId == clientId)
        })
    }

    onResize () {
        this.waitingText.x = Application.WIDTH / 2
        this.waitingText.y = Application.HEIGHT / 6

        if (this.lobby) {
        this.lobby.x = Application.WIDTH / 2
        this.lobby.y = Application.HEIGHT / 2
        }

        if (this.roleExplainer) {
        this.roleExplainer.x = Application.WIDTH / 2
        this.roleExplainer.y = Application.HEIGHT / 2
        }

        if (this.board) {
        this.board.x = Application.WIDTH / 2
        this.board.y = Application.HEIGHT / 2
        }
    }

    onDispose () {
    }
}
