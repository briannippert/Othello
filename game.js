var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
var chips = [];

class pos {
  constructor(col, row) {
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
  constructor(col, row, color) {
    this.row = col;
    this.col = row;
    this.radius = 30;
    this.color = color;
    this.x = (this.col * 90) + 85;
    this.y = (this.row * 90) + 85;
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
  new chip(row, col, color);
}

function highlight(col, row) {
  draw();
  ctx.fillStyle = "rgba(255,255, 255, .1)";
  ctx.fillRect((row * 90) + 40, (col * 90) + 40, 90, 90);

}


function handleMouseMove(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  var coordinates = getGridNumber(mouseX, mouseY);
  highlight(coordinates.row, coordinates.col)
}

function handleMouseClick(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  var coordinates = getGridNumber(mouseX, mouseY);
  if (checkDuplicate(coordinates.col, coordinates.row) == false) {
    placeChip(coordinates.col, coordinates.row, "red")
  } else {
    console.log("Duplicate Chip");
  }


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
  return position;
}

function clear() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clear();
  drawGrid();
  for (var i = 0; i < chips.length; i++) {
    chips[i].draw();
  }


}

function checkDuplicate(col, row) {
  for (var i = 0; i < chips.length; i++) {
    if (chips[i].row == row && chips[i].col == col) {
      return true;
    } else {
      return false;
    }
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
new chip(3, 3, "white")
new chip(4, 4, "white")
new chip(3, 4, "red")
new chip(4, 3, "red")