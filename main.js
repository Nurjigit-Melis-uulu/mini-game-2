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
      bullet_color: "aqua",
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
    this.user_speed = 5;
    this.user_bullets = [];
    this.user_bullets_speed = 4;
    this.enemy_bullets = [];
    this.enemy_bullets_speed = 4;
    this.timeInterval = null;
  }

  // --------- initialization ---------

  init() {
    this.set_cnv();
    this.set_size();
    // this.set_barriers();
    this.set_enemies();
    this.update();
    this.set_interval();

    document.querySelector("body").prepend(this.cnv);
  }

  set_interval() {
    this.timeInterval = setInterval(() => {
      let r = Math.floor(Math.random() * this.enemies.length);
      this.enemies.length > 0
        ? this.set_enemy_bullets(this.enemies[r])
        : this.game_over("win");
    }, 200);
  }

  set_cnv() {
    this.cnv = document.createElement("canvas");
    this.ctx = this.cnv.getContext("2d");
  }

  set_size() {
    if (window.innerWidth < 600) {
      this.cnv.width = this.width = window.innerHeight;
      this.cnv.height = this.height = window.innerWidth;
    } else {
      this.cnv.width = this.width = 600;
      this.cnv.height = this.height = 300;
    }
  }

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
  }

  set_user_bullets() {
    this.user_bullets.push({
      x: this.user.x + 5,
      y: this.user.y - 4,
      w: 1,
      h: 4,
    });
  }

  set_enemy_bullets(enemy) {
    this.enemy_bullets.push({
      x: enemy.x + enemy.w / 2,
      y: enemy.y + enemy.h,
      w: 1,
      h: 4,
    });
  }

  // --------- updating params ---------

  update() {
    this.draw();

    this.enemies ? this.update_enemies() : null;
    this.enemy_bullets ? this.update_enemy_bullets() : null;
    this.user_bullets ? this.update_user_bullets() : null;
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

      if (
        bullet.y < -this.user_bullets_speed ||
        this.check_bullet_hit_to_barriers(bullet)
      ) {
        this.user_bullets.splice(i, 1);
      } else {
        bullet.y -= this.user_bullets_speed;
      }
    }

    this.check_user_hits();
  }

  update_enemy_bullets() {
    for (let i = 0; i < this.enemy_bullets.length; i++) {
      const bullet = this.enemy_bullets[i];

      if (bullet.y > this.height || this.check_bullet_hit_to_barriers(bullet)) {
        this.enemy_bullets.splice(i, 1);
      } else {
        bullet.y += this.enemy_bullets_speed;
      }
    }

    this.check_enemy_hits();
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

  // --------- checking ---------

  check_enemy_hits() {
    this.enemy_bullets.forEach((bullet) => {
      if (
        bullet.y >= this.user.y &&
        bullet.y <= this.user.y + this.user.h &&
        bullet.x >= this.user.x &&
        bullet.x <= this.user.x + this.user.w
      ) {
        this.game_over("lose");
      }
    });
  }

  check_user_hits() {
    this.user_bullets.forEach((bullet) => {
      for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];

        if (
          bullet.y >= enemy.y &&
          bullet.y <= enemy.y + enemy.h &&
          bullet.x >= enemy.x &&
          bullet.x <= enemy.x + enemy.w
        ) {
          this.enemies.splice(i, 1);
          this.cleaning_dead_enemy(enemy);
        }
      }
    });
  }

  check_bullet_hit_to_barriers(bullet) {
    let result = false;
    this.barriers.forEach((barrier) => {
      if (
        bullet.y >= barrier.y &&
        bullet.y <= barrier.y + barrier.h &&
        bullet.x >= barrier.x &&
        bullet.x <= barrier.x + barrier.w
      ) {
        result = true;
      }
    });

    return result;
  }

  // --------- drawing canvas elements ---------

  draw() {
    this.cleaning_ways();

    this.user_bullets ? this.draw_user_bullets() : null;
    this.enemy_bullets ? this.draw_enemy_bullets() : null;
    this.draw_barriers();
    this.draw_enemies();
    this.draw_user();
  }

  draw_user_bullets() {
    this.ctx.fillStyle = this.user.bullet_color;

    this.user_bullets.forEach((bullet) => {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    });
  }

  draw_enemy_bullets() {
    this.ctx.fillStyle = "#fff00f";

    this.enemy_bullets.forEach((bullet) => {
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
    this.user_bullets ? this.cleaning_user_bullets_way() : null;
    this.enemy_bullets ? this.cleaning_enemy_bullets_way() : null;
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

  cleaning_enemy_bullets_way() {
    this.ctx.fillStyle = "#000";

    this.enemy_bullets.forEach((bullet) => {
      this.ctx.fillRect(
        bullet.x,
        bullet.y - this.enemy_bullets_speed,
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

  cleaning_dead_enemy(enemy) {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(enemy.x - 4, enemy.y, enemy.w + 8, enemy.h);
  }

  // --------- game over ---------

  game_over(status) {
    clearInterval(this.timeInterval);
    console.log("game over", status);
    this.start = false;

    document.querySelector(".window").style.display = "block";
    document.querySelector(".info").innerText = "you are " + status;
  }

  // --------- restart game ---------

  restart() {
    this.user = {
      x: 295,
      y: 280,
      w: 10,
      h: 10,
      color: "blue",
      bullet_color: "aqua",
    };
    this.enemies = [];
    this.enemies_moving_direction = "right";
    this.user_moving_direction = null;
    this.start = true;
    this.user_bullets = [];
    this.enemy_bullets = [];
    this.timeInterval = null;

    document.querySelector(".window").style.display = "none";

    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.set_enemies();
    this.update();
    this.set_interval();
  }
}

let game = new Game();
let restart_btn = document.querySelector(".restart");
let fire_btn = document.querySelector("#fire");
let left_btn = document.querySelector("#left");
let right_btn = document.querySelector("#right");

window.addEventListener("load", () => game.init());
window.addEventListener("resize", () => game.set_size());

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
  }
});

fire_btn.addEventListener("mousedown", () => game.set_user_bullets());
left_btn.addEventListener("mousedown", () => game.update_user("left"));
right_btn.addEventListener("mousedown", () => game.update_user("right"));

restart_btn.addEventListener("click", () => game.restart());
