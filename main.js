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
    this.enemies_moving_direction = "right";
    this.user_moving_direction = null;
    this.start = true;
    this.enemies_speed = 2;
    this.user_speed = 2;
    this.user_bullets = [];
    this.user_bullets_speed = 4;
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

  set_user_bullets() {
    this.user_bullets.push({
      x: this.user.x + 5,
      y: this.user.y - 4,
      w: 1,
      h: 4,
    });
  }

  // --------- updating params ---------

  update() {
    this.update_enemies();
    this.update_user_bullets();

    this.draw();

    this.start ? window.requestAnimationFrame(() => this.update()) : null;
  }

  update_enemies_moving_direction() {
    this.enemies.forEach((enemy) => {
      if (this.enemies[0].x < 1 && this.enemies_moving_direction === "left") {
        this.enemies_moving_direction = "right";
      }
      if (
        this.enemies[this.enemies.length - 1].x > this.width - 10 &&
        this.enemies_moving_direction === "right"
      ) {
        this.enemies_moving_direction = "left";
      }
    });
  }

  update_enemies() {
    this.update_enemies_moving_direction();

    this.enemies.forEach((enemy) => {
      if (this.enemies_moving_direction === "left") {
        enemy.x -= this.enemies_speed;
      } else {
        enemy.x += this.enemies_speed;
      }
    });
  }

  update_user_bullets() {
    for (let i = 0; i < this.user_bullets.length; i++) {
      const bullet = this.user_bullets[i];

      if (bullet.y < -this.user_bullets_speed) {
        this.user_bullets.splice(i, 1);
      } else {
        bullet.y -= this.user_bullets_speed;
      }
    }
  }

  update_user(key) {
    if (key === "left") {
      this.user.x -= this.user_speed;
    } else {
      this.user.x += this.user_speed;
    }

    this.user_moving_direction = key;
  }

  update_start(status) {
    this.start = status;

    this.update();
  }

  // --------- drawing canvas elements ---------

  draw() {
    this.cleaning_ways();

    this.draw_user_bullets();
    this.draw_barriers();
    this.draw_enemies();
    this.draw_user();
  }

  draw_user_bullets() {
    this.ctx.fillStyle = "#fff00f";

    this.user_bullets.forEach((bullet) => {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    });
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

  // --------- cleaning canvas elements ---------

  cleaning_ways() {
    this.cleaning_user_bullets_way();
    this.cleaning_enemies_ways();
    this.cleaning_user_way();
  }

  cleaning_enemies_ways() {
    let way = 10;

    this.ctx.fillStyle = "#000";

    if (this.enemies_moving_direction === "left") {
      way = 10;
    } else {
      way = -10;
    }

    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(enemy.x + way, enemy.y, enemy.w, enemy.h);
    });
  }

  cleaning_user_bullets_way() {
    this.ctx.fillStyle = "#000";

    this.user_bullets.forEach((bullet) => {
      this.ctx.fillRect(
        bullet.x,
        bullet.y + this.user_bullets_speed,
        bullet.w,
        bullet.h
      );
    });
  }

  cleaning_user_way() {
    this.ctx.fillStyle = "#000";
    let way = this.user_speed;

    if (this.user_moving_direction !== null) {
      if (this.user_moving_direction === "left") {
        way = this.user_speed;
      } else if (this.user_moving_direction === "right") {
        way = -this.user_speed;
      }
      this.ctx.fillRect(
        this.user.x + way,
        this.user.y,
        this.user.w,
        this.user.h
      );
    }
  }
}

let game = new Game();

window.addEventListener("load", game.init());
document.documentElement.addEventListener("keydown", (e) => {
  // console.log(e.key, e.keyCode);

  if (e.keyCode === 27) {
    // if pressed "ESC"
    game.update_start(!game.start);
  }

  if (e.keyCode === 37) {
    game.update_user("left");
  } else if (e.keyCode === 39) {
    game.update_user("right");
  }

  if (e.keyCode === 38) {
    game.set_user_bullets();
  }
});
