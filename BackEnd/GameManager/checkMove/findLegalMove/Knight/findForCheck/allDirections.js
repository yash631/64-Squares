const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function movesArray(square, totalMoves, king, color) {
  /* Discovered checks */
  const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
  /* Check for Discovered check from Bishop */
  if (Bishop.bishopDiscovery(getBoard.Board, "b", inGamePcs, king, color)) {
    return 1;
  } else if (Rook.rookDiscovery(getBoard.Board, "r", inGamePcs, king, color)) {
    /* Check for Discovered check from Rook */
    return 1;
  } else if (
  /* Check for Discovered check from Queen */
    Bishop.bishopDiscovery(getBoard.Board, "q", inGamePcs, king, color) ||
    Rook.rookDiscovery(getBoard.Board, "q", inGamePcs, king, color)
  ) {
    return 1;
  }
  for (const moves of totalMoves) {
    let rank = square[0] + moves[0],
      file = square[1] + moves[1];
    if (
      rank >= 0 &&
      rank <= 7 &&
      file >= 0 &&
      file <= 7 &&
      getBoard.Board[rank][file] == king
    ) {
      return 1;
    }
  }
  return 0;
}
module.exports = { movesArray };
