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
var validRedMoves = [];

var haveWeShownScoreYet = false;
var PlayerTwo = false;
var noMoves = false;
const redScore = document.getElementById("redScore");
const whiteScore = document.getElementById("whiteScore");

var gamestate = []
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

var baseScore = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

var moves = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]


const initMoves = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fill();
    }
}

class Move {
    constructor(score, col, row, chipsToFlip, chipList) {
        this.score = score;
        this.row = row;
        this.col = col;
        this.chipsToFlip = chipsToFlip;
        this.chipList = chipList;
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
    // log("Red Chips: " + red);
    // log("White Chips: " + white);
    // log("Total Chips: " + total);
    if (total != red + white) {
        log("Chip Count Error!")
    }

    redScore.innerHTML = red;
    whiteScore.innerHTML = white;
}



/**
 * Handles the mouse move event inside the canvas element
 * @param  {} e mouse move event
 */
function handleMouseMove(e) {
    if (player == "red") {
        var mouseX = e.clientX - canvas.offsetLeft + 10;
        var mouseY = e.clientY - canvas.offsetTop + 10;
        var coordinates = getGridNumber(mouseX, mouseY);
        if (player == "red") {
            isValidMove(coordinates.col, coordinates.row, "red");
        }

    }
}
/**
 * Handles the mouse click event inside the canvas element
 * @param  {} e mouse click event
 */
async function handleMouseClick(e) {
    var mouseX = e.clientX - canvas.offsetLeft + 10;
    var mouseY = e.clientY - canvas.offsetTop + 10;
    var coordinates = getGridNumber(mouseX, mouseY);
    if (checkDuplicate(coordinates.col, coordinates.row) == false && coordinates.col != -1 && coordinates.row != -1) {
        if (validChips.length > 0) {
            if (player == "red") {
                log("You Played: " + coordinates.col + "," + coordinates.row + " Score: " + "2 Bananas");
                placeChip(coordinates.col, coordinates.row, "red");
                gamestate.push(new Move(0, coordinates.col, coordinates.row, 0, validChips))

                iMoved(coordinates.col, coordinates.row, "red")
                for (var i = 0; i < validChips.length; i++) {
                    validChips[i].flip();
                }
                player = "white";
                draw()
                //await sleep(500)
                AIPlay();
            }
        }
    }
    getCounts();
}


function passTurn() {
    player = "white";
    AIPlay();
}

function turnComputerOn() {
    PlayerTwo = true;
    doesRedHaveAvailableMoves();
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
    clear();
    drawGrid();
    for (var i = 0; i < chips.length; i++) {
        chips[i].draw();
    }

    winCondition();
}

function AIPlay() {

    validMoves = [];
    var tieMoves = [];
    //log(validMoves)
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (checkDuplicate(c, r) == true) {
                continue;
            }
            isValidMove(c, r, "white");
            if (validChips.length > 0) {
                validMoves.push(new Move(baseScore[c][r], c, r, validChips.length, validChips))

            }
        }
    }
    var bestMove = new Move(-1000, -1, -1, 0);
    for (var i = 0; i < validMoves.length; i++) {
        if (validMoves[i].score > bestMove.score) {
            bestMove = validMoves[i];
        } else if (validMoves[i].score == bestMove.score) {
            tieMoves.push(validMoves[i]);
            //if (validMoves[i].chipsToFlip > bestMove.chipsToFlip) {
            //   bestMove = validMoves[i];
            // }
        }
    }
    if (bestMove.col < 0) {
        winCondition();
        noMoves = true;
        player = "red";
        return;
    } else {
        noMoves = false;
    }
    if (bestMove.score <= tieMoves[0].score && tieMoves.length > 0) {
        var move = Math.floor(Math.random() * tieMoves.length);
        bestMove = tieMoves[move];
    }

    log("AI Played: " + bestMove.col + "," + bestMove.row + " Score: " + bestMove.score);
    isValidMove(bestMove.col, bestMove.row, "white");
    gamestate.push(new Move(0, bestMove.col, bestMove.row, validChips.length, validChips))
    placeChip(bestMove.col, bestMove.row, "white");
    iMoved(bestMove.col, bestMove.row, "white")
    for (var i = 0; i < validChips.length; i++) {
        validChips[i].flip();
    }
    player = "red";
    doesRedHaveAvailableMoves();
}


