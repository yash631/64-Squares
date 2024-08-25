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
      console.log(`-->>${not.pieces[allPieces]}<<--`);
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
  findlegal.findAllLegalMoves(LEGALMOVES, color, getBoard.prevMove);
  /* SHOW LEGAL MOVES 
  showLegalMoves(LEGALMOVES); */

  console.log(`----------------------------`);
  if (LEGALMOVES[piece][color][`${curr_row}${curr_col}`].includes(move)) {
    updateBoard.updateInGamePcs(
      getBoard.Board,
      getBoard.createInGamePcs(getBoard.Board),
      curr_row,
      curr_col,
      new_row,
      new_col
    );
    getBoard.prevMove = move;
    getBoard.Game_State.push(move);
    /*console.log(`\nBoard Updated after ${move}\n`);
    console.log(getBoard.createInGamePcs(getBoard.Board));*/
    getBoard.showBoard(getBoard.Board);
    console.log("MOVES : ", getBoard.Game_State);
    console.log();
    return true;
  }
  return false;
}

module.exports = { isValid };
