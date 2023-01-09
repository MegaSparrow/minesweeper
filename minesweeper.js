var board = [];
var rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = []; // '2-1', '3-2'

var tilesClicked = 0; // goal to click all tiles except the mines
var flagEnabled = false;

var gameOver = false;

window.onload = startGame;

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
    document.getElementById('mines-count').innerText = minesCount;
    document.getElementById('flag-button').addEventListener('click', setFlag);
    setMines();

    //populate board
    for(let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // creating <div id = '0-0><\div>
            let tile = document.createElement('div');
            tile.id = r.toString() + '-' + c.toString();
            tile.addEventListener('click', clickTile);
            document.getElementById('board').append(tile);
            row.push(tile)
        }
        board.push(row);
    }
    console.log(board)
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
        if (tile.innerText == '') {
            tile.innerText = '🚩';
        }
        else if (tile.innerText == '🚩') {
            tile.innerText = '';
        }
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
        tile.innerText = '💣';
        tile.style.backgroundColor = 'red';
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
        document.getElementById('mines-count').innerText = 'Cleared';
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
