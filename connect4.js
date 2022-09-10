/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/////////////////// Setup Important Values ////////////////////////
///////////////////////////////////////////////////////////////////
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

let gameActive = true; // will keep track of if game is active so user can't drop pieces when game is over

// storage to keep track of wins for each player
let p1Wins = localStorage.getItem("p1Wins")
  ? parseInt(localStorage.getItem("p1Wins"))
  : 0;

let p2Wins = localStorage.getItem("p2Wins")
  ? parseInt(localStorage.getItem("p2Wins"))
  : 0;

  // select h2 headers
const p1score = document.getElementById("p1score");
const p2score = document.getElementById("p2score");
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////





/////////////////////// h2 header functions ///////////////////////
///////////////////////////////////////////////////////////////////
// makes and appends headers that show score
function makeHeaders() {
  p1score.innerHTML = `<span>&#9679;</span>Player 1: ${p1Wins} Win(s)`;
  p2score.innerHTML = `<span>&#9679;</span>Player 2: ${p2Wins} Win(s)`;

  p1score.classList.remove("inactive");
  p2score.classList.add("inactive");
}

// function to handle changing player header style based on whose turn it is
function headerSwitch() {
  p1score.classList.toggle("inactive");
  p2score.classList.toggle("inactive");
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////





//////////////////////// board functions //////////////////////////
///////////////////////////////////////////////////////////////////
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    board.push(new Array(WIDTH).fill(null));
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // TODO: add comment for this code
  // creates a single row at the top of the gameboard
  // that will handle the user clicks
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // creates the appropriate number of rows and columns
  // and sets each individual 'td' equal to it's position
  // on the gameboard
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // iterates from bottom going up and returns the first empty (null) array index
  // based on the selected column 'x'
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) {
      board[i][x] = currPlayer;
      return i;
    }
  }
  return null;
}


/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // also calculates distance from first row to final position
  // for animation purposes
  const piece = document.createElement("div");

  piece.classList.add("piece");
  piece.classList.add(currPlayer === 1 ? "piece1" : "piece2");
  piece.style.top = `-${(y + 1) * 50}px`;

  const loc = document.getElementById(`${y}-${x}`);
  loc.append(piece);
}


/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  if (gameActive) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);

    // check if a player has won
    // if so, add to wins, update localStorage, and call endGame
    if (checkForWin()) {
      gameActive = false;
      if (currPlayer === 1) {
        p1Wins++;
        localStorage.setItem("p1Wins", JSON.stringify(p1Wins));
      }
      if (currPlayer === 2) {
        p2Wins++;
        localStorage.setItem("p2Wins", JSON.stringify(p2Wins));
      }
      endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    if (checkForTie()) {
      endGame("Tie Game!");
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2
    if (gameActive) {
      currPlayer = currPlayer === 1 ? 2 : 1;

      headerSwitch();
    }
  }
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////





////////////////////// end of game functions///////////////////////
///////////////////////////////////////////////////////////////////
/** endGame: announce game end */
function endGame(msg) {
  const game = document.querySelector("main");
  const h2 = document.createElement("h3");
  h2.innerText = msg;
  h2.style.textAlign = "center";

  const restart = document.createElement("button");
  restart.innerText = "Play Again?";

  game.append(h2);
  game.append(restart);

  restart.addEventListener("click", () => {
    h2.remove();
    restart.remove();
    gameActive = true;
    currPlayer = 1;
    board = [];
    document.querySelector("#board").innerHTML = "";
    startGame();
  });
}


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

  // TODO: read and understand this code. Add comments to help you.
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

// return true if the entire top row has a non null value
function checkForTie() {
  return board[0].every((n) => n !== null);
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////





///////////////////////// START GAME //////////////////////////////
///////////////////////////////////////////////////////////////////
function startGame() {
  makeHeaders();
  makeBoard();
  makeHtmlBoard();
}

startGame();
