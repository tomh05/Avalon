import * as PIXI from 'pixi.js'

export default class RoleExplainer extends PIXI.Container {

    constructor (role, allegiance) {
        super()

        console.log('my role is', role);
        this.ready = false;

        //this.background = new PIXI.Sprite.from('images/board.png')
        //this.addChild(this.background)
        //
        this.youAre = new PIXI.Text("You are", {
            fontFamily: "Pirata One",
            fontSize: 32,
            fill: 0x000,
            textAlign: 'center'
        });
        this.youAre.y = 0;
        this.addChild(this.youAre);

        this.roleName = new PIXI.Text("", {
            fontFamily: "Pirata One",
            fontSize: 62,
            font: "62px Pirata One",
            fill: 0x000,
            textAlign: 'center'
        });

        this.roleDescription = new PIXI.Text("", {
            fontFamily: "Pirata One",
            fontSize: 32,
            fill: 0x000,
            textAlign: 'center'
        });

        switch (role) {
            case "GENERIC_GOOD":
                this.roleName.text = "A loyal servant of Arthur"
                this.roleDescription.text = "Your mission is to prevent Minions of Mordred\nfrom sabotaging King Arthur's quests."
                break;
            case "GENERIC_EVIL":
                this.roleName.text = "A Minion of Mordred"
                this.roleDescription.text = "You wish to sabotage King Arthur's quests.\nYou will know the identity of the other minions."
                break;
            case "MERLIN":
                this.roleName.text = "Merlin"
                this.roleDescription.text = "You know who the Minions of Mordred are,\nbut will cause the kingdom to fall if\nthey discover your identity."
                break;
            case "ASSASSIN":
                this.roleName.text = "The Assassin"
                this.roleDescription.text = "You wish to harm King Arthur,\nby sabotaging quests, or by finding and killing Merlin.\nYou will know the identity of the other minions."
                break;
            default:
        }
        this.roleName.y = 100;
        this.roleDescription.y = 200;
        this.addChild(this.roleName);
        this.addChild(this.roleDescription);
        
        this.readyButton = new PIXI.Text("OK", {
            fontFamily: "Pirata One",
            fontSize: 62,
            fill: "#330000",
            textAlign: 'center'
        });
        this.readyButton.y = 340;
        this.readyButton.interactive = true;

        this.addChild(this.readyButton);

        this.readyButton.on('click', this.onReadyClick.bind(this))
    }

    updatePlayers(players) {
        var playerData = Object.keys(players).map(function (key) {
            return `${players[key].name}  (${players[key].readyToStart ? "ready":"not ready"})`;
        });
        this.playerList.text = playerData.join('\n');

    }

    onChangeName(name) {
        this.emit('nameChanged', name);
    }

    onReadyClick() {
        console.log('ready was clicked in explainer!')
        this.readyButton.text = "waiting for others..."
        this.emit('ready', true);
    }


}
