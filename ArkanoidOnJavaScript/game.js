let game = {
  ctx: null,
  platform: null,
  ball: null,
  blocks: [],
  rows: 4,
  cols: 8,
  sprites: {
    background: null,
    ball: null,
    platform: null,
    block: null,
  },

  init() {
    this.ctx = document.getElementById('mycanvars').getContext('2d');
  },

  preload(callback) {
    let loadet = 0;
    let required = Object.keys(this.sprites).length;

    let onLoad = () => {
      ++loadet;
      console.log();
      if (loadet >= required) {
        callback();
      }
    };

    for (const key in this.sprites) {
      if (Object.hasOwnProperty.call(this.sprites, key)) {
        this.sprites[key] = new Image();
        this.sprites[key].src = `./img/${key}.png`;
        this.sprites[key].addEventListener('load', onLoad);
      }
    }
  },
  render() {
    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(
      this.sprites.ball,
      0,
      0,
      this.ball.width,
      this.ball.height,
      this.ball.x,
      this.ball.y,
      this.ball.width,
      this.ball.height
    );

    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);

    this.renderBlocks();
  },
  renderBlocks() {
    for (const block of this.blocks) {
      this.ctx.drawImage(this.sprites.block, block.x, block.y);
    }
  },
  created() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          x: 65 * col + 65,
          y: 25 * row + 35,
        });
      }
    }
  },
  run() {
    window.requestAnimationFrame(() => {
      this.render();
    });
  },

  start: function () {
    this.init();
    this.preload(() => {
      this.created();
      this.run();
    });
  },
};

game.ball = {
  x: 320,
  y: 280,
  width: 20,
  height: 20,
};
game.platform = {
  x: 280,
  y: 300,
};

window.addEventListener('load', () => {
  game.start();
});
