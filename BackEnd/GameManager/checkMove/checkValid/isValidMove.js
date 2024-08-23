const findlegal = require("../findLegalMove/findLegal");
const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");

function isValid(move, color) {
  findlegal.findAllLegalMoves(color);
  for (const key of Object.keys(findlegal.LEGALMOVES)) {
    for (const eachmove of findlegal.LEGALMOVES[key][color]) {
      if (eachmove === move) {
        /* Update the Board */
        updateBoard.updateInGamePcs(
          getBoard.Board,
          getBoard.createInGamePcs(getBoard.Board),
          6,
          0,
          4,
          0
        );
        /* show the update board */
        console.log(`\nBoard Updated after ${move}\n`);
        getBoard.showBoard(getBoard.Board);
        /* In game pieces with their position */
        // console.log(getBoard.createInGamePcs(getBoard.Board));
        return true;
      }
    }
  }

  return false;
}

console.log(isValid("a4", 1));

module.exports = { isValid };

/*  Considerations
1. In en passant if not written ep as suffix -> still a legal move
2. If given check and + not written as suffix -> still a legal move
3. If checkmate and # not written as suffix -> still legal move
*/
