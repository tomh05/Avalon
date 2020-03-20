import * as PIXI from 'pixi.js'

import Application from '../Application'
import GameScreen from './GameScreen'

export default class TitleScreen extends PIXI.Container {

  constructor () {
    super()

    this.title = new PIXI.Sprite.fromImage("images/logo.png")
    this.title.pivot.x = this.title.width / 2
    this.addChild(this.title)

    this.instructionText = new PIXI.Text("Click to Start", {
      font: "62px Pirata One",
      fill: 0x000,
      textAlign: 'center'
    })
    this.instructionText.pivot.x = this.instructionText.width / 2
    this.instructionText.pivot.y = this.instructionText.height / 2
    this.addChild(this.instructionText)

    this.interactive = true
    this.once('click', this.startGame.bind(this))
    this.once('touchstart', this.startGame.bind(this))

    this.on('dispose', this.onDispose.bind(this))
  }

  transitionIn () {
    tweener.add(this.title).from({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quadOut)
    return tweener.add(this.instructionText).from({ alpha: 0 }, 300, Tweener.ease.quadOut)
  }

  transitionOut () {
    tweener.remove(this.title)
    tweener.remove(this.instructionText)

    tweener.add(this.title).to({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
    return tweener.add(this.instructionText).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
  }

  startGame () {
    this.emit('goto', GameScreen)
  }

  onResize () {
    this.title.x = Application.WIDTH / 2;
    this.title.y = Application.MARGIN

    this.instructionText.x = Application.WIDTH / 2
    this.instructionText.y = Application.HEIGHT / 2 - this.instructionText.height / 3.8

  }

  onDispose () {
    window.removeEventListener('resize', this.onResizeCallback)
  }

}




