var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var raf;
var running = false;
var endGame = false;
var speed = 20;
var maxSpeed = 50;
var blocks = [];
var score = 0;
var mousemode = false;
var paused = true;
var Keys = {
  up: false,
  down: false,
  left: false,
  right: false
};
var hsl = 0;
var mx = 0;

var piece = {
  x: 100,
  y: 500,
  vx: 1,
  vy: 3,
  radius: 10,
  height: this.radius,
  width: this.radius,
  color: 'hsl(' + hsl + ',100%,50%)',
  draw: function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    piece.color = 'hsl(' + hsl + ',100%,50%)';
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};


var paddle = {
  x: 200,
  y: window.innerHeight - 50,
  vx: 2,
  vy: 0,
  height: 15,
  width: 150,
  radius: 25,
  color: 'white',
  draw: function () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}


function clear() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clear();
  if(paused == true)
  {
    var ctx = canvas.getContext("2d");
      ctx.font = "40px Arial";
      ctx.color = 'white'
      ctx.fillStyle = 'white'
      ctx.fillText("Press the space key to start! " , canvas.width / 2 - 250, canvas.height / 2);
  }
  getColor();

  checkCollisions();
  ball.draw();
  if (mousemode == true) {
    paddle.x = mx - (paddle.width / 2)
  }
  paddle.draw();
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y + ball.radius + ball.vy > canvas.height) {
    ball.vy = 0;
    ball.vx = 0;
    gameOver();
    return;
  }
  if (ball.y - ball.radius + ball.vy < 0) {
    ball.vy = -ball.vy;
  }
  if (ball.x + ball.radius + ball.vx > canvas.width || ball.x - ball.radius + ball.vx < 0) {
    ball.vx = -ball.vx;
  }
  if (endGame == true) {
    gameOver();
  }
  drawScore();
  if (paused == false && endGame == false) {
    raf = window.requestAnimationFrame(draw);
  }

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function getColor() {
  if (hsl <= 360) {
    hsl++;
  } else {
    hsl = 0;
  }
}