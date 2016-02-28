export default class SceneManager extends PIXI.Container {

  constructor (ratio) {
    super()

    this.scale.x = ratio
    this.scale.y = ratio

    this.currentScene = null
    this.nextScene = null

    this.sceneInstanceMap = {}
  }

  goTo (screenClass, options = {}) {
    var screenName = screenClass.name

    if (!this.sceneInstanceMap[ screenName ]) {
      this.sceneInstanceMap[ screenName ] = new screenClass(options)
      this.sceneInstanceMap[ screenName ].__callbacks = {}

      this.bindEvents( this.sceneInstanceMap[ screenName ] )
    }

    if (this.currentScene) {
      this.nextScene = this.sceneInstanceMap[ screenName ]

      if (!this.currentScene.transitionOut) {
        this.defaultTransitionOut(this.currentScene)
      }

      let transitionIn = (!this.nextScene.transitionIn)
        ? this.defaultTransitionIn(this.nextScene)
        : this.nextScene.transitionIn()

      transitionIn.then(() => {
        this.currentScene = this.nextScene
        this.nextScene = null
      })

    } else {
      this.currentScene = this.sceneInstanceMap[ screenName ]
      this.addChild(this.currentScene)
    }
  }

  bindEvents (scene) {
    if (scene.onResize) {
      let callback = scene.onResize.bind(scene)
      window.addEventListener('resize', callback)
      this.sceneInstanceMap[ scene.constructor.name ].__callbacks['resize'] = callback
      callback()
    }
    scene.on('goto', (...args) => this.goTo.apply(this, args))
  }

  defaultTransitionIn (scene) {
    scene.alpha = 0
    this.addChild(scene)
    return tweener.add(scene).
      to({ alpha: 1 }, 800, Tweener.ease.easeQuintOut)
  }

  defaultTransitionOut (scene) {
    return tweener.add(scene).
      to({ alpha: 0 }, 800, Tweener.ease.easeQuintOut).then( () => {
        // dispose & remove all scene references on transition-out
        scene.emit('dispose')

        let callbacks = this.sceneInstanceMap[ scene.constructor.name ].__callbacks
        for (let event in callbacks) {
          window.removeEventListener(event, callbacks[event])
        }
        scene.off()

        this.removeChild(scene)
        delete this.sceneInstanceMap[ scene.constructor.name ]
      })
  }

}
