let game = {
  start: function () {
    this.ctx = document.getElementById('mycanvars').getContext('2d');
    let bg = new Image();
    bg.src = './img/background.png';

    window.requestAnimationFrame(() => {
      this.ctx.drawImage(bg, 0, 0);
    });
  },
};

window.addEventListener('load', () => {
  game.start();
});
