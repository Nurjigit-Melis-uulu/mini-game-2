class Game {
  constructor() {
    this.cnv = null;
    this.ctx = null;
    this.height = 300;
    this.width = 600;
    this.user = {
      x: 295,
      y: 280,
      w: 10,
      h: 10,
      color: "blue",
    };
    this.barriers = [
      { x: 194, y: 240, w: 12, h: 12 },
      { x: 388, y: 240, w: 12, h: 12 },
    ];
    this.enemies = [];
  }

  // --------- initialization ---------

  init() {
    this.set_cnv();
    this.set_size();
    // this.set_barriers();
    this.set_enemies();
    this.update();

    document.querySelector("body").appendChild(this.cnv);
  }

  set_cnv() {
    this.cnv = document.createElement("canvas");
    this.ctx = this.cnv.getContext("2d");
  }

  set_size() {
    this.cnv.width = this.width;
    this.cnv.height = this.height;
  }

  // set_barriers() {
  //   this.barriers[0].x = this.width / 3;
  //   this.barriers[0].y = 240;

  //   this.barriers[1].x = (this.width / 3) * 2;
  //   this.barriers[1].y = 240;
  // }

  set_enemies() {
    let enemy = {};
    let interval = {
      x: 20,
      y: 0,
    };

    for (let i = 0; i < 5; i++) {
      for (let y = 0; y < 5; y++) {
        enemy = {
          x: 235 + interval.x,
          y: 20 + interval.y,
          w: 10,
          h: 10,
        };

        interval.x += 20;

        this.enemies.push(enemy);
      }

      interval.x = 20;
      interval.y += 20;
    }

    console.log(this.enemies);
  }

  // --------- updating params ---------

  update() {
    this.draw();

    window.requestAnimationFrame(() => this.update());
  }

  // --------- drawing canvas elements ---------

  draw() {
    this.draw_barriers();
    this.draw_enemies();
    this.draw_user();
  }

  draw_barriers() {
    this.ctx.fillStyle = "#fff";

    this.barriers.forEach((barrier) => {
      this.ctx.fillRect(barrier.x, barrier.y, barrier.w, barrier.h);
    });
  }

  draw_enemies() {
    this.ctx.fillStyle = "#fff";

    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    });
  }

  draw_user() {
    this.ctx.fillStyle = this.user.color;

    this.ctx.fillRect(this.user.x, this.user.y, this.user.w, this.user.h);
  }
}

let game = new Game();

window.addEventListener("load", game.init());
