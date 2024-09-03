const bishop = require("../Bishop/legalBishopMoves");
const rook = require("../Rook/legalRookMoves");

function findQueen(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck,pinnedPcs) {
  bishop.findBishop(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck,pinnedPcs);
  rook.findRook(col, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck,pinnedPcs);
}
module.exports = { findQueen };
