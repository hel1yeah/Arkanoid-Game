const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  SPACE: 'Space',
};

let game = {
  ctx: null,
  platform: null,
  ball: null,
  blocks: [],
  score: 0,
  running: true,
  rows: 4,
  cols: 8,
  width: 640,
  height: 360,
  sounds: { bump: null },
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
      if (e.code === KEYS.SPACE) {
        this.platform.fire();
      } else if (e.code === KEYS.LEFT || e.code === KEYS.RIGHT) {
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
    required += Object.keys(this.sounds).length;

    let onResourseLoad = () => {
      ++loadet;
      if (loadet >= required) {
        callback();
      }
    };

    this.preloadSprites(onResourseLoad);
    this.preloadSounds(onResourseLoad);
  },
  preloadSprites(onResourseLoad) {
    for (const key in this.sprites) {
      if (Object.hasOwnProperty.call(this.sprites, key)) {
        this.sprites[key] = new Image();
        this.sprites[key].src = `./img/${key}.png`;
        this.sprites[key].addEventListener('load', onResourseLoad);
      }
    }
  },
  preloadSounds(onResourseLoad) {
    for (const key in this.sounds) {
      if (Object.hasOwnProperty.call(this.sounds, key)) {
        this.sounds[key] = new Audio(`./sounds/${key}.mp3`);
        this.sounds[key].addEventListener('canplaythrough', onResourseLoad, {
          once: true,
        });
      }
    }
  },
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
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
      if (block.active) {
        this.ctx.drawImage(this.sprites.block, block.x, block.y);
      }
    }
  },

  created() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          active: true,
          width: 60,
          height: 20,
          x: 65 * col + 65,
          y: 25 * row + 35,
        });
      }
    }
  },

  update() {
    this.collideBlocks();
    this.collidePlatform();
    this.ball.collideWorldBounds();
    this.platform.move();
    this.ball.move();
  },

  collideBlocks() {
    for (const block of this.blocks) {
      if (block.active && this.ball.collide(block)) {
        this.ball.bumbBlock(block);
        this.addScore();
        this.sounds.bump.play();
      }
    }
  },
  addScore() {
    ++this.score;
    if (this.score >= this.blocks.length) {
      this.end('You Wins');
    }
  },
  collidePlatform() {
    if (this.ball.collide(this.platform)) {
      this.ball.bumbPlatform(this.platform);
      this.sounds.bump.play();
    }
  },
  end(text) {
    game.running = false;
    alert(text);
    window.location.reload();
  },
  run() {
    if (this.running) {
      window.requestAnimationFrame(() => {
        this.update();
        this.render();
        this.run();
      });
    }
  },
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  start() {
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
  velocity: 3,
  dy: 0,
  dx: 0,
  width: 20,
  height: 20,
  move() {
    if (this.dy) {
      this.y += this.dy;
    }
    if (this.dx) {
      this.x += this.dx;
    }
  },
  start() {
    this.dy = -this.velocity;
    this.dx = game.random(-this.velocity, +this.velocity);
  },
  collide(elem) {
    let x = this.x + this.dx;
    let y = this.y + this.dy;

    let ballTop = y;
    let ballRight = x + this.width;
    let ballBottom = y + this.height;
    let ballLeft = x;

    let elemTop = elem.y;
    let elemRight = elem.x + elem.width;
    let elemBottom = elem.y + elem.height;
    let elemLeft = elem.x;

    if (
      ballTop < elemBottom &&
      ballRight > elemLeft &&
      ballBottom > elemTop &&
      ballLeft < elemRight
    ) {
      return true;
    } else {
      return false;
    }
  },
  collideWorldBounds() {
    let x = this.x + this.dx;
    let y = this.y + this.dy;

    let ballTop = y;
    let ballRight = x + this.width;
    let ballBottom = y + this.height;
    let ballLeft = x;

    let worldTop = 0;
    let worldRight = game.width;
    let worldBottom = game.height;
    let worldLeft = 0;

    if (ballRight > worldRight) {
      this.x = game.width - this.width;
      this.dx = -this.velocity;
      game.sounds.bump.play();
    } else if (ballLeft < worldLeft) {
      this.x = 0;
      this.dx = this.velocity;
      game.sounds.bump.play();
    } else if (ballTop < worldTop) {
      this.y = 0;
      this.dy = this.velocity;
      game.sounds.bump.play();
    } else if (ballBottom > worldBottom) {
      game.end('Its a fiasco bro');
    }
  },

  bumbBlock(block) {
    this.dy *= -1;
    block.active = false;
  },
  bumbPlatform(platform) {
    if (this.dy > 0) {
      this.dy = -this.velocity;
      let touchX = this.x + this.width / 2;
      this.dx = this.velocity * platform.gettTouchOffset(touchX);
    }
  },
};
game.platform = {
  velocity: 5,
  dx: 0,
  x: 280,
  y: 300,
  width: 100,
  height: 14,
  ball: game.ball,
  move() {
    if (this.dx) {
      this.x += this.dx;

      if (this.ball) {
        this.ball.x += this.dx;
      }
    }
  },
  start(direction) {
    if (direction == KEYS.LEFT) {
      this.dx = -this.velocity;
    } else if (direction == KEYS.RIGHT) {
      this.dx = this.velocity;
    }
  },
  fire() {
    if (this.ball) {
      this.ball.start();
      this.ball = null;
    }
  },
  stop() {
    this.dx = 0;
  },
  gettTouchOffset(x) {
    let diff = this.x + this.width - x;
    let offset = this.width - diff;

    result = (2 * offset) / this.width;
    return result - 1;
  },
};

window.addEventListener('load', () => {
  game.start();
});