function train() {
    for (var i = 0; i < document.getElementById("train").value; i++) {
        turnComputerOn();
        console.log(i, "iterations ran")
    }
}

function undo() {
    if (gamestate.length > 0) {
        var moveToUndo = gamestate.pop();
        for (var i = 0; i < moveToUndo.chipList.length; i++) {
            moveToUndo.chipList[i].flip();
        }
        remove(chips, checkPosition(moveToUndo.col, moveToUndo.row))
        draw();
        draw();
    }

}

async function doesRedHaveAvailableMoves() {
    //await sleep(200);
    validRedMoves = [];
    var tieMoves = [];
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            if (checkDuplicate(c, r) == true) {
                continue;
            }
            isValidMove(c, r, "red");
            if (validChips.length > 0) {
                validRedMoves.push(new Move(baseScore[c][r], c, r, validChips.length, validChips))

            }
        }
    }
    if (validRedMoves.length < 1) {
        if (haveWeShownScoreYet == false && !PlayerTwo) {
            alert("You are out of possible moves.");
        }
        winCondition();
        noMoves = true;
        player = "white";
        if (chips.length == 4) {
            player = "red";
        } else {
            AIPlay();
        }
    } else {
        noMoves = false;
    }
    if (PlayerTwo == true) {
        var bestMove = new Move(-1000, -1, -1, 0);
        for (var i = 0; i < validRedMoves.length; i++) {
            if (validRedMoves[i].score > bestMove.score) {
                bestMove = validRedMoves[i];
            } else if (validRedMoves[i].score == bestMove.score) {
                tieMoves.push(validMoves[i]);
                //   if (validRedMoves[i].chipsToFlip > bestMove.chipsToFlip) {
                //      bestMove = validRedMoves[i];
                // }
            }
        }
        if (bestMove.col < 0) { //that means white can't make any more moves
            winCondition();
            player = "white";
            if (haveWeShownScoreYet == false && !PlayerTwo) { //if the game isn't over yet, we should let the player know that it's their turn
                alert("Computer can't make a move. It's your turn!");
            }
            return;
        }

        if (bestMove.score <= tieMoves[0].score && tieMoves.length > 0) {
            var move = Math.floor(Math.random() * tieMoves.length);
            bestMove = tieMoves[move];
        }
        log("A2 Played: " + bestMove.col + "," + bestMove.row + " Score: " + bestMove.score);
        isValidMove(bestMove.col, bestMove.row, "red");
        gamestate.push(new Move(0, bestMove.col, bestMove.row, validChips.length, validChips))
        placeChip(bestMove.col, bestMove.row, "red");
        iMoved(bestMove.col, bestMove.row, "red")
        for (var i = 0; i < validChips.length; i++) {
            validChips[i].flip();
        }
        player = "white";
        AIPlay();
    }
}

function iMoved(row, col, color) {
    if (color == "red") {
        moves[col][row] = 1;
    } else {
        moves[col][row] = 2;
    }
}

function winCondition() {
    getCounts();
    if ((total == 64 || red < 1 || white < 1 || noMoves == true) && haveWeShownScoreYet == false) {

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (red > white) {
                    if (moves[i][j] == 1) {
                        baseScore[i][j]++;
                    } else {
                        baseScore[i][j] -= 1;
                    }

                } else {
                    if (moves[i][j] == 2) {
                        baseScore[i][j]++;
                    } else {
                        baseScore[i][j] -= 1;
                    }

                }

            }
        }
        moves = initMoves;

        if (PlayerTwo) {
            newGame();
            return;
        }
        haveWeShownScoreYet = true;
        alert("Game Over! Player 1: " + red + " AI: " + white);

        if (confirm("Would you like to start a new game?") == true) {
            PlayerTwo = false;
            haveWeShownScoreYet = false;
            newGame();
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

        while (row >= 0 && row < 8 && col >= 0 && col < 8) {


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
    chips = [];
    gamestate = [];
    new chip(3, 3, "white");
    new chip(4, 4, "white");
    new chip(3, 4, "red");
    new chip(4, 3, "red");
    player = "red";
    draw();
}
newGame();