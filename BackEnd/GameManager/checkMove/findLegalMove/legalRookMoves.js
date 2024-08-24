function findRook(col, lm, bp, wp, iGP, rk, fl, board, piece) {
  if (col) {
    /* White side Rook */
    for (const locOfPiece of iGP[piece[0]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      /* file up */
      while (--rank >= 0) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["1"].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
      /* file down */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["1"].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
      /* rank left */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (--file >= 0) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["1"].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
      /* rank right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++file <= 7) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["1"].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
    }
  } else {
    /* Black side Rook */
    for (const locOfPiece of iGP[piece[1]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      /* file up */
      while (--rank >= 0) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["0"].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
      /* file down */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["0"].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
      /* rank left */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (--file >= 0) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["0"].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
      /* rank right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++file <= 7) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        lm[piece[1]]["0"].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
    }
  }
}
module.exports = { findRook };
