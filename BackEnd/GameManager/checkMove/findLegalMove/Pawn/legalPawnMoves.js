function findPawn(col, lm, ALLPCS, iGP, rk, fl, board, prevMove) {
  /* White side Pawns */
  if (col) {
    for (const locOfPawn of iGP["P"]) {
      let rank = locOfPawn[0],
        file = locOfPawn[1];
        lm.p[1][`${rank}${file}`] = [];
      /* Promotion */
      if (rank == 1) {
        /* Capture on left to promote*/
        if (ALLPCS[1-col].includes(board[rank - 1][file - 1])) {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=Q`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=R`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=N`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}=B`);
        }
        /* Capture on right to promote */
        if (ALLPCS[1-col].includes(board[rank - 1][file + 1])) {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=Q`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=R`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=N`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}=B`);
        }
        /* Direct promotion */
        if (board[rank - 1][file] == " ") {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}${rk[rank - 1]}=Q`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}${rk[rank - 1]}=R`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}${rk[rank - 1]}=N`);
          lm.p[1][`${rank}${file}`].push(`${fl[file]}${rk[rank - 1]}=B`);
        }
      } else {
        /* Default Move */
        if (board[rank - 1][file] == " ") {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}${rk[rank - 1]}`);
        }
        /* Starting Move */
        if (locOfPawn[0] == 6 && board[rank - 2][file] == " ") {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}${rk[rank - 2]}`);
        }
        /* Capture Piece on left */
        if (ALLPCS[1-col].includes(board[rank - 1][file - 1])) {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}`);
        }
        /* Capture Piece on right */
        if (ALLPCS[1-col].includes(board[rank - 1][file + 1])) {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}`);
        }
        /* En passant on left */
        if (
          rank == 3 &&
          prevMove == `${fl[file - 1]}${rk[rank]}` &&
          board[rank - 1][file - 1] == " "
        ) {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank - 1]}ep`);
        } else if (
        /* En passant on right */
          rank == 3 &&
          prevMove == `${fl[file + 1]}${rk[rank]}` &&
          board[rank - 1][file + 1] == " "
        ) {
          lm.p[1][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank - 1]}ep`);
        }
      }
    }
  } else {
    /* Black side Pawns */
    for (const locOfPawn of iGP["p"]) {
      let rank = locOfPawn[0],
        file = locOfPawn[1];
        lm.p[0][`${rank}${file}`] = [];
      /* Promotion */
      if (rank == 6) {
        /* Capture on left to promote*/
        if (ALLPCS[1-col].includes(board[rank + 1][file - 1])) {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=q`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=r`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=n`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}=b`);
        }
        /* Capture on right to promote */
        if (ALLPCS[1-col].includes(board[rank + 1][file + 1])) {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=q`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=r`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=n`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}=b`);
        }
        /* Direct promotion */
        if (board[rank + 1][file] == " ") {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}${rk[rank + 1]}=q`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}${rk[rank + 1]}=r`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}${rk[rank + 1]}=n`);
          lm.p[0][`${rank}${file}`].push(`${fl[file]}${rk[rank + 1]}=b`);
        }
      } else {
        /* Default Move */
        if (board[rank + 1][file] == " ") {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}${rk[rank + 1]}`);
        }
        /* Starting Move */
        if (locOfPawn[0] == 1 && board[rank + 2][file] == " ") {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}${rk[rank + 2]}`);
        }
        /* Capture Piece on left */
        if (ALLPCS[1-col].includes(board[rank + 1][file - 1])) {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}`);
        }
        /* Capture Piece on right */
        if (ALLPCS[1-col].includes(board[rank + 1][file + 1])) {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}`);
        }
        /* En passant on left */
        if (
          rank == 4 &&
          prevMove == `${fl[file - 1]}${rk[rank]}` &&
          board[rank + 1][file - 1] == " "
        ) {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file - 1]}${rk[rank + 1]}ep`);
        } else if (
        /* En passant on right */
          rank == 4 &&
          prevMove == `${fl[file + 1]}${rk[rank]}` &&
          board[rank + 1][file + 1] == " "
        ) {
          lm.p[0][`${rank}${file}`].push(`${fl[file]}x${fl[file + 1]}${rk[rank + 1]}ep`);
        }
      }
    }
  }
}

module.exports = { findPawn };
