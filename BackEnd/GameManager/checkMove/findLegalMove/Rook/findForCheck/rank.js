const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");

function rank(square, king, color, piece) {
  /* Left Rank */
  let rank = square[0],
    file = square[1];
  while (--file >= 0) {
    if (getBoard.Board[rank][file] == king) {
      return 1;
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  /* Right Rank */
  file = square[1];
  while (++file <= 7) {
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
    if (Bishop.bishopDiscovery(getBoard.Board, "b", inGamePcs, king, color)) {
      return 1;
    } else if (
      /*  Check for Discovered check from Queen */
      Bishop.bishopDiscovery(getBoard.Board, "q", inGamePcs, king, color)
    ) {
      return 1;
    }
  }
  return 0;
}
module.exports = { rank };
