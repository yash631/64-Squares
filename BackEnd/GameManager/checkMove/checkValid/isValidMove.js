const findlegal = require("../findLegalMove/findLegal");
const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");
const not = require("../notations");

function isValid(piece, move, color, curr_row, curr_col, new_row, new_col) {
  function showLegalMoves(LEGALMOVES) {
    console.log(
      `CURRENT POSITION OF ${not.COLOR[color]} PIECES AND THEIR LEGAL MOVES`
    );
    for (const allPieces in LEGALMOVES) {
      console.log(`-->>${not.PIECES[allPieces]}<<--`);
      for (const singlePiece in LEGALMOVES[allPieces][color]) {
        console.log(
          `${not.FILE[singlePiece[1]]}${not.RANK[singlePiece[0]]} : ${
            LEGALMOVES[allPieces][color][singlePiece]
          }`
        );
      }
      console.log("\n");
    }
  }
  let LEGALMOVES = findlegal.createLegalMoves();
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    color,
    getBoard.prevMove
  );
  /* SHOW LEGAL MOVES */
  // showLegalMoves(LEGALMOVES);
  console.log(`-----------------------------------------------`);

  if (LEGALMOVES[piece][color][`${curr_row}${curr_col}`].includes(move)) {
    if (color) {
      piece = piece.toUpperCase();
    }
    const len = move.length;
    if (not.ALLPIECES[color].includes(move[len - 1])) {
      piece = move[len - 1];
    } else if (
      (move[len - 1] == "+" || move[len - 1] == "#") &&
      not.ALLPIECES[color].includes(move[len - 2])
    ) {
      piece = move[len - 2];
    }
    updateBoard.updateInGamePcs(
      getBoard.Board,
      piece,
      curr_row,
      curr_col,
      new_row,
      new_col
    );
    getBoard.prevMove = `${curr_row}${curr_col}${move}`;
    // console.log(getBoard.prevMove);
    getBoard.Game_State.push(move);
    /*console.log(`\nBoard Updated after ${move}\n`);
    console.log(getBoard.createInGamePcs(getBoard.Board));*/
    getBoard.showBoard(getBoard.Board);
    // console.log("MOVES : ", getBoard.Game_State);
    console.log();
    return true;
  }
  return false;
}

module.exports = { isValid };
