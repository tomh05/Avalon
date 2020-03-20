import * as PIXI from 'pixi.js'

export default class Player extends PIXI.Container {

    constructor (id, name) {
        super()

        this.id = id;
        this.ready = false;
        this.setName = false;
        this.isKing = false;

        this.crown = new PIXI.Sprite.fromImage('images/crown.png')
        console.log('this',this.crown.scale);
        this.crown.width =40
        this.crown.height = 30
        this.crown.x = - 40
        this.crown.visible = false;
        //this.crown.pivot.x = this.crown.width / 2
        //this.crown.pivot.y = this.crown.height / 2
        this.addChild(this.crown)
        
        this.nameLabel = new PIXI.Text(name, {
            font: "32px Pirata One",
            fill: 0x000,
            textAlign: 'left'
        });
        this.nameLabel.y = 0;
        this.addChild(this.nameLabel);
        //this.readyButton.on('click', this.onReadyClick.bind(this))
    }

    /*
    onReadyClick() {
        this.ready = !this.ready;
        this.readyButton.text =  (this.ready? "Ready" : "Not Ready") 
        this.readyButton.style.fill =  (this.ready? "#009900" : "#990000") 
        this.emit('ready', this.ready);
    }
    */

    setKing(kingId) {
        this.isKing = (this.id == kingId) 
        this.crown.visible = this.isKing
    }
}
