import * as PIXI from 'pixi.js'

import Player from './Player'

export default class Board extends PIXI.Container {

    constructor (players, playOrder, thisPlayerId) {
        super()

        this.ellipseMinRadius = 100;
        this.ellipseAspect = 2;
        this.ellipsePadding = 30;

        this.ready = false;
        this.setName = false;
        this.players = players;
        this.playerSprites = {};

        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x660000,0.1);

        // set the line style to have a width of 5 and set the color to red
        graphics.lineStyle(5, 0x990000);

        graphics.drawEllipse(0, 0, this.ellipseMinRadius * this.ellipseAspect, this.ellipseMinRadius);

        this.addChild(graphics);

        let myIndex = playOrder.indexOf(thisPlayerId);
        let numPlayers = playOrder.length
        for (let i=0; i< numPlayers; i++)
        {
            const playerOrderIndex = (myIndex + i) % numPlayers
            const playerData = players[playOrder[playerOrderIndex]];

            const newPlayerSprite = new Player(playerData.id, playerData.name);
            this.playerSprites[playerData.id] = newPlayerSprite;
            const angle = 2 * Math.PI * i / numPlayers
            newPlayerSprite.pivot.x = newPlayerSprite.width / 2;
            newPlayerSprite.pivot.y = newPlayerSprite.height / 2;
            newPlayerSprite.x = -(this.ellipseMinRadius + this.ellipsePadding ) * this.ellipseAspect * Math.sin(angle);
            newPlayerSprite.y = (this.ellipseMinRadius + this.ellipsePadding) * Math.cos(angle);
            this.addChild(newPlayerSprite);
        }
    }

    setKing(kingId) {
        for (let p in this.playerSprites) {
            this.playerSprites[p].setKing(kingId);
        }
    }
           
}
