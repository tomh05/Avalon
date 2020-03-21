import * as PIXI from 'pixi.js'

export default class Quest extends PIXI.Container {


    constructor (questState) {
        super()

        this.circle = new PIXI.Graphics();
        this.drawCircle(0x663333);
        this.addChild(this.circle);
        
        const participantCountLabelText = questState.requiredParticipants + (questState.requiredFails > 1 ? "*": "");

        this.participantCountLabel = new PIXI.Text(participantCountLabelText, {
        fontFamily: "Pirata One",
        fontSize: 32,
            fill: 0x000,
            textAlign: 'left'
        });
        this.participantCountLabel.pivot.x = this.participantCountLabel.width / 2
        this.participantCountLabel.pivot.y = this.participantCountLabel.height / 2
        this.participantCountLabel.y = 0;
        this.addChild(this.participantCountLabel);
    }

    setOutome(outcome) {
        if (outcome == "SUCCESS") {
            this.drawCircle(0x009900)
            this.participantCountLabel.alpha = 0.2;
        }
        else if (outcome == "FAIL") {
            this.drawCircle(0xCC0000)
            this.participantCountLabel.alpha = 0.2;
        }
    }

    drawCircle(colour) {
        console.l
        this.circle.clear()
        this.circle.beginFill(colour,0.3)
        this.circle.lineStyle(3, colour)
        this.circle.drawCircle(0,0,30)
    }
}
