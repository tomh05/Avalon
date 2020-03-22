import * as PIXI from 'pixi.js'

import Player from './Player'
import Quest from './Quest'

export default class Board extends PIXI.Container {

    constructor (state, clientId) {
        super()

        this.state = state;
        this.clientId = clientId

        this.ellipseMinRadius = 100;
        this.ellipseAspect = 2.5;
        this.ellipsePadding = 60;

        this.ready = false;
        this.setName = false;
        this.playerSprites = {};
        this.questSprites = [];

        this.drawTable();

        this.addQuests(this.state.quests);
        this.addPlayers(this.state.players, this.state.playerOrder)
    }

    drawTable() {
        var table = new PIXI.Graphics();
        table.beginFill(0x660000,0.1);

        // set the line style to have a width of 5 and set the color to red
        table.lineStyle(5, 0x990000);

        table.drawEllipse(0, 0, this.ellipseMinRadius * this.ellipseAspect, this.ellipseMinRadius);

        this.addChild(table);
    }

    addQuests(quests) {
        for (let i=0; i< quests.length; i++) {
            const newQuest = new Quest(quests[i])
            newQuest.x = -160 + i * 80
            console.log("creating new quest",newQuest);
            this.questSprites.push(newQuest)
            this.addChild(newQuest);
        }
    }

    addPlayers(players, playerOrder) {
        let myIndex = playerOrder.indexOf(this.clientId);
        let numPlayers = playerOrder.length
        for (let i=0; i< numPlayers; i++)
        {
            const playerOrderIndex = (myIndex + i) % numPlayers
            const playerData = players[playerOrder[playerOrderIndex]];

            const clientRole = players[this.clientId].role
            const newPlayerSprite = new Player(playerData.id, playerData.name, playerData.role, clientRole);
            this.playerSprites[playerData.id] = newPlayerSprite;
            const angle = 2 * Math.PI * i / numPlayers
            //newPlayerSprite.pivot.x = newPlayerSprite.width / 2;
            newPlayerSprite.x = -(this.ellipseMinRadius + this.ellipsePadding ) * this.ellipseAspect * Math.sin(angle);
            newPlayerSprite.y = -20 + (this.ellipseMinRadius + this.ellipsePadding) * Math.cos(angle);
            newPlayerSprite.on('playerClicked', this.handlePlayerClick.bind(this))
            this.addChild(newPlayerSprite);
        }
        }

    setKing(kingId) {
        this.currentKing = kingId;
        for (let p in this.playerSprites) {
            this.playerSprites[p].setKing(kingId);
        }
    }
    updatePlayers(players) {
        for (let pid in players) {
            this.playerSprites[pid].setParticipant(players[pid].isParticipant);
        }
    }

    updateQuests(quests) {
        console.log('updating quests')
        for (let i=0; i< this.questSprites.length; i++) {

        console.log(`quest ${i} outcome ${quests[i].outcome}`)
            this.questSprites[i].setOutome(quests[i].outcome)
        }
    }

    handlePlayerClick(clickedPlayerID) {
        this.emit('playerSelected', clickedPlayerID);
    }


    revealVotes(players) {
        for (let pid in this.playerSprites) {
            this.playerSprites[pid].revealVote(players[pid].vote);
        }
    }

    clearVotes() {
        for (let pid in this.playerSprites) {
            this.playerSprites[pid].clearVote();
        }
    }

    revealRoles() {
        for (let pid in this.playerSprites) {
            this.playerSprites[pid].revealRole();
        }
    }
}
