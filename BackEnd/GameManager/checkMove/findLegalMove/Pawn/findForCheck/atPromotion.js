const LD = require("../../Bishop/findForCheck/leftDiagonal");
const RD = require("../../Bishop/findForCheck/rightDiagonal");
const FL = require("../../Rook/findForCheck/file");
const RNK = require("../../Rook/findForCheck/rank");
const DIR = require("../../Knight/findForCheck/allDirections");

function prom(piece, square, king) {
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
  }
  return 0;
}

module.exports = { prom };
