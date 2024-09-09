const getBoard = require("../../../../Board/createBoard");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function leftDiag(square, king, color, piece) {
  /* Left Diagonal up-left */
  let rank = square[0],
    file = square[1];
  while (--rank >= 0 && --file >= 0) {
    if (getBoard.Board[rank][file] == king) {
      return { piece, rank : square[0], file : square[1] };
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  /* Left Diagonal down-right */
  (rank = square[0]), (file = square[1]);
  while (++rank <= 7 && ++file <= 7) {
    if (getBoard.Board[rank][file] == king) {
      return { piece, rank : square[0], file : square[1] };
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  if (piece != "q") {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    /* Check for Discovered check from Bishop */
    const r = Rook.rookDiscovery(getBoard.Board, "r", inGamePcs, king, color);
    if (r) {
      return r;
    }
    /*  Check for Discovered check from Queen */
    const q = Rook.rookDiscovery(getBoard.Board, "q", inGamePcs, king, color);
    if (q) {
      return q;
    }
  }
  return 0;
}
module.exports = { leftDiag };
