function findPawn(col, lm, bp, wp, iGP, rk, fl, board, prevMove) {
  /* White side Pawns */
  if (col) {
    for (const locOfPawn of iGP["P"]) {
      let rank = locOfPawn[0],
        file = locOfPawn[1];
      /* Promotion */
      if (rank == 1) {
        /* Capture on left to promote*/
        if (bp.includes(board[rank - 1][file - 1])) {
          lm.p[1].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=Q`);
          lm.p[1].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=R`);
          lm.p[1].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=N`);
          lm.p[1].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=B`);
        }
        /* Capture on right to promote */
        if (bp.includes(board[rank - 1][file + 1])) {
          lm.p[1].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=Q`);
          lm.p[1].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=R`);
          lm.p[1].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=N`);
          lm.p[1].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=B`);
        }
        /* Direct promotion */
        lm.p[1].push(`${fl[file]}${rk[rank - 1]}=Q`);
        lm.p[1].push(`${fl[file]}${rk[rank - 1]}=R`);
        lm.p[1].push(`${fl[file]}${rk[rank - 1]}=N`);
        lm.p[1].push(`${fl[file]}${rk[rank - 1]}=B`);
      } else {
        /* Default Move */
        lm.p[1].push(`${fl[file]}${rk[rank - 1]}`);
        /* Starting Move */
        if (locOfPawn[0] == 6) {
          lm.p[1].push(`${fl[file]}${rk[rank - 2]}`);
        }
        /* Capture Piece on left */
        if (bp.includes(board[rank - 1][file - 1])) {
          lm.p[1].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}`);
        }
        /* Capture Piece on right */
        if (bp.includes(board[rank - 1][file + 1])) {
          lm.p[1].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}`);
        }
        /* En passant on left */
        if (rank == 3 && prevMove == `${fl[file - 1]}${rk[rank]}`) {
          lm.p[1].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}`);
        } else if (
          /* En passant on right */
          rank == 3 &&
          prevMove == `${fl[file + 1]}${rk[rank]}`
        ) {
          lm.p[1].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}`);
        }
      }
    }
  } else {
    /* Black side Pawns */
    for (const locOfPawn of iGP["p"]) {
      let rank = locOfPawn[0],
        file = locOfPawn[1];
      /* Promotion */
      if (rank == 6) {
        /* Capture on left to promote*/
        if (wp.includes(board[rank + 1][file - 1])) {
          lm.p[0].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=q`);
          lm.p[0].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=r`);
          lm.p[0].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=n`);
          lm.p[0].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=b`);
        }
        /* Capture on right to promote */
        if (wp.includes(board[rank + 1][file + 1])) {
          lm.p[0].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=q`);
          lm.p[0].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=r`);
          lm.p[0].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=n`);
          lm.p[0].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=b`);
        }
        /* Direct promotion */
        lm.p[0].push(`${fl[file]}${rk[rank + 1]}=q`);
        lm.p[0].push(`${fl[file]}${rk[rank + 1]}=r`);
        lm.p[0].push(`${fl[file]}${rk[rank + 1]}=n`);
        lm.p[0].push(`${fl[file]}${rk[rank + 1]}=b`);
      } else {
        /* Default Move */
        lm.p[0].push(`${fl[file]}${rk[rank + 1]}`);
        /* Starting Move */
        if (locOfPawn[0] == 1) {
          lm.p[0].push(`${fl[file]}${rk[rank + 2]}`);
        }
        /* Capture Piece on left */
        if (wp.includes(board[rank + 1][file - 1])) {
          lm.p[0].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}`);
        }
        /* Capture Piece on right */
        if (wp.includes(board[rank + 1][file + 1])) {
          lm.p[0].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}`);
        }
        /* En passant on left */
        if (rank == 4 && prevMove == `${fl[file - 1]}${rk[rank]}`) {
          lm.p[0].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}ep`);
        } else if (
          /* En passant on right */
          rank == 4 &&
          prevMove == `${fl[file + 1]}${rk[rank]}`
        ) {
          lm.p[0].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}ep`);
        }
      }
    }
  }
}

module.exports = { findPawn };