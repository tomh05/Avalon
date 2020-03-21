import * as PIXI from 'pixi.js'

export default class QuestingBox extends PIXI.Container {

    constructor (isGood) {
        super()
        this.isGood = isGood;
        this.succeedBox = new PIXI.Graphics();
        this.succeedBox.beginFill(0x206e25);

        // set the line style to have a width of 5 and set the color to red
        this.succeedBox.lineStyle(5, 0x164a1a);
        this.succeedBox.drawRect(-220, 0, 200, 120);
        this.addChild(this.succeedBox);

        this.failBox = new PIXI.Graphics();
        this.failBox.beginFill(0xad4439);
        // set the line style to have a width of 5 and set the color to red
        this.failBox.lineStyle(5, 0x4a1b16);
        this.failBox.drawRect(20, 0, 200, 120);
        this.addChild(this.failBox);

        this.succeedText = new PIXI.Text("Succeed", {
fontFamily: "Pirata One",
            fontSize: 32,

            fill: 0x000,
            textAlign: 'left'
        });
        this.succeedText.pivot.x = this.succeedText.width / 2
        this.succeedText.pivot.y = this.succeedText.height / 2
        this.succeedText.x = -120;
        this.succeedText.y = 60;
        this.addChild(this.succeedText);

        this.failText = new PIXI.Text("Fail", {
            fontFamily: "Pirata One",
            fontSize: 32,
            fill: 0x000,
            textAlign: 'left'
        });
        this.failText.x = 120;
        this.failText.y = 60;
        this.failText.pivot.x = this.failText.width / 2
        this.failText.pivot.y = this.failText.height / 2
        this.addChild(this.failText);

        this.succeedBox.interactive = true;
        this.succeedBox.on('click', this.onSucceed.bind(this))

        if (this.isGood) {
            this.onSucceed()
        } else {
            this.failBox.interactive = true;
            this.failBox.on('click', this.onFail.bind(this))
        }
    }

    onSucceed() {
        this.emit('questContribution', "SUCCESS")
        this.succeedBox.alpha = 1;
        this.failBox.alpha = 0.3;
    }

    onFail() {
        this.emit('questContribution', "FAIL")
        this.succeedBox.alpha = 0.3;
        this.failBox.alpha = 1;
    }
}
