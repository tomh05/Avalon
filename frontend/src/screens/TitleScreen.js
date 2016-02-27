import GameScreen from './GameScreen'

export default class SplashScreen extends PIXI.Container {

  constructor () {
    super()

    this.bg = new PIXI.Sprite.fromImage('images/splash_screen.jpg')
    this.addChild(this.bg)

    tweener.add(this.bg).
      from({ alpha: 0 }, 800, Tweener.quartInOut).
      then(() => {
        clock.setTimeout(() => {
          this.emit('goto', GameScreen)
        }, 1000)
      })

    this.on('dispose', this.onDispose.bind(this))
  }

  onDispose () {
  }

}




