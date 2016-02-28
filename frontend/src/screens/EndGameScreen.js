import PIXI from 'pixi.js'
import GameScreen from './GameScreen'

export default class EndGameScreen extends PIXI.Container {

  constructor (options = {}) {
    super()

    this.title = new PIXI.Text("You win!", {
      font: "132px JennaSue",
      fill: 0x000,
      textAlign: 'center'
    })
    this.title.pivot.x = this.title.width / 2
    this.addChild(this.title)

    this.instructionText = new PIXI.Text("touch to start", {
      font: "52px JennaSue",
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

    this.onResizeCallback = this.onResize.bind(this)
    window.addEventListener('resize', this.onResizeCallback)
    this.onResize()
  }

  startGame () {
    console.log("WAT")
    this.emit('goto', GameScreen)
  }

  onResize () {
    this.MARGIN = (window.innerHeight / 100) * 8 // 5%

    this.title.x = window.innerWidth / 2;
    this.title.y = this.MARGIN

    this.instructionText.x = window.innerWidth / 2
    this.instructionText.y = window.innerHeight / 2

    this.colyseus.x = window.innerWidth / 2
    this.colyseus.y = window.innerHeight - this.colyseus.height - this.MARGIN
  }

  onDispose () {
    window.removeEventListener('resize', this.onResizeCallback)
  }

}





