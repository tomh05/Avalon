import * as PIXI from 'pixi.js'

import Player from './Player'
import Quest from './Quest'

export default class Board extends PIXI.Container {

    constructor (state, clientId) {
        super()

        this.state = state;
        this.clientId = clientId

        this.ellipseMinRadius = 140;
        this.ellipseAspect = 2;
        this.ellipsePadding = 30;

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

            const newPlayerSprite = new Player(playerData.id, playerData.name);
            this.playerSprites[playerData.id] = newPlayerSprite;
            const angle = 2 * Math.PI * i / numPlayers
            newPlayerSprite.pivot.x = newPlayerSprite.width / 2;
            newPlayerSprite.pivot.y = newPlayerSprite.height / 2;
            newPlayerSprite.x = -(this.ellipseMinRadius + this.ellipsePadding ) * this.ellipseAspect * Math.sin(angle);
            newPlayerSprite.y = (this.ellipseMinRadius + this.ellipsePadding) * Math.cos(angle);
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

    handlePlayerClick(clickedPlayerID) {
        this.emit('participantToggle', clickedPlayerID);
    }
           
}
