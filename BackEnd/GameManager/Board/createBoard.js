function initializeBoard() {
  return {
    Board: [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ],
    Castling : {
      0: {
        q: 1, // Queen side castling O-O-O for black 
        k: 1, // King side castling O-O for black
      },
      1: {
        q: 1, // Queen side castling O-O-O for white
        k: 1, // King side castling O-O for white
      },
    },
    Game_State: [],
    prevMove: null,
  };
}

/* Global games object including all games w.r.t. their gameid */
let Games = {};

function setCurrentBoard(gameId, board) {
  if (Games[gameId]) {
    Games[gameId].Board = board;
  }
}

function getCurrentBoard(gameId) {
  return Games[gameId]?.Board || null;
}

function removeSingleCastle(gameId, color, side){
  if(Games[gameId]){
    Games[gameId].Castling[color][side] = 0;
  }
}

function removeFullCastle(gameId, color){
  if (Games[gameId]) {
    Games[gameId].Castling[color].q = 0;
    Games[gameId].Castling[color].k = 0;
  }
}

function getCastleState(gameId){
  return Games[gameId]?.Castling || {};
}

function setGameState(gameId, gameState) {
  if (Games[gameId]) {
    Games[gameId].Game_State = gameState;
  }
}

function getGameState(gameId) {
  return Games[gameId]?.Game_State || [];
}

function setPrevMove(gameId, move) {
  if (Games[gameId]) {
    Games[gameId].prevMove = move;
  }
}

function getPrevMove(gameId) {
  return Games[gameId]?.prevMove || null;
}

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

function createNewGame(gameId) {
  Games[gameId] = initializeBoard();
  console.log(`Game ${gameId} initialized.`);
  console.log(`-------xxxxx-----NEW GAME-----xxxxx--------\n`);
  showBoard(Games[gameId].Board);
  return Games[gameId];
}

function getSingleGameObject(gameId){
  return Games[gameId] || {};
}

module.exports = {
  initializeBoard,
  createNewGame,
  getSingleGameObject,
  createInGamePcs,
  showBoard,
  setCurrentBoard,
  getCurrentBoard,
  removeSingleCastle,
  removeFullCastle,
  getCastleState,
  setGameState,
  getGameState,
  setPrevMove,
  getPrevMove,
};
