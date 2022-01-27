'use strict';


(() => {
    // 乱数を定義
    // ボールが生成される位置や速度をランダムにする
function rand(min, max) {
return Math.random() * (max - min) + min;
}

class Ball {
    // canvas要素の取得
constructor(canvas) {
    // 描画コンテストを取得
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    // ボールの大きさ、乱数を使用
    this.x = rand(30, 250);
    this.y = 30;
    this.r = 10;
    // ボールを動かすコード
    // ボールの速さ、乱数を使用
    this.vx = rand(3, 5) * (Math.random() < 0.5 ? 1 : -1);
    this.vy = rand(3, 5);
    this.isMissed = false;
}

getMissedStatus() {
    return this.isMissed;
}

// ボールの跳ね返り
bounce() {
    this.vy *= -1;
}

reposition(paddleTop) {
    this.y = paddleTop - this.r;
}

getX() {
    return this.x;
}

getY() {
    return this.y;
}

getR() {
    return this.r;
}

// 跳ね返すときの変化
update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y - this.r > this.canvas.height) {
        this.isMissed = true;
    }
    
    // ボールが跳ね返るようにする
    // 半径を考慮する(this r）
    if (
        // 左の壁に当たった場合
    this.x - this.r < 0 ||
    this.x + this.r > this.canvas.width
    ) {
        //-1を掛けて向きを逆にしている
    this.vx *= -1;
    }

    if (
        // 右の壁に当たった場合
    this.y - this.r < 0
    ) {
        // -1を掛けて向きを逆にしている
    this.vy *= -1;
    }
}

// 円の描画
draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#fdfdfd';
    // 円の式
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fill();
}
}

// パドルBの作成
class paddleB {
    // canvasとgameクラスで受ける
constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.ctx = this.canvas.getContext('2d');
    // パドルの大きさを決める
    this.w = 30;
    this.h = 8;
    // パドルの位置
    this.x = this.canvas.width / 2 - (this.w / 2);
    this.y = this.canvas.height - 45;
  
}

update(ball) {
    const ballBottom = ball.getY() + ball.getR();
    const paddleBTop = this.y;
    const ballTop = ball.getY() - ball.getR();
    const paddleBBottom = this.y + this.h;
    const ballCenter = ball.getX();
    const paddleBLeft = this.x;
    const paddleBRight = this.x + this.w;
    
    // パドルがボールを跳ね返す条件
    if (
    ballBottom > paddleBTop &&
    ballTop < paddleBBottom &&
    ballCenter > paddleBLeft &&
    ballCenter < paddleBRight
    ) {
    ball.bounce();
    ball.reposition(paddleBTop);
    this.game.addScore();
    }

    // パドルBの基準を決める
    // どこからどこまでをパドルとみなすか
    const rect = this.canvas.getBoundingClientRect();
    this.x = this.mouseX - rect.left - (this.w / 2);

    if (this.x < 0) {
    this.x = 0;
    }
    if (this.x + this.w > this.canvas.width) {
    this.x = this.canvas.width - this.w;
    }
}

// パドルの描画
draw() {
    this.ctx.fillStyle = '#fdfdfd';
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
}
}

// パドルの作成
class Paddle {
    // canvasとgameクラスで受ける
constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.ctx = this.canvas.getContext('2d');
    // パドルの大きさを決める
    this.w = 60;
    this.h = 16;
    // パドルの位置
    this.x = this.canvas.width / 2 - (this.w / 2);
    this.y = this.canvas.height - 32;
    // x方向にしか動かさない
    this.mouseX = this.x;
    this.addHandler();
}



// マウスの動きに合わせる
addHandler() {
    document.addEventListener('mousemove', e => {
    this.mouseX = e.clientX;
    });
}

// ボールの範囲の定義
update(ball) {
    const ballBottom = ball.getY() + ball.getR();
    const paddleTop = this.y;
    const ballTop = ball.getY() - ball.getR();
    const paddleBottom = this.y + this.h;
    const ballCenter = ball.getX();
    const paddleLeft = this.x;
    const paddleRight = this.x + this.w;
    
    // パドルがボールを跳ね返す条件
    if (
    ballBottom > paddleTop &&
    ballTop < paddleBottom &&
    ballCenter > paddleLeft &&
    ballCenter < paddleRight
    ) {
    ball.bounce();
    ball.reposition(paddleTop);
    this.game.addScore();
    }

    // パドルの基準を決める
    // どこからどこまでをパドルとみなすか
    const rect = this.canvas.getBoundingClientRect();
    this.x = this.mouseX - rect.left - (this.w / 2);

    if (this.x < 0) {
    this.x = 0;
    }
    if (this.x + this.w > this.canvas.width) {
    this.x = this.canvas.width - this.w;
    }
}

// パドルの描画
draw() {
    this.ctx.fillStyle = '#fdfdfd';
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
}
}

// gameを管理するクラス
class Game {
constructor(canvas) {
    this.canvas = canvas;
    // 描画範囲
    this.ctx = this.canvas.getContext('2d');
    // ボール
    this.ball = new Ball(this.canvas);
    // パドル        
    this.paddle = new Paddle(this.canvas, this);
    this.paddleB = new paddleB(this.canvas,this)
    this.loop();
    // ゲーム終了
    this.isGameOver = false;
    // スコア
    this.score = 0;
}

addScore() {
    this.score++;
}

// ゲームループ＝ゲーム内の情報を更新して書き換えなおすこと
loop() {
    if (this.isGameOver) {
    return;
    }

    this.update();
    this.draw();

    // 描画処理に最適化
    requestAnimationFrame(() => {
    this.loop();
    });
}

// ボールに関するゲームループ
update() {
    this.ball.update();
    this.paddle.update(this.ball);
    this.paddleB.update(this.ball,this.paddle);

    // ゲームオーバーしたとき
    if (this.ball.getMissedStatus()) {
    this.isGameOver = true;
    }
}

draw() {
    if (this.isGameOver) {
    this.drawGameOver();
    return;
    }

    // 描画を一新する（画面全体をクリアする）
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw();
    this.paddle.draw();
    this.paddleB.draw();
    this.drawScore();
}

// GameOverという表示を出す
drawGameOver() {
    this.ctx.font = '28px "Arial Black"';
    this.ctx.fillStyle = 'tomato';
    this.ctx.fillText('GAME OVER', 50, 150);
}

// スコアの記入
drawScore() {
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#fdfdfd';
    this.ctx.fillText(this.score, 10, 25);
}
}

const canvas = document.querySelector('canvas');
if (typeof canvas.getContext === 'undefined') {
return;
}

new Game(canvas);
})();