var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
var chips = [];

class pos {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
  getRow() {
    return this.row
  }
  getCol() {
    return this.col
  }
}

class chip {
  constructor(row, col, color) {
    this.row = row;
    this.col = col;
    this.radius = 30;
    this.color = color;
    this.y = (this.col * 90) + 85;
    this.x = (this.row * 90) + 85;
    this.draw();
    chips.push(this);
  }
  flip() {
    if (this.color == "red") {
      this.color = "white"
    } else {
      this.color = "red"
    }
    this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function placeChip(col, row, color) {

}

function highlight(row, col) {

}


function handleMouseMove(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  getGridNumber(mouseX, mouseY);

}

function getGridNumber(mouseX, mouseY) {
  var col = Math.floor((mouseX + 40) / 90)
  var row = Math.floor((mouseY + 40) / 90);
  col--;
  row--;
  if (col > 7) {
    col = 7;
  }
  if (row > 7) {
    col = 7;
  }
  if (col < 0) {
    col = 0;
  }
  if (row < 0) {
    col = 0;
  }
  console.log("[" + col + "," + row + "]");
  var position = new pos(col, row);
}

function clear() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {

  clear();

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

function drawGrid() {
  const p = 40;

  const bw = canvas.width - (p * 2);
  const bh = canvas.height - (p * 2);

  console.log({
    bw,
    bh
  })
  for (let x = 0; x <= bw; x += 90) {
    ctx.moveTo(0.5 + x + p, p);
    ctx.lineTo(0.5 + x + p, bh + p);
  }

  for (var x = 0; x <= bh; x += 90) {
    ctx.moveTo(p, 0.5 + x + p);
    ctx.lineTo(bw + p, 0.5 + x + p);
  }

  ctx.strokeStyle = "red";
  ctx.stroke();
}
clear();
drawGrid();
new chip(0, 2, "red")
new chip(0, 0, "red")
new chip(2, 0, "red")
new chip(2, 2, "red")
new chip(0, 2, "red")
new chip(3, 1, "red")
new chip(2, 0, "red")
new chip(7, 4, "red")
new chip(3, 2, "red")
new chip(4, 0, "red")
new chip(2, 6, "red")
new chip(7, 7, "red")