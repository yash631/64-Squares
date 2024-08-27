const not = require("../../notations");
function findPawn(col, lm, ALLPCS, iGP, rk, fl, board, prevMove) {
  const king = not.KING[1-col];
  let pawn = "p";
  if (col) {
    pawn = "P";
  }
  const MOVE = {
    0: 1,
    1: -1,
    start0: [1, 2],
    start1: [6, -2],
  };
  const LEFT = {
    0: [1, -1],
    1: [-1, -1],
  };
  const RIGHT = {
    0: [1, 1],
    1: [-1, 1],
  };
  const prmt_pcs = {
    0: ["q", "r", "n", "b", 6],
    1: ["Q", "R", "N", "B", 1],
  };
  const EP = {
    0: 4,
    1: 3,
  };
  for (const locOfPawn of iGP[pawn]) {
    let rank = locOfPawn[0],
      file = locOfPawn[1];
    if (!lm.p[col][`${rank}${file}`]) {
      lm.p[col][`${rank}${file}`] = [];
    }
    let square_left = [LEFT[col][0], LEFT[col][1]],
      square_right = [RIGHT[col][0], RIGHT[col][1]];
    /* Promotion */
    if (rank == prmt_pcs[col][4]) {
      /* Capture on left to promote*/
      if (
        ALLPCS[1 - col].includes(
          board[rank + square_left[0]][file + square_left[1]]
        )
      ) {
        for (let num = 0; num < 4; num++) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }=${prmt_pcs[col][num]}`
          );
        }
      }
      /* Capture on right to promote */
      if (
        ALLPCS[1 - col].includes(
          board[rank + square_right[0]][file + square_right[1]]
        )
      ) {
        for (let num = 0; num < 4; num++) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }=${prmt_pcs[col][num]}`
          );
        }
      }
      /* Direct promotion */
      if (board[rank - 1][file] == " ") {
        for (let num = 0; num < 4; num++) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}${rk[rank + MOVE[col]]}=${prmt_pcs[col][num]}`
          );
        }
      }
    } else {
      /* Default Move */
      if (board[rank + MOVE[col]][file] == " ") {
        lm.p[col][`${rank}${file}`].push(`${fl[file]}${rk[rank + MOVE[col]]}`);
        /* Starting Move */
        if (
          locOfPawn[0] == MOVE[`start${col}`][0] &&
          board[rank + MOVE[`start${col}`][1]][file] == " "
        ) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}${rk[rank + MOVE[`start${col}`][1]]}`
          );
        }
      }

      /* Capture Piece on left */
      if (
        ALLPCS[1 - col].includes(
          board[rank + square_left[0]][file + square_left[1]]
        )
      ) {
        lm.p[col][`${rank}${file}`].push(
          `${fl[file]}x${fl[file + square_left[1]]}${rk[rank + square_left[0]]}`
        );
      }
      /* Capture Piece on right */
      if (
        ALLPCS[1 - col].includes(
          board[rank + square_right[0]][file + square_right[1]]
        )
      ) {
        lm.p[col][`${rank}${file}`].push(
          `${fl[file]}x${fl[file + square_right[1]]}${
            rk[rank + square_right[0]]
          }`
        );
      }
      /* En passant on left */
      if (
        rank == EP[col] &&
        prevMove == `${fl[file - 1]}${rk[rank]}` &&
        board[rank + square_left[0]][file + square_left[1]] == " "
      ) {
        lm.p[col][`${rank}${file}`].push(
          `${fl[file]}x${fl[file + square_left[1]]}${
            rk[rank + square_left[0]]
          }ep`
        );
      } else if (
        /* En passant on right */
        rank == EP[col] &&
        prevMove == `${fl[file + 1]}${rk[rank]}` &&
        board[rank + square_right[0]][file + square_right[1]] == " "
      ) {
        lm.p[col][`${rank}${file}`].push(
          `${fl[file]}x${fl[file + square_right[1]]}${
            rk[rank + square_right[0]]
          }ep`
        );
      }
    }
  }
}

module.exports = { findPawn };
