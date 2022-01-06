let game = {
  ctx: null,
  platform: null,
  ball: null,
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
    this.ctx.drawImage(
      this.sprites.ball,
      0,
      0,
      this.ball.w,
      this.ball.h,
      this.ball.x,
      this.ball.y,
      this.ball.w,
      this.ball.h
    );

    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
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

game.ball = {
  x: 320,
  y: 280,
  w: 20,
  h: 20,
};
game.platform = {
  x: 280,
  y: 300,
};

window.addEventListener('load', () => {
  game.start();
});
