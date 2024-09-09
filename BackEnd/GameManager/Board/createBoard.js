/*
let Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];
*/
let Board = [
  [" ", " ", " ", " ", "r", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", "k", " ", " ", "P", " ", "R", " "],
  [" ", " ", " ", " ", "K", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
];

let Game_State = [],
  prevMove;
function createInGamePcs(board) {
  let inGamePcs = {
    b: [],
    r: [],
    n: [],
    q: [],
    k: [],
    p: [],
    B: [],
    R: [],
    N: [],
    Q: [],
    K: [],
    P: [],
  };
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece !== " ") {
        inGamePcs[piece].push([row, col]);
      }
    }
  }
  return inGamePcs;
}

function showBoard(board) {
  console.log("-|-----------------|-");
  for (let row = 0; row < board.length; row++) {
    process.stdout.write(8 - row + "| ");
    console.log(
      board[row].map((piece) => (piece === " " ? "." : piece)).join(" ") + " |"
    );
  }
  console.log("-|-----------------|-");
  console.log("   a b c d e f g h");
  console.log(`\n-------xxxxx-----xxxxxxxx-----xxxxx--------\n`);
}

console.log(`-------xxxxx-----NEW GAME-----xxxxx--------\n`);
showBoard(Board);
console.log(`\n-------xxxxx-----xxxxxxxx-----xxxxx--------\n`);

module.exports = { Board, createInGamePcs, showBoard, Game_State, prevMove };
