import PIXI from 'pixi.js'

import Application from '../Application'
import GameScreen from './GameScreen'

export default class TitleScreen extends PIXI.Container {

  constructor () {
    super()

    this.title = new PIXI.Sprite.fromImage("images/logo.png")
    this.title.pivot.x = this.title.width / 2
    this.addChild(this.title)

    this.instructionText = new PIXI.Text("touch to start", {
      font: "62px JennaSue",
      fill: 0x000,
      textAlign: 'center'
    })
    this.instructionText.pivot.x = this.instructionText.width / 2
    this.instructionText.pivot.y = this.instructionText.height / 2
    this.addChild(this.instructionText)

    this.colyseus = new PIXI.Sprite.fromImage('images/colyseus.png')
    this.colyseus.pivot.x = this.colyseus.width / 2
    this.addChild(this.colyseus)

    this.interactive = true
    this.on('click', this.startGame.bind(this))
    this.on('touchstart', this.startGame.bind(this))

    this.on('dispose', this.onDispose.bind(this))
  }

  startGame () {
    this.emit('goto', GameScreen)
  }

  onResize () {
    this.title.x = Application.WIDTH / 2;
    this.title.y = Application.MARGIN

    this.instructionText.x = Application.WIDTH / 2
    this.instructionText.y = Application.HEIGHT / 2 - this.instructionText.height / 3.8

    this.colyseus.x = Application.WIDTH / 2
    this.colyseus.y = Application.HEIGHT - this.colyseus.height - Application.MARGIN
  }

  onDispose () {
    window.removeEventListener('resize', this.onResizeCallback)
  }

}




