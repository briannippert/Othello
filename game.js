var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
var chips = [];

class chip{
    constructor(row,col,color)
    {
        this.row = row;
        this.col = col;
        this.radius = 35;
        this.color = color;
        this.x = (this.row * 110) + 45;
        this.y = (this.col * 110) + 45;
        this.draw();
        chips.push(this);
    }
    flip()
    {
      if(this.color == "red")
      {
        this.color ="white"
      }
      else
      {
        this.color ="red"
      }
     this.draw();
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

class board{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.color = "#00FFFF";
        this.draw();
    }
    draw()
    {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
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
  const p = 40;

  const bw = canvas.width - (p * 2) ;
  const bh = canvas.height - (p * 2) ;

  console.log({bw,bh})
  for (let x = 0; x <= bw; x += 90){
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
