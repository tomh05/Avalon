import * as PIXI from 'pixi.js'
import Button from './Button'

export default class QuestResultsBox extends PIXI.Container {

    constructor (results) {
        super()
        let width = 100
        let height = 150
        let spacing = 20

        for (let i = 0; i< results.length; i++) {
            let foregroundColor = results[i] == "SUCCESS" ? 0xa18740 : 0xc2af7a;
            let backgroundColor = results[i] == "SUCCESS" ? 0xffe18f : 0x333333;

            let box = new PIXI.Graphics()
            let label = new PIXI.Text( results[i] , {
                fontFamily: "Pirata One",
                fontSize: 32,
                fill: foregroundColor,
                textAlign: 'center'
            });
            label.anchor.set(0.5,0.5)
            box.beginFill(backgroundColor);
            box.lineStyle(5, 0x333333,0.5);
            box.drawRect(( width+spacing) * i, 0, width, height);
            label.x = width/2 + (width+spacing)*i
            label.y = height/2
            box.alpha=0
            label.alpha=0
            this.addChild(box)
            this.addChild(label)
            tweener.add(box).wait(6000*i/results.length).to({alpha:1}, 2000, Tweener.ease.expoOut);
            tweener.add(label).wait(6000*i/results.length).to({alpha:1}, 2000, Tweener.ease.expoOut);
        }

    }
}
