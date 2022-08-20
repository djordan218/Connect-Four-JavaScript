const WIDTH = 7;
const HEIGHT = 6;
let num = 0;
let currPlayer = 1;
const board = []; // array of rows, each row is array of cells  (board[y][x])

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');
  const top = document.createElement('tr'); // creating variable for table row
  top.setAttribute('id', 'column-top'); // setting CSS styles
  top.addEventListener('click', handleClick); // "when I click, run the handleClick function"

  // we are looping through width and creating number of cells in a row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x); // assigning it an id of #x
    top.append(headCell); // adding table data AKA how many columns are in a row
  }
  htmlBoard.append(top); // putting those rows into the div containing #board

  // now we are creating the number of rows we have, or the "main board"
  for (let y = 0; y < HEIGHT; y++) {
    // looking at height that is defined at top of code
    const row = document.createElement('tr'); // creating a row
    for (var x = 0; x < WIDTH; x++) {
      // looping through the width variable to determine how many cells we will have in a row
      const cell = document.createElement('td'); // add onto the row
      cell.setAttribute('id', `${y}-${x}`); // adding id to cell that is looped through (so 0-1, 0-2, and then 1-1, 1-2, etc)
      row.append(cell); // adding cells to the row
    }
    htmlBoard.append(row); // now we are appending row to the htmlBoard
  }
}

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const piece = document.createElement('div'); // variable to create a div
  piece.classList.add('piece'); // adding CSS class to div
  piece.classList.add(`p${currPlayer}`); // adding a p1 or p2 class
  piece.classList.add('fall'); // added a fall animation
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece); // adding the div to that td column
}

/** endGame: announce game end */
function endGame(msg) {
  setTimeout(function () {
    // I wanted to add a setTimeout function so the DOM could finish loading and show the landing piece
    alert(msg);
    window.location.reload();
  }, 10);
  // window.location.reload();
}

// clicking top column
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer; // **I did not fully understand this line of code
  placeInTable(y, x);
  counter(); // added a counter function

  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won in ${num} moves!`);
  }
  // check for tie
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("It's a doggone tie!");
  }
  // switching players
  currPlayer = currPlayer === 1 ? 2 : 1;
  // currPlayer = if currPlayer = 1 ? make it 2 : if not, make it 1
}

function counter() {
  const counterNum = document.getElementById('counter');
  counterNum.innerHTML = ++num;
}

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function () {
  window.location.reload();
});

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// fun little function we were taught back in CSS that I really like that changes the colors of the text
function randomRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

const letters = document.querySelectorAll('.letter');
const intervalId = setInterval(function () {
  for (let letter of letters) {
    letter.style.color = randomRGB();
  }
}, 500);

makeBoard();
makeHtmlBoard();
