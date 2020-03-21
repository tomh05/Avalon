import * as PIXI from 'pixi.js'

export default class VotingBox extends PIXI.Container {

    constructor (id, name) {
        super()
        this.approveBox = new PIXI.Graphics();
        this.approveBox.beginFill(0x206e25);

        // set the line style to have a width of 5 and set the color to red
        this.approveBox.lineStyle(5, 0x164a1a);
        this.approveBox.drawRect(-220, 0, 200, 120);
        this.addChild(this.approveBox);

        this.rejectBox = new PIXI.Graphics();
        this.rejectBox.beginFill(0xad4439);
        // set the line style to have a width of 5 and set the color to red
        this.rejectBox.lineStyle(5, 0x4a1b16);
        this.rejectBox.drawRect(20, 0, 200, 120);
        this.addChild(this.rejectBox);

        this.approveText = new PIXI.Text("Approve", {
fontFamily: "Pirata One",
            fontSize: 32,

            fill: 0x000,
            textAlign: 'left'
        });
        this.approveText.pivot.x = this.approveText.width / 2
        this.approveText.pivot.y = this.approveText.height / 2
        this.approveText.x = -120;
        this.approveText.y = 60;
        this.addChild(this.approveText);

        this.rejectText = new PIXI.Text("Reject", {
            fontFamily: "Pirata One",
            fontSize: 32,
            fill: 0x000,
            textAlign: 'left'
        });
        this.rejectText.x = 120;
        this.rejectText.y = 60;
        this.rejectText.pivot.x = this.rejectText.width / 2
        this.rejectText.pivot.y = this.rejectText.height / 2
        this.addChild(this.rejectText);

        this.approveBox.interactive = true;
        this.rejectBox.interactive = true;
        this.approveBox.on('click', this.onApprove.bind(this))
        this.rejectBox.on('click', this.onReject.bind(this))

    }

    onApprove() {
        this.emit('vote', "APPROVE")
        this.approveBox.alpha = 1;
        this.rejectBox.alpha = 0.3;
    }

    onReject() {
        this.emit('vote', "REJECT")
        this.approveBox.alpha = 0.3;
        this.rejectBox.alpha = 1;
    }
}
