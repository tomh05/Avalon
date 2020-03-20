import * as PIXI from 'pixi.js'
import Application from './Application';
import TitleScreen from './screens/TitleScreen'


// // Load them google fonts before starting...!
window.WebFontConfig = {
    google: {
        families: ['Pirata One']
    }
};

// include the web-font loader script
/* jshint ignore:start */
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

/* jshint ignore:end */

var loader = new PIXI.Loader();
loader.add('logo', 'images/logo.png')
loader.add('background', 'images/background.jpg')
loader.add('colyseus', 'images/colyseus.png')

loader.add('clock-icon', 'images/clock-icon.png')
loader.add('board', 'images/board.png')

loader.on('complete', () => {
  var loading = document.querySelector('.loading');
  document.body.removeChild(loading);

  var app = new Application()
  app.gotoScene (TitleScreen)
  app.update()
})

loader.load();
