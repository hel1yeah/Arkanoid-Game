let game = {
  ctx: null,
  sprites: {
    background: null,
    ball: null,
    platform: null,
  },

  init() {
    this.ctx = document.getElementById('mycanvars').getContext('2d');
  },

  preload(callback) {
    let loadet = 0;
    let required = Object.keys(this.sprites).length;
    console.log(required);
    for (const key in this.sprites) {
      if (Object.hasOwnProperty.call(this.sprites, key)) {
        this.sprites[key] = new Image();
        this.sprites[key].src = `./img/${key}.png`;

        this.sprites[key].addEventListener('load', () => {
          ++loadet;
          console.log();
          if (loadet >= required) {
            callback();
          }
        });
      }
    }
  },
  render() {
    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(this.sprites.ball, 0, 0);
    this.ctx.drawImage(this.sprites.platform, 30, 50);
  },

  run() {
    window.requestAnimationFrame(() => {
      this.render();
    });
  },

  start: function () {
    this.init();
    this.preload(() => {
      this.run();
    });
  },
};

window.addEventListener('load', () => {
  game.start();
});
