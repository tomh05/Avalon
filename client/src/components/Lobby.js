import * as PIXI from 'pixi.js'
import {TextInput} from 'pixi-textinput-v5'
import Button from './Button'

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
            align: 'left'
        });
        this.playerList.y = 0;
        this.addChild(this.playerList);
        
        this.nameField = new TextInput( { 
            input: {
                fontSize: '25pt',
                fontFamily: 'Pirata One',
                padding: '14px',
                width: '500px',
                color: '#26272E'
            }, 
            box: {
                default: {fill: 0xededdf, stroke: {color: 0xCBCEE0, width: 4}},
                focused: {fill: 0xededdf, stroke: {color: 0xABAFC6, width: 4}},
                disabled: {fill: 0xDBDBDB }
            }
        });
        this.nameField.text = "";
        this.nameField.placeholder = "Enter your name";
        this.nameField.y = 300
        this.nameField.on('input', this.onChangeName.bind(this))
        this.addChild(this.nameField);

        this.readyButton = new Button("Ready", 0xffffff, 0x990000)
        this.readyButton.x = 250;
        this.readyButton.y = 430;
        this.readyButton.interactive = true;

        this.addChild(this.readyButton);

        this.readyButton.on('click', this.onReadyClick.bind(this))
        //this.once('touchstart', this.startGame.bind(this))
    }

    updatePlayers(players) {

        if (!this.setName) {
            console.log('setting text');
            const newName = `Knight ${Object.keys(players).length}`
            //this.nameField.text = newName
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

        if (this.ready) {
        this.readyButton.update("Ready", 0xffffff, 0x006600)
        } else { 
        this.readyButton.update("Ready", 0xffffff, 0x990000)
        }
        this.emit('ready', this.ready);
    }


}
