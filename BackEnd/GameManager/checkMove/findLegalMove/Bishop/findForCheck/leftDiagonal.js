const getBoard = require("../../../../Board/createBoard");

function leftDiag(square, king) {
  /* Left Diagonal up-left */
  let rank = square[0],
    file = square[1];
  while (--rank >= 0 && --file >= 0) {
    if (getBoard.Board[rank][file] == king) {
      return 1;
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  /* Left Diagonal down-right */
  (rank = square[0]), (file = square[1]);
  while (++rank <= 7 && ++file <= 7) {
    if (getBoard.Board[rank][file] == king) {
      return 1;
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  return 0;
}
module.exports = { leftDiag };
