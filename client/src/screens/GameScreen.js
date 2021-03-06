import * as PIXI from 'pixi.js'

import Application from '../Application'
import TitleScreen from './TitleScreen'
import EndGameScreen from './EndGameScreen'

import Board from '../components/Board'
import VotingBox from '../components/VotingBox'
import QuestingBox from '../components/QuestingBox'
import QuestResultsBox from '../components/QuestResultsBox'
import Lobby from '../components/Lobby'
import RoleExplainer from '../components/RoleExplainer'
import Button from '../components/Button'

export default class GameScreen extends PIXI.Container {

    constructor () {
        super()

        /*
            this.questResultsBox = new QuestResultsBox(["SUCCESS", "FAIL", "SUCCESS", "FAIL", "a", "b"]);
            this.questResultsBox.x = Application.WIDTH / 2
            this.questResultsBox.pivot.x = this.questResultsBox.width/2
            this.questResultsBox.y =  120
            this.addChild(this.questResultsBox)
            */



        let text = (colyseus.readyState === WebSocket.CLOSED)
            ? "Couldn't connect."
            : "Waiting for enough players..."

        this.explainerText = new PIXI.Text(text, {
        fontFamily: "Pirata One",
        fontSize: 40,
            fill: '#300',
            textAlign: 'center'
        })
        this.explainerText.anchor.set(0.5,0.5)
        this.centerObject(this.explainerText)
        this.explainerText.y = 560
        this.addChild(this.explainerText)

        this.lobby = new Lobby();
        this.lobby.pivot.x = this.lobby.width / 2
        this.lobby.y = 50
        this.centerObject(this.lobby)
        this.lobby.on('nameChanged', this.onNameChanged.bind(this))
        this.lobby.on('ready', this.onReadyClick.bind(this))
        this.addChild(this.lobby)


        this.on('dispose', this.onDispose.bind(this))
        this.connect()
        this.onResize()
    }

