const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function movesArray(square, totalMoves, king, color, gameid) {
  const piece = "n";
  /* Discovered checks */
  let board = getBoard.getCurrentBoard(gameid);
  const inGamePcs = getBoard.createInGamePcs(board);
  /* Check for Discovered check from Bishop */
  const b = Bishop.bishopDiscovery(board, "b", inGamePcs, king, color, gameid);
  if (b) {
    return b;
  }
  /* Check for Discovered check from Rook */
  const r = Rook.rookDiscovery(board, "r", inGamePcs, king, color, gameid);
  if (r) {
    return r;
  }
  /* Check for Discovered check from Queen */
  const q =
    Bishop.bishopDiscovery(board, "q", inGamePcs, king, color, gameid) ||
    Rook.rookDiscovery(board, "q", inGamePcs, king, color, gameid);
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
      board[rank][file] == king
    ) {
      return { piece, rank : square[0], file : square[1] };
    }
  }
  return 0;
}
module.exports = { movesArray };
