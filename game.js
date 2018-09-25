var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
var chips = [];
var validChips = [];
var red = 0;
var white = 0;
var total = 0;
var playerScore = 0;
var aiScore = 0;
debug = true;
var player = "red"
var validMoves = [];
var score = [
    [100, -1, 5, 2, 2, 5, -1, 100],
    [-1, -10, 1, 1, 1, 1, -10, -1],
    [5, 1, 1, 1, 1, 1, 1, 5],
    [2, 1, 1, 0, 0, 1, 1, 2],
    [2, 1, 1, 0, 0, 1, 1, 2],
    [5, 1, 1, 1, 1, 1, 1, 5],
    [-1, -10, 1, 1, 1, 1, -10, -1],
    [100, -1, 5, 2, 2, 5, -1, 100]
]

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

class Move {
    constructor(score, row, col) {
        this.score = score;
        this.row = row;
        this.col = col
    }

}

/**
 * Places a chip at the following position [COL,ROW] with the color COLOR
 * @param  {} col Column Number
 * @param  {} row Row Number
 * @param  {} color Color as a string
 */
function placeChip(col, row, color) {
    new chip(row, col, color);
}
/**
 * Highlights the specified cell in a light grey
 * @param  {} col
 * @param  {} row
 */
function highlight(col, row) {
    if (col == -1 || row == -1) {
        draw();
        return;
    }
    draw();
    ctx.fillStyle = "rgba(255,255, 255, .1)";
    ctx.fillRect((row * 90) + 40, (col * 90) + 40, 90, 90);

}

/**
 * Gets the current count of all pieces
 */
function getCounts() {
    red = 0;
    white = 0;
    total = 0;
    for (var i = 0; i < chips.length; i++) {
        total++;
        if (chips[i].color == "red") {
            red++;
        } else {
            white++;
        }
    }
    log("Red Chips: " + red);
    log("White Chips: " + white);
    log("Total Chips: " + total);
    if (total != red + white) {
        log("Chip Count Error!")
    }
}



/**
 * Handles the mouse move event inside the canvas element
 * @param  {} e mouse move event
 */
function handleMouseMove(e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var coordinates = getGridNumber(mouseX, mouseY);
    if (player == "red") {
        isValidMove(coordinates.col, coordinates.row, "red");
    } else {
        isValidMove(coordinates.col, coordinates.row, "white");
    }

}
/**
 * Handles the mouse click event inside the canvas element
 * @param  {} e mouse click event
 */
function handleMouseClick(e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var coordinates = getGridNumber(mouseX, mouseY);
    if (checkDuplicate(coordinates.col, coordinates.row) == false && coordinates.col != -1 && coordinates.row != -1) {
        if (validChips.length > 0) {
            if (player == "red") {
                placeChip(coordinates.col, coordinates.row, "red")
                for (var i = 0; i < validChips.length; i++) {
                    validChips[i].flip();
                }
                player = "white";
            } else {
                placeChip(coordinates.col, coordinates.row, "white")
                for (var i = 0; i < validChips.length; i++) {
                    validChips[i].flip();
                }
                player = "red";
            }


        }

    } else {

    }
    getCounts();
}
/**
 * gets the grid number of the mouse pointer
 * @param  {} mouseX
 * @param  {} mouseY
 * @returns position object
 */
function getGridNumber(mouseX, mouseY) {
    var col = Math.floor((mouseX + 40) / 90)
    var row = Math.floor((mouseY + 40) / 90);
    col--;
    row--;
    if (col > 7) {
        col = -1;
    }
    if (row > 7) {
        row = -1;
    }
    if (col < 0) {
        col = -1;
    }
    if (row < 0) {
        row = -1;
    }
    var position = new pos(col, row);
    return position;
}
/**
 * clears the canvas. gets called at the beginning of every draw
 */
function clear() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/**
 * main draw function that re-draws the entire screen
 */
function draw() {
    clear();
    drawGrid();
    for (var i = 0; i < chips.length; i++) {
        chips[i].draw();
    }
}

function AIPlay() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            isValidMove(i, j);
            if (validChips.length > 0) {
                validMoves.push(new Move(score[i][j], [i], [j]))
            }
        }
    }
    
}

function isValidMove(col, row, color) { //color is the color of the piece that is about to drop, ie the color of the current player
    if (checkPosition(col, row) != null) {
        return;
    }

    validChips = [];

    // var curr = checkPosition(col, row);
    // var color = curr.color;

    /** move offset for row */
    const sOFFSET_MOVE_ROW = [-1, -1, -1, 0, 0, 1, 1, 1];
    /** move offset for column */
    const sOFFSET_MOVE_COL = [-1, 0, 1, -1, 1, -1, 0, 1];

    for (var i = 0; i < 8; i++) {
        var curRow = row + sOFFSET_MOVE_ROW[i];
        var curCol = col + sOFFSET_MOVE_COL[i];
        var hasStuffBetween = false;
        var tempChildren = [];
        log("COL: " + curCol + "," + "ROW: " + curRow)
        while (row >= 0 && row < 8 && col >= 0 && col < 8) {

            log(curRow + "," + curCol)
            var somePiece = checkPosition(curCol, curRow);
            if (somePiece == null) { //Empty Space
                break;
            } else if (somePiece.color == color) { //Same Color Piece, not valid
                if (hasStuffBetween == true) {
                    for (var j = 0; j < tempChildren.length; j++) {
                        validChips.push(tempChildren[j]);
                    }
                }
                break;
            } else {
                hasStuffBetween = true;
                tempChildren.push(somePiece);
            }
            curRow += sOFFSET_MOVE_ROW[i];
            curCol += sOFFSET_MOVE_COL[i];

        }
    }
    log(validChips)
    if (validChips.length > 0) {

        highlight(row, col);
    } else {
        draw();
    }
}


/**
 * Checks to see if there is already a chip in the specified space
 * @param  {} col Column Number
 * @param  {} row Row Number
 * @returns boolean
 */
function checkDuplicate(col, row) {
    // for (var i = 0; i < chips.length; i++) {
    //   if (chips[i].row == row && chips[i].col == col) {
    //     if(debug)
    //     {
    //       chips[i].flip();
    //     }
    //     return true;
    //   }
    // }
    // return false;
    return chips.some(chip => (chip.row == row && chip.col == col));

}

function getNeighbors(row, col, color) {
    let redChips = chips.filter(chip => (chip.row - row <= 1 && chip.row - row >= -1 &&
        chip.col - col <= 1 && chip.col - col >= -1 && (chip.col - col != 0 || chip.row - row != 0) &&
        chip.color != color))
    console.log({
        row,
        col
    })
    console.table(redChips)
}

/**
 * Checks to see if there is a chip in the specified row and column
 * @param  {} col Column Number
 * @param  {} row Row Number
 * @returns boolean
 */
function checkPosition(col, row) {
    for (var i = 0; i < chips.length; i++) {
        if (chips[i].row == row && chips[i].col == col) {
            return chips[i];
        }
    }
    return null;
}



/**
 * pauses execution of the JS for the specified time in milliseconds. No IE
 * @param  {} ms time in milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * removes an element from the specified array
 * @param  {} array
 * @param  {} element
 */
function remove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
/**
 * Draws the grid 
 */
function drawGrid() {
    const p = 40;
    const bw = canvas.width - (p * 2);
    const bh = canvas.height - (p * 2);
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

function log(string) {
    if (debug) {
        console.log(string)
    }

}

function newGame() {
    new chip(3, 3, "white");
    new chip(4, 4, "white");
    new chip(3, 4, "red");
    new chip(4, 3, "red");
    draw();
}

newGame();