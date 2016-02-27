export default class GameScreen extends PIXI.Container {

  constructor () {
    super()

    this.on('dispose', this.onDispose.bind(this))
  }

  onDispose () {
  }

}
