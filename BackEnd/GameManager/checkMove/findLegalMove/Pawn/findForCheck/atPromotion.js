const getBoard = require("../../../../Board/createBoard");
const LD = require("../../Bishop/findForCheck/leftDiagonal");
const RD = require("../../Bishop/findForCheck/rightDiagonal");
const FL = require("../../Rook/findForCheck/file");
const RNK = require("../../Rook/findForCheck/rank");
const DIR = require("../../Knight/findForCheck/allDirections");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function prom(piece, square, king, color, pawn) {
  if (piece === "q" || piece === "Q") {
    return (
      LD.leftDiag(square, king) ||
      RD.rightDiag(square, king) ||
      RNK.rank(square, king) ||
      FL.file(square, king)
    );
  } else if (piece === "r" || piece === "R") {
    return RNK.rank(square, king) || FL.file(square, king);
  } else if (piece === "n" || piece === "N") {
    return DIR.movesArray(
      square,
      [
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
        [-1, -2],
        [-2, -1],
        [1, -2],
        [2, -1],
      ],
      king
    );
  } else if (piece === "b" || piece === "B") {
    return LD.leftDiag(square, king) || RD.rightDiag(square, king);
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

module.exports = { prom };
