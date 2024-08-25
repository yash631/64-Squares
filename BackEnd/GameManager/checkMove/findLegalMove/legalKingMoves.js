function findKing(col, lm, bp, wp, iGP, rk, fl, board) {
  const totalMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  if (col) {
    /* White King */
    lm.k["1"][`${iGP.K[0][0]}${iGP.K[0][1]}`] = [];
    for (const move of totalMoves) {
      let rank = iGP.K[0][0] + move[0],
        file = iGP.K[0][1] + move[1];
      if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
        if (bp.includes(board[rank][file])) {
          lm.k["1"][`${iGP.K[0][0]}${iGP.K[0][1]}`].push(`Kx${fl[file]}${rk[rank]}`);
          continue;
        }
        else if (board[rank][file] != " "){
          continue;
        }
        lm.k["1"][`${iGP.K[0][0]}${iGP.K[0][1]}`].push(`K${fl[file]}${rk[rank]}`);
      }
    }
  } else {
    /* Black King */
    lm.k["0"][`${iGP.k[0][0]}${iGP.k[0][1]}`] = [];
    for (const move of totalMoves) {
      let rank = iGP.k[0][0] + move[0],
        file = iGP.k[0][1] + move[1];
      if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
        if (wp.includes(board[rank][file])) {
          lm.k["0"][`${iGP.k[0][0]}${iGP.k[0][1]}`].push(`kx${fl[file]}${rk[rank]}`);
          continue;
        }
        else if (board[rank][file] != " "){
          continue;
        }
        lm.k["0"][`${iGP.k[0][0]}${iGP.k[0][1]}`].push(`k${fl[file]}${rk[rank]}`);
      }
    }
  }
}
module.exports = { findKing };
