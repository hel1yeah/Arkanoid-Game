const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
};

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
    this.setEvents();
  },
  setEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === KEYS.LEFT || e.key === KEYS.RIGHT) {
        this.platform.start(e.key);
      }
    });
    window.addEventListener('keyup', (e) => {
      this.platform.stop();
    });
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
  update() {
    this.platform.move();
  },
  run() {
    window.requestAnimationFrame(() => {
      this.update();
      this.render();
      this.run();
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
  velocity: 4,
  dx: 0,
  x: 280,
  y: 300,
  move() {
    if (this.dx) {
      this.x += this.dx;
      game.ball.x += this.dx;
    }
  },
  start(direction) {
    if (direction == KEYS.LEFT) {
      this.dx = -this.velocity;
    } else if (direction == KEYS.RIGHT) {
      this.dx = this.velocity;
    }
  },
  stop() {
    this.dx = 0;
  },
};

window.addEventListener('load', () => {
  game.start();
});
