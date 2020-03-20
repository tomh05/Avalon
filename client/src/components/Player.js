import * as PIXI from 'pixi.js'

export default class Player extends PIXI.Container {

    constructor (id, name) {
        super()

        this.id = id;
        this.ready = false;
        this.setName = false;
        this.isKing = false;

        this.crown = new PIXI.Sprite.from('images/crown.png')
        console.log('this',this.crown.scale);
        this.crown.width =40
        this.crown.height = 30
        this.crown.x = - 40
        this.crown.visible = false;
        //this.crown.pivot.x = this.crown.width / 2
        //this.crown.pivot.y = this.crown.height / 2
        this.addChild(this.crown)


        this.shield = new PIXI.Sprite.from('images/shield.png')
        console.log('this',this.shield.scale);
        this.shield.width =40
        this.shield.height = 40
        this.shield.x = - 80
        this.shield.visible = false;
        this.addChild(this.shield)
        
        this.nameLabel = new PIXI.Text(name, {
        fontFamily: "Pirata One",
        fontSize: 32,
            fill: 0x000,
            textAlign: 'left'
        });
        this.nameLabel.y = 0;
        this.addChild(this.nameLabel);

        this.interactive = true
        this.on('click', this.onClick.bind(this))

    }

    onClick() {
        this.emit('playerClicked', this.id);
    }

    setKing(kingId) {
        this.isKing = (this.id == kingId) 
        this.crown.visible = this.isKing
    }

    setParticipant(isParticipant) {
        this.isParticipant = isParticipant
        this.shield.visible = isParticipant
    }
}
