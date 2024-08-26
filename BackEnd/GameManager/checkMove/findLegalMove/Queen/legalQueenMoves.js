const bishop = require("../Bishop/legalBishopMoves");
const rook = require("../Rook/legalRookMoves");

function findQueen(col,lm, bp, wp, iGP, rk, fl, board,piece){
  bishop.findBishop(col,lm, bp, wp, iGP, rk, fl, board,piece);
  rook.findRook(col,lm, bp, wp, iGP, rk, fl, board,piece);
}
module.exports = {findQueen};