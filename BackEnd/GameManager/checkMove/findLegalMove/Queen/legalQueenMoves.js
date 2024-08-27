const bishop = require("../Bishop/legalBishopMoves");
const rook = require("../Rook/legalRookMoves");

function findQueen(col, lm, ALLPCS, iGP, rk, fl, board, piece) {
  bishop.findBishop(col, lm, ALLPCS, iGP, rk, fl, board, piece);
  rook.findRook(col, lm, ALLPCS, iGP, rk, fl, board, piece);
}
module.exports = { findQueen };
