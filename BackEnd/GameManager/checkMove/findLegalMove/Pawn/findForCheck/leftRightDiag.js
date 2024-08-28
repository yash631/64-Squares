const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function leftRight(color, square, king, pawn) {
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
    return 1;
  }
  if (
    trgtSqRight[1] <= 7 &&
    getBoard.Board[trgtSqRight[0]][trgtSqRight[1]] == king
  ) {
    return 1;
  } else {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    /* Check for Discovered check from Bishop */
    if (Bishop.bishopDiscovery(getBoard.Board,"b",inGamePcs, king,color)) {
      return 1;
    } else if (Rook.rookDiscovery(getBoard.Board,"r", inGamePcs, king,color)) {
      /* Check for Discovered check from Rook */
      return 1;
    } else if (Bishop.bishopDiscovery(getBoard.Board,"q", inGamePcs, king,color) ||
               Rook.rookDiscovery(getBoard.Board,"q", inGamePcs, king,color)) {
      /* Check for Discovered check from Queen */
      return 1;
    }
  }
  return 0;
}
module.exports = { leftRight };
