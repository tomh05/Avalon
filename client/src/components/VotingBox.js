import * as PIXI from 'pixi.js'

export default class VotingBox extends PIXI.Container {

    constructor (id, name) {
        super()
        this.approveBox = new PIXI.Graphics();
        this.approveBox.beginFill(0x206e25);

        // set the line style to have a width of 5 and set the color to red
        this.approveBox.lineStyle(5, 0x164a1a);
        this.approveBox.drawRect(-120, 0, 100, 100);
        this.addChild(this.approveBox);

        this.rejectBox = new PIXI.Graphics();
        this.rejectBox.beginFill(0xad4439);
        // set the line style to have a width of 5 and set the color to red
        this.rejectBox.lineStyle(5, 0x4a1b16);
        this.rejectBox.drawRect(20, 0, 100,100);
        this.addChild(this.rejectBox);

        this.approveText = new PIXI.Text("Approve", {
            font: "32px Pirata One",
            fill: 0x000,
            textAlign: 'left'
        });
        this.approveText.pivot.x = this.approveText.width / 2
        this.approveText.pivot.y = this.approveText.height / 2
        this.approveText.x = -50;
        this.addChild(this.approveText);

        this.rejectText = new PIXI.Text("Reject", {
            font: "32px Pirata One",
            fill: 0x000,
            textAlign: 'left'
        });
        this.rejectText.x = 50;
        this.rejectText.pivot.x = this.rejectText.width / 2
        this.rejectText.pivot.y = this.rejectText.height / 2
        this.addChild(this.rejectText);

        this.approveBox.interactive = true;
        this.rejectBox.interactive = true;
        this.approveBox.on('click', this.onApprove.bind(this))
        this.rejectBox.on('click', this.onReject.bind(this))

    }

    onApprove() {
        this.emit('vote', "ACCEPT")
        this.approveBox.alpha = 1;
        this.rejectBox.alpha = 0.5;
    }

    onReject() {
        this.emit('vote', "REJECT")
        this.approveBox.alpha = 0.5;
        this.rejectBox.alpha = 1;
    }
}
