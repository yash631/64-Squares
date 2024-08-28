const not = require("../../notations");
const prom = require("./findForCheck/atPromotion");
const ltrt = require("./findForCheck/leftRightDiag");
const getBoard = require("../../../Board/createBoard");

function findPawn(col, lm, ALLPCS, iGP, rk, fl, board, prevMove) {
  const king = not.KING[1 - col];
  let pawn = "p";
  if (col) {
    pawn = "P";
  }
  /* Default and starting sqaure move with board row */
  const MOVE = {
    0: 1,
    1: -1,
    start0: [1, 2],
    start1: [6, -2],
  };
  /* Forward Left square coordinates */
  const LEFT = {
    0: [1, -1],
    1: [-1, -1],
  };
  /* Forward Right square coordinates */
  const RIGHT = {
    0: [1, 1],
    1: [-1, 1],
  };
  /* Promotion pieces and board row of legal sqaure*/
  const prmt_pcs = {
    0: ["q", "r", "n", "b", 6],
    1: ["Q", "R", "N", "B", 1],
  };
  /* Board row of legal square for enPassant*/
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
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        for (let num = 0; num < 4; num++) {
          if (
            prom.prom(
              prmt_pcs[col][num],
              [rank + square_left[0], file + square_left[1]],
              king,
              col,
              pawn
            )
          ) {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_left[1]]}${
                rk[rank + square_left[0]]
              }=${prmt_pcs[col][num]}+`
            );
          } else {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_left[1]]}${
                rk[rank + square_left[0]]
              }=${prmt_pcs[col][num]}`
            );
          }
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
      }
      /* Capture on right to promote */
      if (
        ALLPCS[1 - col].includes(
          board[rank + square_right[0]][file + square_right[1]]
        )
      ) {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        for (let num = 0; num < 4; num++) {
          if (
            prom.prom(
              prmt_pcs[col][num],
              [rank + square_right[0], file + square_right[1]],
              king,
              col,
              pawn
            )
          ) {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_right[1]]}${
                rk[rank + square_right[0]]
              }=${prmt_pcs[col][num]}+`
            );
          } else {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_right[1]]}${
                rk[rank + square_right[0]]
              }=${prmt_pcs[col][num]}`
            );
          }
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
      }
      /* Direct promotion */
      if (board[rank - 1][file] == " ") {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        for (let num = 0; num < 4; num++) {
          if (
            prom.prom(prmt_pcs[col][num], [rank - 1, file], king, col, pawn)
          ) {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[col]]}=${prmt_pcs[col][num]}+`
            );
          } else {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[col]]}=${prmt_pcs[col][num]}`
            );
          }
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
      }
    } else {
      /* Default Move */
      if (board[rank + MOVE[col]][file] == " ") {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank + MOVE[col]][file] = pawn;
        if (ltrt.leftRight(col, [rank + MOVE[col], file], king, pawn)) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}${rk[rank + MOVE[col]]}+`
          );
        } else {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}${rk[rank + MOVE[col]]}`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        board[rank + MOVE[col]][file] = " ";
        /* Starting Move */
        if (
          locOfPawn[0] == MOVE[`start${col}`][0] &&
          board[rank + MOVE[`start${col}`][1]][file] == " "
        ) {
          board[locOfPawn[0]][locOfPawn[1]] = " ";
          board[rank + MOVE[`start${col}`][1]][file] = pawn;
          if (
            ltrt.leftRight(
              col,
              [rank + MOVE[`start${col}`][1], file],
              king,
              pawn
            )
          ) {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[`start${col}`][1]]}+`
            );
          } else {
            lm.p[col][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[`start${col}`][1]]}`
            );
          }
          board[locOfPawn[0]][locOfPawn[1]] = pawn;
          board[rank + MOVE[`start${col}`][1]][file] = " ";
        }
      }

      /* Capture Piece on left */
      if (
        ALLPCS[1 - col].includes(
          board[rank + square_left[0]][file + square_left[1]]
        )
      ) {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank + square_left[0]][file + square_left[1]] = pawn;
        if (
          ltrt.leftRight(
            col,
            [rank + square_left[0], file + square_left[1]],
            king,
            pawn
          )
        ) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }+`
          );
        } else {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        board[rank + square_left[0]][file + square_left[1]] = " ";
      } else if (
        /* En passant on left */
        rank == EP[col] &&
        prevMove ==
          `${rank + MOVE[`start${col}`][1]}${file - 1}${fl[file - 1]}${
            rk[rank]
          }`
      ) {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank][file - 1] = " ";
        board[rank + square_left[0]][file + square_left[1]] = pawn;

        if (
          ltrt.leftRight(col, [
            rank + square_left[0],
            file + square_left[1],
            king,
            pawn,
          ])
        ) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }ep+`
          );
        } else {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }ep`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        if (col) {
          board[rank][file - 1] = "p";
        } else {
          board[rank][file - 1] = "P";
        }
        board[rank + square_left[0]][file + square_left[1]] = " ";
      }
      /* Capture Piece on right */
      if (
        ALLPCS[1 - col].includes(
          board[rank + square_right[0]][file + square_right[1]]
        )
      ) {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank + square_right[0]][file + square_right[1]] = pawn;
        if (
          ltrt.leftRight(
            col,
            [rank + square_right[0], file + square_right[1]],
            king,
            pawn
          )
        ) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }+`
          );
        } else {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        board[rank + square_right[0]][file + square_right[1]] = " ";
      } else if (
        /* En passant on right */
        rank == EP[col] &&
        prevMove ==
          `${rank + MOVE[`start${col}`][1]}${file + 1}${fl[file + 1]}${
            rk[rank]
          }`
      ) {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank][file + 1] = " ";
        board[rank + square_right[0]][file + square_right[1]] = pawn;
        if (
          ltrt.leftRight(
            col,
            [rank + square_right[0], file + square_right[1]],
            king,
            pawn
          )
        ) {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }ep+`
          );
        } else {
          lm.p[col][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }ep`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        if (col) {
          board[rank][file + 1] = "p";
        } else {
          board[rank][file + 1] = "P";
        }
        board[rank + square_right[0]][file + square_right[1]] = " ";
      }
    }
  }
}

module.exports = { findPawn };
