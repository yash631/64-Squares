const { findBishop } = require("./legalBishopMoves");
const { findRook } = require("./legalRookMoves");

function findQueen(col,lm, bp, wp, iGP, rk, fl, board,piece){
  findBishop(col,lm, bp, wp, iGP, rk, fl, board,piece);
  findRook(col,lm, bp, wp, iGP, rk, fl, board,piece);
}
module.exports = {findQueen};