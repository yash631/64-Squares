const bishop = require("../Bishop/legalBishopMoves");
const rook = require("../Rook/legalRookMoves");

function findQueen(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck, checkInfo) {
  bishop.findBishop(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck, checkInfo);
  rook.findRook(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck,checkInfo);
}
module.exports = { findQueen };
