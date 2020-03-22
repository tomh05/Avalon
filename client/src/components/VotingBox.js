import * as PIXI from 'pixi.js'
import Button from './Button'

export default class VotingBox extends PIXI.Container {

    constructor (id, name) {
        super()
        this.approveButton = new Button("Approve", 0xcccccc, 0x206e25);
        this.approveButton.x = -100
        this.addChild(this.approveButton);
        
        this.rejectButton = new Button("Reject", 0xcccccc, 0x880000);
        this.rejectButton.x = 100
        this.addChild(this.rejectButton);

        this.approveButton.on('click', this.onApprove.bind(this))
        this.rejectButton.on('click', this.onReject.bind(this))

    }

    onApprove() {
        this.emit('vote', "APPROVE")
        this.approveButton.update("Approve", 0xffffff, 0x206e25);
        this.rejectButton.update("Reject", 0xaaaaaa, 0x330000);
    }

    onReject() {
        this.emit('vote', "REJECT")
        this.approveButton.update("Approve", 0xaaaaaa, 0x103e15);
        this.rejectButton.update("Reject", 0xffffff, 0x880000);

    }
}
