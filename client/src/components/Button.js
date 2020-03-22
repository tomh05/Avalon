import * as PIXI from 'pixi.js'

export default class Button extends PIXI.Container {

    constructor (labelText, foregroundColor, backgroundColor) {
        super()
        this.padding = 20

        this.box = new PIXI.Graphics()
        
        this.label = new PIXI.Text(labelText, {
        fontFamily: "Pirata One",
        fontSize: 42,
            fill: foregroundColor,
            textAlign: 'center'
        });
        this.label.anchor.set(0.5,0.5)

        this.update(labelText, foregroundColor, backgroundColor);

        this.addChild(this.box);
        this.addChild(this.label);

        this.interactive = true
        this.buttonMode = true
        this.on('click', this.onClick.bind(this))

    }

    onClick() {
        this.emit('playerClicked', this.id);
    }

    update(labelText, foregroundColor, backgroundColor) {

        this.label.text = labelText
        this.label.style.fill = foregroundColor
        this.box.clear();
        this.box.beginFill(backgroundColor);
        // set the line style to have a width of 5 and set the color to red
        this.box.lineStyle(10, backgroundColor,0.5);
        this.box.drawRect(-this.label.width/2 - this.padding, -this.label.height/2 - this.padding, this.label.width + 2*this.padding, this.label.height + 2*this.padding);

    }
}
