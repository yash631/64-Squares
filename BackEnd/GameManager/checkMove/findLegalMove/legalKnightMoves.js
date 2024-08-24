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
  if (col) {
    /* White side knight */
    for (const locOfKnight of iGP["N"]) {
      for (const move of totalMoves) {
        let rank = locOfKnight[0] + move[0],
          file = locOfKnight[1] + move[1];
        if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
          if (bp.includes(board[rank][file])) {
            lm.n["1"].push(`Nx${fl[file]}${rk[rank]}`);
            continue;
          }
          lm.n["1"].push(`N${fl[file]}${rk[rank]}`);
        }
      }
    }
  } else {
    /* Black side Knight */
    for (const locOfKnight of iGP["n"]) {
      for (const move of totalMoves) {
        let rank = locOfKnight[0] + move[0],
          file = locOfKnight[1] + move[1];
        if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
          if (wp.includes(board[rank][file])) {
            lm.n["0"].push(`nx${fl[file]}${rk[rank]}`);
            continue;
          }
          lm.n["0"].push(`n${fl[file]}${rk[rank]}`);
        }
      }
    }
  }
}
module.exports = { findKnight };
