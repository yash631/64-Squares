const bishop = require("../Bishop/legalBishopMoves");
const rook = require("../Rook/legalRookMoves");

function findQueen(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck) {
  bishop.findBishop(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck);
  rook.findRook(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck);
}
module.exports = { findQueen };
