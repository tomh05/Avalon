import PIXI from 'pixi.js'
import SceneManager from './core/SceneManager'

import Clock from 'clock-timer.js'
window.clock = new Clock();

import Tweener from 'tweener'
window.Tweener = Tweener
window.tweener = new Tweener();

import Colyseus from 'colyseus.js'
window.colyseus = new Colyseus(
  window.location.protocol.replace("http", "ws") + "//localhost:3553"
  // window.location.protocol.replace("http", "ws") + "//" + process.env.
)

export default class Application {

  constructor () {
    this.background = new PIXI.Sprite.fromImage('images/background.jpg')

    Application.WIDTH = this.background.width
    Application.SCALE_RATIO = window.innerWidth / Application.WIDTH
    Application.HEIGHT = window.innerHeight / Application.SCALE_RATIO
    Application.MARGIN = (Application.HEIGHT / 100) * 10 // 10%

    var width = this.background.width * Application.SCALE_RATIO
      , height = window.innerHeight

    this.renderer = new PIXI.WebGLRenderer(width, height, {
      // resolution: window.devicePixelRatio,
      // antialias: false,
    })
    this.renderer.backgroundColor = 0xffffff
    document.body.appendChild(this.renderer.view)

    this.sceneManager = new SceneManager(Application.SCALE_RATIO)
    this.container = new PIXI.Container()

    this.backgroundWidth = this.background.width
    this.background.pivot.y = this.background.height / 2
    this.background.scale.x = Application.SCALE_RATIO
    this.background.scale.y = Application.SCALE_RATIO
    this.background.y = height / 2
    this.container.addChild(this.background)
    this.container.addChild(this.sceneManager)

    this.renderer.view.width = width
    this.renderer.view.height = height

    if (this.renderer.view.width > window.innerWidth) {
      this.renderer.view.style.position = "absolute"
      this.sceneManager.x = (window.innerWidth - this.renderer.view.width) / 2
    }

    // window.addEventListener('blur', this.pauseGame.bind(this))
    // window.addEventListener('focus', this.unpauseGame.bind(this))
    // document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this))

    // this.componentSystem = createComponentSystem(PIXI.DisplayObject)
  }

  gotoScene (sceneClass) {
    this.sceneManager.goTo(sceneClass)
  }

  // onVisibilityChange () {
  //   if (document.hidden) {
  //     this.pauseGame()
  //   } else {
  //     this.unpauseGame()
  //   }
  // }
  //
  // pauseGame () { clock.stop() }
  // unpauseGame () { clock.start() }

  update () {
    window.requestAnimationFrame( this.update.bind( this) )
    clock.tick()

    tweener.update(clock.deltaTime)
    // this.componentSystem.update()

    this.renderer.render(this.container)
  }

}
