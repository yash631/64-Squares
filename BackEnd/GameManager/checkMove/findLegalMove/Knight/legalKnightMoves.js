const allDir = require("./findForCheck/allDirections");
const not = require("../../notations");

function findKnight(col, lm, ALLPCS, iGP, rk, fl, board) {
  const king = not.KING[col];
  let knight = "n";
  if (col) {
    knight = "N";
  }
  const totalMoves = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-1, -2],
    [-2, -1],
    [1, -2],
    [2, -1],
  ];
  function normalMove(rank, file, rows, cols) {
    lm.n[col][`${rows}${cols}`].push(`${knight}${fl[file]}${rk[rank]}`);
  }
  function captureMove(rank, file, rows, cols) {
    lm.n[col][`${rows}${cols}`].push(`${knight}x${fl[file]}${rk[rank]}`);
  }
  function normalCheck(rank, file, rows, cols) {
    lm.n[col][`${rows}${cols}`].push(`${knight}${fl[file]}${rk[rank]}+`);
  }
  function captureCheck(rank, file, rows, cols) {
    lm.n[col][`${rows}${cols}`].push(`${knight}x${fl[file]}${rk[rank]}+`);
  }
  for (const locOfKnight of iGP[knight]) {
    lm.n[col][`${locOfKnight[0]}${locOfKnight[1]}`] = [];
    for (const move of totalMoves) {
      let rank = locOfKnight[0] + move[0],
        file = locOfKnight[1] + move[1];
      if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
        if (ALLPCS[1 - col].includes(board[rank][file])) {
          if (allDir.movesArray([rank, file], totalMoves, king)) {
            captureCheck(rank, file, locOfKnight[0], locOfKnight[1]);
          } else {
            captureMove(rank, file, locOfKnight[0], locOfKnight[1]);
          }
          continue;
        } else if (board[rank][file] != " ") {
          continue;
        } else if (allDir.movesArray([rank, file], totalMoves, king)) {
          normalCheck(rank, file, locOfKnight[0], locOfKnight[1]);
          continue;
        }
        normalMove(rank, file, locOfKnight[0], locOfKnight[1]);
      }
    }
  }
}
module.exports = { findKnight };
