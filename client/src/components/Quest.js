import * as PIXI from 'pixi.js'

export default class Quest extends PIXI.Container {


    constructor (questState) {
        super()

        this.circle = new PIXI.Graphics();
        this.drawCircle('#660000');
        this.addChild(this.circle);
        
        const participantCountLabelText = questState.requiredParticipants + (questState.requiredFails > 1 ? "*": "");

        this.participantCountLabel = new PIXI.Text(participantCountLabelText, {
            font: "32px Pirata One",
            fill: 0x000,
            textAlign: 'left'
        });
        this.participantCountLabel.pivot.x = this.participantCountLabel.width / 2
        this.participantCountLabel.pivot.y = this.participantCountLabel.height / 2
        this.participantCountLabel.y = 0;
        this.addChild(this.participantCountLabel);
    }

    setOutcome(isPass) {
        this.drawCircle( isPass ? "#00CC00" : "#CC0000");
        this.participantCountLabel.visible = false;
    }

    drawCircle(colour) {
        this.circle.clear()
        this.circle.beginFill(colour,0.1)
        this.circle.lineStyle(3, colour)
        this.circle.drawCircle(0,0,30)
    }
}
