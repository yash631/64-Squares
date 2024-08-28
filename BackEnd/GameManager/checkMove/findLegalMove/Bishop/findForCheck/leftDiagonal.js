const getBoard = require("../../../../Board/createBoard");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function leftDiag(square, king, color, piece) {
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
  if (piece != "q") {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    /* Check for Discovered check from Bishop */
    if (Rook.rookDiscovery(getBoard.Board, "r", inGamePcs, king, color)) {
      return 1;
    } else if (
      /*  Check for Discovered check from Queen */
      Rook.rookDiscovery(getBoard.Board, "q", inGamePcs, king, color)
    ) {
      return 1;
    }
  }
  return 0;
}
module.exports = { leftDiag };
