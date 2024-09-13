const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function movesArray(square, totalMoves, king, color) {
  const piece = "n";
  /* Discovered checks */
  const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
  /* Check for Discovered check from Bishop */
  const b = Bishop.bishopDiscovery(getBoard.Board, "b", inGamePcs, king, color);
  if (b) {
    return b;
  }
  /* Check for Discovered check from Rook */
  const r = Rook.rookDiscovery(getBoard.Board, "r", inGamePcs, king, color);
  if (r) {
    return r;
  }
  /* Check for Discovered check from Queen */
  const q =
    Bishop.bishopDiscovery(getBoard.Board, "q", inGamePcs, king, color) ||
    Rook.rookDiscovery(getBoard.Board, "q", inGamePcs, king, color);
  if (q) {
    return q;
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
      return { piece, rank : square[0], file : square[1] };
    }
  }
  return 0;
}
module.exports = { movesArray };
