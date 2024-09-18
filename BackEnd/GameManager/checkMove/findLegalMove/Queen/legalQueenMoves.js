const bishop = require("../Bishop/legalBishopMoves");
const rook = require("../Rook/legalRookMoves");

function findQueen(
  col,
  lm,
  ALLPCS,
  iGP,
  rk,
  fl,
  board,
  piece,
  isInCheck,
  checkInfo,
  gameid,
) {
  bishop.findBishop(
    col,
    lm,
    ALLPCS,
    iGP,
    rk,
    fl,
    board,
    piece,
    isInCheck,
    checkInfo,
    gameid,
  );
  rook.findRook(
    col,
    lm,
    ALLPCS,
    iGP,
    rk,
    fl,
    board,
    piece,
    isInCheck,
    checkInfo,
    gameid,
  );
}
module.exports = { findQueen };
