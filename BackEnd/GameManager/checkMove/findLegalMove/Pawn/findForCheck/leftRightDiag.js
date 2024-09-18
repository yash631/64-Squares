const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function leftRight(color, square, king, pawn, gameid) {
  const piece = "p";
  const board = getBoard.getCurrentBoard(gameid);
  let rank, file;
  let trgtSqLeft, trgtSqRight;
  if (color) {
    trgtSqLeft = [square[0] - 1, square[1] - 1];
    trgtSqRight = [square[0] - 1, square[1] + 1];
  } else {
    trgtSqLeft = [square[0] + 1, square[1] - 1];
    trgtSqRight = [square[0] + 1, square[1] + 1];
  }
  if (
    trgtSqLeft[1] >= 0 &&
    board[trgtSqLeft[0]][trgtSqLeft[1]] == king
  ) {
    (rank = trgtSqLeft[0]), (file = trgtSqRight[1]);
    return { piece, rank, file };
  }
  if (
    trgtSqRight[1] <= 7 &&
    board[trgtSqRight[0]][trgtSqRight[1]] == king
  ) {
    (rank = trgtSqRight[0]), (file = trgtSqRight[1]);
    return { piece, rank, file };
  } else {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(board);
    /* Check for Discovered check from Bishop */
    const b = Bishop.bishopDiscovery(
      board,
      "b",
      inGamePcs,
      king,
      color,
      gameid,
    );
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
  }
  return 0;
}
module.exports = { leftRight };
