import SceneManager from './core/SceneManager'

import Clock from 'clock-timer.js'
window.clock = new Clock();

import Tweener from 'tweener'
window.Tweener = Tweener
window.tweener = new Tweener();

window.SCALE_RATIO = 1

export default class Application {

  constructor () {
    this.tmpBackground = new PIXI.Sprite.fromImage('images/background.jpg')

    var ratio = window.innerHeight / this.tmpBackground.height
      , width = this.tmpBackground.width * ratio
      , height = this.tmpBackground.height * ratio

    SCALE_RATIO = ratio

    this.renderer = new PIXI.WebGLRenderer(width, height, {
      // resolution: window.devicePixelRatio,
      // antialias: false,
    })
    this.renderer.backgroundColor = 0xffffff
    document.body.appendChild(this.renderer.view)

    this.sceneManager = new SceneManager(ratio)

    this.renderer.view.width = width
    this.renderer.view.height = height

    if (this.renderer.view.width > window.innerWidth) {
      this.renderer.view.style.position = "absolute"
      this.sceneManager.x = (window.innerWidth - this.renderer.view.width) / 2
    }

    window.addEventListener('blur', this.pauseGame.bind(this))
    window.addEventListener('focus', this.unpauseGame.bind(this))
    document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this))

    // this.componentSystem = createComponentSystem(PIXI.DisplayObject)
  }

  get width () {
    return this.tmpBackground.width
  }

  get height () {
    return this.tmpBackground.height
  }

  gotoScene (sceneClass) {
    this.sceneManager.goTo(sceneClass)
  }

  onVisibilityChange () {
    if (document.hidden) {
      this.pauseGame()
    } else {
      this.unpauseGame()
    }
  }

  pauseGame () { clock.stop() }
  unpauseGame () { clock.start() }

  update () {
    window.requestAnimationFrame( this.update.bind( this) )
    clock.tick()

    tweener.update(clock.deltaTime)
    // this.componentSystem.update()

    this.renderer.render(this.sceneManager)
  }

}
