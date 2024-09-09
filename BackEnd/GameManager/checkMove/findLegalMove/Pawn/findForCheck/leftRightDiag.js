const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function leftRight(color, square, king, pawn) {
  const piece = "p";
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
    getBoard.Board[trgtSqLeft[0]][trgtSqLeft[1]] == king
  ) {
    (rank = trgtSqLeft[0]), (file = trgtSqRight[1]);
    return { piece, rank, file };
  }
  if (
    trgtSqRight[1] <= 7 &&
    getBoard.Board[trgtSqRight[0]][trgtSqRight[1]] == king
  ) {
    (rank = trgtSqRight[0]), (file = trgtSqRight[1]);
    return { piece, rank, file };
  } else {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    /* Check for Discovered check from Bishop */
    const b = Bishop.bishopDiscovery(
      getBoard.Board,
      "b",
      inGamePcs,
      king,
      color
    );
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
  }
  return 0;
}
module.exports = { leftRight };
