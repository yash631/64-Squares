const findlegal = require("../findLegalMove/findLegal");
const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");

function isValid(move, color, curr_row, curr_column, new_row, new_column) {
  let LEGALMOVES = findlegal.createLegalMoves();
  findlegal.findAllLegalMoves(LEGALMOVES, color, getBoard.prevMove);
  // console.log(LEGALMOVES);
  for (const key of Object.keys(LEGALMOVES)) {
    for (const eachmove of LEGALMOVES[key][color]) {
      if (eachmove === move) {
        /* Update the Board */
        updateBoard.updateInGamePcs(
          getBoard.Board,
          getBoard.createInGamePcs(getBoard.Board),
          curr_row,
          curr_column,
          new_row,
          new_column
        );

        /* show the update board */
        getBoard.prevMove = move;
        getBoard.Game_State.push(move);
        // console.log(`\nBoard Updated after ${move}\n`);
        // console.log(getBoard.createInGamePcs(getBoard.Board));
        getBoard.showBoard(getBoard.Board);
        console.log("MOVES : ", getBoard.Game_State);
        /* In game pieces with their position 
        console.log(getBoard.createInGamePcs(getBoard.Board)); */
        return true;
      }
    }
  }
  return false;
}

module.exports = { isValid };
