const allDir = require("./findForCheck/allDirections");

function findKnight(col, lm, bp, wp, iGP, rk, fl, board) {
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
  function normalMove(rank, file, rows, cols, knight) {
    lm.n[col][`${rows}${cols}`].push(`${knight}${fl[file]}${rk[rank]}`);
  }
  function captureMove(rank, file, rows, cols, knight) {
    lm.n[col][`${rows}${cols}`].push(`${knight}x${fl[file]}${rk[rank]}`);
  }
  function normalCheck(rank, file, rows, cols, knight) {
    lm.n[col][`${rows}${cols}`].push(`${knight}${fl[file]}${rk[rank]}+`);
  }
  function captureCheck(rank, file, rows, cols, knight) {
    lm.n[col][`${rows}${cols}`].push(`${knight}x${fl[file]}${rk[rank]}+`);
  }
  if (col) {
    /* White side knight */
    for (const locOfKnight of iGP["N"]) {
      lm.n["1"][`${locOfKnight[0]}${locOfKnight[1]}`] = [];
      for (const move of totalMoves) {
        let rank = locOfKnight[0] + move[0],
          file = locOfKnight[1] + move[1];
        if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
          if (bp.includes(board[rank][file])) {
            if (allDir.movesArray([rank, file], totalMoves, "k")) {
              captureCheck(rank, file, locOfKnight[0], locOfKnight[1], "N");
            } else {
              captureMove(rank, file, locOfKnight[0], locOfKnight[1], "N");
            }
            continue;
          } else if (board[rank][file] != " ") {
            continue;
          } else if (allDir.movesArray([rank, file], totalMoves, "k")) {
            normalCheck(rank, file, locOfKnight[0], locOfKnight[1], "N");
            continue;
          }
          normalMove(rank, file, locOfKnight[0], locOfKnight[1], "N");
        }
      }
    }
  } else {
    /* Black side Knight */
    for (const locOfKnight of iGP["n"]) {
      lm.n["0"][`${locOfKnight[0]}${locOfKnight[1]}`] = [];
      for (const move of totalMoves) {
        let rank = locOfKnight[0] + move[0],
          file = locOfKnight[1] + move[1];
        if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
          if (wp.includes(board[rank][file])) {
            if (allDir.movesArray([rank, file], totalMoves, "K")) {
              captureCheck(rank, file, locOfKnight[0], locOfKnight[1], "n");
            } else {
              captureMove(rank, file, locOfKnight[0], locOfKnight[1], "n");
            }
            continue;
          } else if (board[rank][file] != " ") {
            continue;
          } else if (allDir.movesArray([rank, file], totalMoves, "K")) {
            normalCheck(rank, file, locOfKnight[0], locOfKnight[1], "n");
            continue;
          }
          normalMove(rank, file, locOfKnight[0], locOfKnight[1], "n");
        }
      }
    }
  }
}
module.exports = { findKnight };
