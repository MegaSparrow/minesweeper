var board = [];

var rows = 8;
const maxRows = 15;
const minRows = 3;

var columns = 8;
const maxColumns = 15;
const minColumns = 3;

const maxMines = rows*columns - 1;
const minMines = 1;
var minesCount = 5;
var minesRemaining = minesCount;
var minesLocation = []; // '2-1', '3-2'

var tilesClicked = 0; // goal to click all tiles except the mines
var flagEnabled = false;

var gameOver = false;

window.onload = function () {
    setupGame();
}

function clearBoard() {
    let tile = document.getElementById('board').lastElementChild;
    while (tile) {
        document.getElementById('board').removeChild(tile);
        tile = document.getElementById('board').lastElementChild;
    }
}

function resetGameVariables() {
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    flagEnabled = false;
    gameOver = false;

    // resetting mines count
    minesCount = document.getElementById('number-of-mines').value;
    if (minesCount > maxMines) {
        minesCount = maxMines;
    }
    if (minesCount < minMines){
        minesCount = minMines;
    }
    minesRemaining = minesCount;

    // resetting rows and cols
    rows = document.getElementById('number-of-rows').value;
    if (rows > maxRows) {
        rows = maxRows;
    }
    if (rows < minRows){
        rows = minRows;
    }

    columns = document.getElementById('number-of-columns').value;
    if (columns > maxColumns) {
        columns = maxColumns;
    }
    if (columns < minColumns){
        columns = minColumns;
    }
}

function setupGame() {
    clearBoard();
    resetGameVariables();
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*columns);
        let id = r.toString() + '-' + c.toString();
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById('mines-count').innerText = minesRemaining;
    document.getElementById('flag-button').addEventListener('click', setFlag);
    setMines();

    //populate board
    for(let r = 0; r < rows; r++) {
        let row = [];
        let row_element = document.createElement('tr');
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('td');
            tile.id = r.toString() + '-' + c.toString();
            tile.addEventListener('click', clickTile);
            tile.classList.add('tile')
            row_element.append(tile)
            row.push(tile)
        }
        board.push(row);
        document.getElementById('board').append(row_element);
    }
    // console.log(board)
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById('flag-button').style.backgroundColor = 'lightgray';
    }
    else {
        flagEnabled = true;
        document.getElementById('flag-button').style.backgroundColor = 'darkgray';
    }
}

function clickTile() {

    if (gameOver || this.classList.contains('tile-clicked')) {
        return;
    }

    let tile = this;

    // if flag button is enabled
    if (flagEnabled) {
        if (!tile.classList.contains('tile-flagged')) {
            tile.classList.add('tile-flagged');
            minesRemaining -= 1;
            document.getElementById('mines-count').innerText = minesRemaining;
        }
        else if (tile.classList.contains('tile-flagged')) {
            tile.classList.remove('tile-flagged');
            minesRemaining += 1;
            document.getElementById('mines-count').innerText = minesRemaining;
        }
        return;
    }

    // if the tile has a flag on and the flag button is NOT enabled do nothing
    if (tile.classList.contains('tile-flagged')) {
        return;
    }

    // if flag button is NOT enabled and a mine is hit
    if (minesLocation.includes(tile.id)) {
        alert('GAME OVER');
        gameOver = true;
        revealMines();
        return;
    }

    // if flag button is NOT enabled and a mine is NOT hit
    let coord = tile.id.split('-'); // getting the location in ['r', 'c'] format
    let r = parseInt(coord[0]);
    let c = parseInt(coord[1]);
    checkMines(r, c);

}

function revealMines() {
    for (i in minesLocation) {
        let tile = document.getElementById(minesLocation[i]);
        if (tile.classList.contains('tile-flagged')) {
            tile.classList.remove('tile-flagged')
        }
        tile.classList.add('tile-bomb');
    }
    let tiles = document.getElementsByClassName("tile-flagged")
    for (i in tiles) {
        let tile = tiles[i];
        tile.classList.add('tile-wrong-bomb')
    }
}

function checkMines(r, c) {
    if (r<0 || r>=rows || c<0 || c>=columns) {
        return;
    }
    if (board[r][c].classList.contains('tile-clicked')) {
        return;
    }

    board[r][c].classList.add('tile-clicked');
    tilesClicked += 1

    let directions = [[1,0], [0,1], [1,1], [-1,0], [0,-1], [-1,-1], [1,-1], [-1,1]];
    let minesFound = 0;
    for (i in directions) {
        let row = r + directions[i][0];
        let col = c + directions[i][1];
        if (checkTile(row, col)) {
            minesFound++;
        }
    }

    if (minesFound == 0) {
        for (i in directions) {
            let row = r + directions[i][0];
            let col = c + directions[i][1];
            checkMines(row, col);
        }
    }
    else {
        board[r][c].innerText = minesFound.toString();
        board[r][c].classList.add('x' + minesFound.toString());      
    }

    if (tilesClicked == rows*columns - minesCount) {
        document.getElementById('mines-count').innerText = 'CLEARED!';
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r<0 || r>=rows || c<0 || c>=columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + '-' + c.toString())) {
        return 1;
    }
    return 0;
}
