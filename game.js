var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
var chips = [];

class chip{
    constructor(x,y,color)
    {
        this.x = x;
        this.y = y;
        this.radius = 40;
        this.color = color;
        this.draw();
        chips.push(this);
    }
    draw()
    {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
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

function drawGrid(){
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext("2d");
  const bw = 400;
  const bh = 400;
  const p = 10;

  for (let x = 0; x <= bw; x +=40){
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, bh + p);
  }

  for (var x = 0; x <= bh; x += 40) {
    context.moveTo(p, 0.5 + x + p);
    context.lineTo(bw + p, 0.5 + x + p);
  }

  context.strokeStyle = "#FFFFFF";
  context.stroke();
}
drawGrid();
clear();
