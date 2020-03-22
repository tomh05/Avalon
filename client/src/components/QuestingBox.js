import * as PIXI from 'pixi.js'
import Button from './Button'

export default class QuestingBox extends PIXI.Container {

    constructor (isGood) {
        super()
        this.isGood = isGood;

        this.successButton = new Button("Succeed", 0xffd561, 0x333333);
        this.successButton.x = -100
        this.addChild(this.successButton);

        this.successButton.on('click', this.onSuccess.bind(this))

        if (this.isGood) {
            this.failButton = new Button("Can't Fail", 0xaaaaaa, 0x666666);

        } else {
            this.failButton = new Button("Fail", 0xcccccc, 0x333333);
            this.failButton.on('click', this.onFail.bind(this))
        }
        this.failButton.x = 100
        this.addChild(this.failButton);


    }

    onSuccess() {
        this.emit('questContribution', "SUCCESS")
        this.successButton.update("Succeed", 0xffd561, 0x333333);
        if (!this.isGood) {
        this.failButton.update("Fail", 0xaaaaaa, 0x666666);
        }
    }

    onFail() {
        this.emit('questContribution', "FAIL")
        this.successButton.update("Succeed", 0xc2af7a, 0x666666);
        this.failButton.update("Fail", 0xcccccc, 0x333333);
    }
}
