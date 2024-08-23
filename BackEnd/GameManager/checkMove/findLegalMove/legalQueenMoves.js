const { findBishop } = require("./legalBishopMoves");
const { findRook } = require("./legalRookMoves");

function findQueen(lm, bp, wp, iGP, rk, fl, board,piece){
  findBishop(lm, bp, wp, iGP, rk, fl, board,piece);
  findRook(lm, bp, wp, iGP, rk, fl, board,piece);
}
module.exports = {findQueen};