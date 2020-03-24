import * as PIXI from 'pixi.js'

export default class Player extends PIXI.Container {

    constructor (id, name, role, clientRole) {
        super()
        this.id = id;
        this.ready = false;
        this.setName = false;
        this.isKing = false;

        this.crown = new PIXI.Sprite.from('images/crown.png')
        this.crown.width =40
        this.crown.height = 30
        this.crown.x = -40
        this.crown.y = -15
        this.crown.visible = false;
        this.addChild(this.crown)

        if ( ["GENERIC_EVIL", "ASSASSIN"].includes(role) ) {
            this.skull = new PIXI.Sprite.from('images/skull.png')
            this.skull.width =40
            this.skull.height = 40
            this.skull.x = -80
            this.skull.y = -20
            this.skull.visible = ["MERLIN", "GENERIC_EVIL", "ASSASSIN"].includes(clientRole)
            this.addChild(this.skull)
        }

        if ( ["MERLIN", "MORGANA"].includes(role) ) {
            this.wizardHat = new PIXI.Sprite.from('images/wizardHat.png')
            this.wizardHat.width =40
            this.wizardHat.height = 40
            this.wizardHat.x = 40
            this.wizardHat.y= -20
            this.wizardHat.visible = ["MERLIN", "PERCIVAL"].includes(clientRole)
            this.addChild(this.wizardHat)
        }

        this.shield = new PIXI.Sprite.from('images/shield.png')
        this.shield.width =40
        this.shield.height = 40
        this.shield.anchor.x = 0.5
        this.shield.anchor.y = 0.5
        this.shield.x = 20
        this.shield.y = 0
        this.shield.alpha = 0;

        console.log('this scale',this.shield.scale);
        this.addChild(this.shield)
        
        this.nameLabel = new PIXI.Text(name, {
        fontFamily: "Pirata One",
        fontSize: 32,
            fill: 0x000,
            textAlign: 'center'
        });
        this.nameLabel.y = 20;
        this.nameLabel.pivot.x = this.nameLabel.width / 2
        this.addChild(this.nameLabel);

        this.interactive = true
        this.buttonMode = true
        this.on('click', this.onClick.bind(this))
        this.on('touchstart', this.onClick.bind(this))

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
        if (isParticipant) {
            tweener.add(this.shield).to({alpha: 1}, 500, Tweener.ease.expoOut);
            tweener.add(this.shield.scale).to({x: 0.1, y: 0.1}, 300, Tweener.ease.quintOut)
        } else {
            tweener.add(this.shield).to({alpha: 0}, 500, Tweener.ease.expoOut);
            tweener.add(this.shield.scale).to({x: 0.2, y: 0.2265}, 300, Tweener.ease.quintOut)
        }
    }

    revealVote(vote) {
        this.nameLabel.style.fill = (vote == "APPROVE") ? 0x24ab3a : 0x9e2b11;
    }

    clearVote() {
        this.nameLabel.style.fill = 0x000
    }

    revealRole() {
        if (this.skull) {
            this.skull.visible = true;
        }
        if (this.wizardHat) {
            this.wizardHat.visible = true;
        }
    }
}
