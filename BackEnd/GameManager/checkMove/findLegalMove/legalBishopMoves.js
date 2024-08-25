function findBishop(col, lm, bp, wp, iGP, rk, fl, board, piece) {
  if (col) {
    /* White side Piece */
    for (const locOfPiece of iGP[piece[0]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`] = [];
      /* left diagonal left */
      while (--rank >= 0 && --file >= 0) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
      /* left diagonal right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7 && ++file <= 7) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
      /* right diagonal left */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7 && --file >= 0) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
      /* right diagonal right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (--rank >= 0 && ++file <= 7) {
        if (bp.includes(board[rank][file])) {
          lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["1"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[0]}${fl[file]}${rk[rank]}`);
      }
    }
  } else {
    /* Black side Piece */
    for (const locOfPiece of iGP[piece[1]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`] = [];
      /* left diagonal left */
      while (--rank >= 0 && --file >= 0) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
      /* left diagonal right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7 && ++file <= 7) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
      /* right diagonal left */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7 && --file >= 0) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
      /* right diagonal right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (--rank >= 0 && ++file <= 7) {
        if (wp.includes(board[rank][file])) {
          lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}x${fl[file]}${rk[rank]}`);
          break;
        }
        else if (board[rank][file] != " "){
          break;
        }
        lm[piece[1]]["0"][`${locOfPiece[0]}${locOfPiece[1]}`].push(`${piece[1]}${fl[file]}${rk[rank]}`);
      }
    }
  }
}
module.exports = { findBishop };
