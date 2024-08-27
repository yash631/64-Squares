const getBoard = require("../../../../Board/createBoard");

function file(square, king) {
  /* Up File */
  let rank = square[0],
    file = square[1];
  while (--rank >= 0) {
    if (getBoard.Board[rank][file] == king) {
      return 1;
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  /* Down File */
  rank = square[0];
  while (++rank <= 7) {
    if (getBoard.Board[rank][file] == king) {
      return 1;
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  return 0;
}
module.exports = { file };
