import * as PIXI from 'pixi.js'
import {TextInput} from 'pixi-textinput-v5'

export default class Lobby extends PIXI.Container {

    constructor () {
        super()

        this.ready = false;
        this.setName = false;

        //this.background = new PIXI.Sprite.from('images/board.png')
        //this.addChild(this.background)
        //
        this.playerList = new PIXI.Text("", {
            fontFamily: "Pirata One",
            fontSize: 32,
            fill: 0x000,
            textAlign: 'left'
        });
        this.playerList.y = 0;
        this.addChild(this.playerList);
        
        this.nameField = new TextInput( { 
            input: {
                fontSize: '25pt',
                padding: '14px',
                width: '500px',
                color: '#26272E'
            }, 
            box: {
                default: {fill: 0xE8E9F3, rounded: 16, stroke: {color: 0xCBCEE0, width: 4}},
                focused: {fill: 0xE1E3EE, rounded: 16, stroke: {color: 0xABAFC6, width: 4}},
                disabled: {fill: 0xDBDBDB, rounded: 16}
            }
        });
        this.nameField.text = "Knight Knameless";
        this.nameField.text = undefined;
        this.nameField.y = 200
        this.nameField.on('input', this.onChangeName.bind(this))
        this.addChild(this.nameField);

        this.readyButton = new PIXI.Text("Not Ready", {
        fontFamily: "Pirata One",
        fontSize: 62,
            fill: "#990000",
            textAlign: 'center'
        });
        this.readyButton.y = 300;
        this.readyButton.interactive = true;

        this.addChild(this.readyButton);

        this.readyButton.on('click', this.onReadyClick.bind(this))
        //this.once('touchstart', this.startGame.bind(this))
    }

    updatePlayers(players) {

        console.log('updating', this.nameField.text == undefined);
        if (!this.setName) {
        console.log('setting text');
            const newName = `Knight ${Object.keys(players).length}`
            this.nameField.text = newName
            this.onChangeName(newName)
            this.setName = true;

        }

        var playerData = Object.keys(players).map(function (key) {
            return `${players[key].name}  (${players[key].ready ? "ready":"not ready"})`;
        });
        this.playerList.text = playerData.join('\n');

    }

    onChangeName(name) {
        this.emit('nameChanged', name);
    }

    onReadyClick() {
        this.ready = !this.ready;
        this.readyButton.text =  (this.ready? "Ready" : "Not Ready") 
        this.readyButton.style.fill =  (this.ready? "#009900" : "#990000") 
        this.emit('ready', this.ready);
    }


}