    async connect () {
        try {
        this.room = await colyseus.joinOrCreate('avalon')
        } catch (e) {
            console.log('going to title',e)
            this.emit('goto', TitleScreen);
            return;
        }

        let numPlayers = 0;
        this.room.state.players.onAdd = () => {
            numPlayers++;

            if (numPlayers >= 2) {
                this.explainerText.text = "Waiting for all players to be ready";
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
                    if (this.lobby) {
                        this.lobby.updatePlayers(change.value);
                    }
                    if (this.board)  {
                        this.board.updatePlayers(change.value);
                    }
                }

                else if (change.field === "gamePhase") {
                    // go to next turn after a little delay, to ensure "onJoin" gets called before this.
                    this.handlePhaseChange(change.value, change.previousValue);

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

            this.setExplainerText("")
            this.removeObject(this.lobby)

            //setTimeout(() => this.nextTurn(change.value), 10)
            this.clientRole = this.room.state.players[this.room.sessionId].role;
            this.clientAllegiance = this.room.state.players[this.room.sessionId].allegiance;

            this.roleExplainer = new RoleExplainer(this.clientRole, this.clientAllegiance);
            this.roleExplainer.x = Application.WIDTH / 2
            this.roleExplainer.y = 100
            this.roleExplainer.on('ready', this.onReadyClick.bind(this))
            this.addChild(this.roleExplainer);
            console.log("my role is", this.clientRole);
            console.log("my allegiance is", this.clientAllegiance);
        }
        else if (newPhase == "CHOOSING_KNIGHTS") {

            this.removeObject(this.questResultsBox)
            this.removeObject(this.roleExplainer)
            this.removeObject(this.votingBox)
            if (oldPhase == "EXPLAINING_ROLES") {
                this.createBoard();
            }
            if (oldPhase == "REVEALING_VOTE") {
                this.board.clearVotes();
            }

            this.removeObject(this.proceedButton)

            this.board.setKing(this.room.state.currentKing);

            if (this.room.state.currentKing == this.room.sessionId) {

                this.setExplainerText(`You are King! Select ${this.room.state.quests[this.room.state.currentQuest].requiredParticipants} knights to go on the quest.`)
                this.createCallVoteButton();
            } else {
                this.setExplainerText(`King ${this.room.state.players[this.room.state.currentKing].name} is preparing the quest.`)
            }

        }

        else if (newPhase == "VOTING") {
            this.removeObject(this.callVoteButton)

            this.votingBox = new VotingBox();
            this.votingBox.x = Application.WIDTH / 2
            this.votingBox.y = 480
            this.votingBox.on('vote', this.onVote.bind(this))
            this.addChild(this.votingBox);

            this.setExplainerText(`Do you support the proposed quest?`)
        } else if (newPhase == "REVEALING_VOTE") {
            this.removeObject(this.votingBox)
            this.board.revealVotes(this.room.state.players);

            if (this.room.state.votePassed) {
                this.setExplainerText(`The vote passed! The quest goes ahead.`)
            } else {
                this.setExplainerText(`The king was overthrown! A new king will be chosen.`)
            }

            this.createProceedButton(this.room.state.votePassed ? "Start Quest" : "Next King")
            this.addChild(this.proceedButton)
        }
        else if (newPhase == "QUESTING") {

            this.removeObject(this.proceedButton)

            console.log("questing",this.room.state.players);
            this.board.clearVotes();
            const thisPlayer = this.room.state.players[this.room.sessionId]
            if (thisPlayer.isParticipant) {

                this.setExplainerText(`Choose your contribution to the quest.`)
                this.questingBox = new QuestingBox((thisPlayer.allegiance == "GOOD"));
                this.questingBox.x = Application.WIDTH / 2
                this.questingBox.y =  480
                this.questingBox.on('questContribution', this.onQuestContribution.bind(this))
                this.addChild(this.questingBox);
            } else {
                this.setExplainerText(`Waiting for those on the quest to determine its fate...`)
            }
        }
        else if (newPhase == "REVEALING_QUEST") {
            let currentQuest = this.room.state.quests[this.room.state.currentQuest];

            this.removeObject(this.questingBox)

            this.questResultsBox = new QuestResultsBox(currentQuest.shuffledOutcomeCards);
            this.questResultsBox.x = Application.WIDTH / 2
            this.questResultsBox.pivot.x = this.questResultsBox.width/2
            this.questResultsBox.y =  120
            this.addChild(this.questResultsBox)

            setTimeout(function(){  
                if (this.room.state.quests[this.room.state.currentQuest].outcome == "SUCCESS") {
                    this.setExplainerText(`The quest passed!`)
                } else {
                    this.setExplainerText(`The quest failed!`)
                }
                this.createProceedButton("Proceed")
                this.board.updateQuests(this.room.state.quests);
            }.bind(this), 6000);

                   }
        else if (newPhase == "ASSASSINATION_ATTEMPT") {
            this.removeObject(this.questResultsBox)
            if (this.clientRole == "ASSASSIN") {
                this.setExplainerText("Choose who to assassinate.")
                this.createAssassinateButton();
            } else {
                this.setExplainerText("Arthur has nearly won! The assassin will now attempt to kill Merlin.")
            }
            this.removeObject(this.proceedButton)
        }
        else if (newPhase == "GAME_END") {
            this.removeObject(this.questResultsBox)
            this.removeObject(this.assassinateButton)
            this.removeObject(this.proceedButton)
            this.board.revealRoles();
            if (this.room.state.gameWinner == "GOOD") {
                if (oldPhase == "ASSASSINATION_ATTEMPT") {
                this.setExplainerText("The assasination attempt failed! King Arthur is victorious!")
                } else {
                this.setExplainerText("King Arthur completed three quests, and is victorious!")
                }
            }
            if (this.room.state.gameWinner == "EVIL") {
                if (oldPhase == "ASSASSINATION_ATTEMPT") {
                this.setExplainerText("Merlin was assassinated! The Minions of Mordred are victorious!")
                } else {
                this.setExplainerText("The Minions of Mordred sabotaged three quests, and are victorious!")
                }
            }
            this.createProceedButton("New Game")
        }
    }

    createCallVoteButton() {
        this.callVoteButton = new Button("Call Vote", 0xffffff, 0x330000);
        this.callVoteButton.x = Application.WIDTH / 2
        this.callVoteButton.y = 480
        this.addChild(this.callVoteButton)
        this.callVoteButton.on('click', this.onCallVote.bind(this))

    }

    createProceedButton(text) {
        this.proceedButton = new Button(text, 0xffffff, 0x330000);
        this.proceedButton.x = Application.WIDTH / 2
        this.proceedButton.y = 480
        this.addChild(this.proceedButton)
        this.proceedButton.on('click', this.onProceed.bind(this))
    }

    createAssassinateButton() {
        this.assassinateButton = new Button("Assassinate", 0xffffff, 0x330000);
        this.assassinateButton.x = Application.WIDTH / 2
        this.assassinateButton.y = 480
        this.addChild(this.assassinateButton)
        this.assassinateButton.on('click', this.onAssassinate.bind(this))
    }

    onProceed() {
        if (this.room.state.gamePhase == "GAME_END") {
        this.emit('goto', GameScreen, { draw: true })
        } else {
        this.proceedButton.update("waiting for others...", 0xAAAAAA, 0x666666);
        this.onReadyClick(true)
        }
    }

    onCallVote() {
        this.room.send({callVote: true});
    }

    onAssassinate() {
        this.room.send({assassinate: true});
    }

    createBoard() {
        this.board = new Board(this.room.state, this.room.sessionId);
        console.log('width', this.board.pivot.x);
        console.log('pivot y', this.board.pivot.y);
        this.board.x = Application.WIDTH / 2
        this.board.y = 200
        //this.board.on('nameChanged', this.onNameChanged.bind(this))
        //this.board.on('ready', this.onReadyClick.bind(this))
        //
        this.board.on('playerSelected', this.onPlayerSelected.bind(this))
        this.addChild(this.board)
    }

    onReadyClick(ready) {
        console.log('sending ready',ready);
        this.room.send({ready: ready});
    }

    onPlayerSelected(participantId) {
        console.log('sending participant toggle',participantId);
        this.room.send({playerSelected: participantId});
    }

    onVote(vote) {
        console.log('sending vote',vote);
        this.room.send({vote: vote});
    }

    onQuestContribution(decision) {
        this.room.send({questContribution: decision});
    }



    transitionIn () {
        tweener.add(this.explainerText).from({ alpha: 0 }, 300, Tweener.ease.quintOut)
        return tweener.add(this.explainerText.scale).from({x: 1.5, y: 1.5}, 300, Tweener.ease.quintOut)
    }

    transitionOut () {
        if (this.timeIcon) {
            tweener.add(this.timeIcon).to({y: this.timeIcon.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
            tweener.add(this.clientRole).to({y: this.clientRole.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
            //tweener.add(this.board).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
            return tweener.add(this.statusText).to({ y: this.statusText.y + 10, alpha: 0 }, 300, Tweener.ease.quintOut)

        } else {
            return tweener.add(this.explainerText).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
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
        this.centerObject.apply(this,[this.explainerText, this.lobby, this.roleExplainer, this.board, this.callVoteButton, this.votingBox, this.proceedButton, this.questResultsBox, this.assassinateButton])
    }

    removeObject(object) {
        if (object) this.removeChild(object);
    }

    centerObject(object) {
        if (object) object.x = Application.WIDTH / 2
    }

    setExplainerText(newText) {
        this.explainerText.text = newText

    }
    onDispose () {
    }
}
