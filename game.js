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

clear();
