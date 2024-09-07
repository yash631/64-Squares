const not = require("../../notations");
const prom = require("./findForCheck/atPromotion");
const ltrt = require("./findForCheck/leftRightDiag");
const getBoard = require("../../../Board/createBoard");
const pin = require("./afterPinnedMoves");
const newPin = require("../King/findPins/checkNewPins");

function findPawn(color, lm, ALLPCS, iGP, rk, fl, board, prevMove, isInCheck) {
  let pinnedPcs = newPin.getPinnedPcs();
  const oppKing = not.KING[1 - color];
  let curr_piece;
  let pawn = "p";
  if (color) {
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
  const prmt_rank = {
    0: 7,
    1: 0,
  };

  for (const locOfPawn of iGP[pawn]) {
    let rank = locOfPawn[0],
      file = locOfPawn[1];
    if (!lm.p[color][`${rank}${file}`]) {
      lm.p[color][`${rank}${file}`] = [];
    }
    let square_left = [LEFT[color][0], LEFT[color][1]],
      square_right = [RIGHT[color][0], RIGHT[color][1]];

    /* Check if the Piece is pinned to the king */
    const pinPos = `${rank}${file}`;
    if ("p" in pinnedPcs[color]) {
      if (pinPos in pinnedPcs[color]["p"]) {
        const pinnedPawn = pinnedPcs[color]["p"][pinPos];
        const pinningPiece = pinnedPawn[0];
        const pinningPieceRow = pinnedPawn[3][0];
        const pinningPieceCol = pinnedPawn[3][1];
        // console.log([pinningPieceRow, pinningPieceCol]);
        if (
          (pinningPiece === "r" || pinningPiece === "q") &&
          file == pinningPieceCol
        ) {
          pin.findMovesAfterPin(
            color,
            pawn,
            MOVE,
            pinnedPcs,
            oppKing,
            lm,
            board,
            iGP,
            [rank, file]
          );
        }
        continue;
      }
    }

    /* Promotion */
    if (rank == prmt_pcs[color][4]) {
      /* Capture on left to promote*/
      if (
        ALLPCS[1 - color].includes(
          board[rank + square_left[0]][file + square_left[1]]
        )
      ) {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        for (let num = 0; num < 4; num++) {
          if (
            prom.prom(
              prmt_pcs[color][num],
              [rank + square_left[0], file + square_left[1]],
              oppKing,
              color,
              pawn
            )
          ) {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_left[1]]}${
                rk[rank + square_left[0]]
              }=${prmt_pcs[color][num]}+`
            );
          } else {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_left[1]]}${
                rk[rank + square_left[0]]
              }=${prmt_pcs[color][num]}`
            );
          }
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
      }
      /* Capture on right to promote */
      if (
        ALLPCS[1 - color].includes(
          board[rank + square_right[0]][file + square_right[1]]
        )
      ) {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        for (let num = 0; num < 4; num++) {
          if (
            prom.prom(
              prmt_pcs[color][num],
              [rank + square_right[0], file + square_right[1]],
              oppKing,
              color,
              pawn
            )
          ) {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_right[1]]}${
                rk[rank + square_right[0]]
              }=${prmt_pcs[color][num]}+`
            );
          } else {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}x${fl[file + square_right[1]]}${
                rk[rank + square_right[0]]
              }=${prmt_pcs[color][num]}`
            );
          }
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
      }
      /* Direct promotion */
      if (board[prmt_rank[color]][file] == " ") {
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        for (let num = 0; num < 4; num++) {
          if (
            prom.prom(
              prmt_pcs[color][num],
              [prmt_rank[color], file],
              oppKing,
              color,
              pawn
            )
          ) {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[color]]}=${prmt_pcs[color][num]}+`
            );
          } else {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[color]]}=${prmt_pcs[color][num]}`
            );
          }
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
      }
    } else {
      /* Default Move */
      if (board[rank + MOVE[color]][file] == " ") {
        curr_piece = board[rank + MOVE[color]][file];
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank + MOVE[color]][file] = pawn;
        if (ltrt.leftRight(color, [rank + MOVE[color], file], oppKing, pawn)) {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}${rk[rank + MOVE[color]]}+`
          );
        } else {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}${rk[rank + MOVE[color]]}`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        board[rank + MOVE[color]][file] = curr_piece;
        /* Starting Move */
        if (
          locOfPawn[0] == MOVE[`start${color}`][0] &&
          board[rank + MOVE[`start${color}`][1]][file] == " "
        ) {
          curr_piece = board[rank + MOVE[`start${color}`][1]][file];
          board[locOfPawn[0]][locOfPawn[1]] = " ";
          board[rank + MOVE[`start${color}`][1]][file] = pawn;
          if (
            ltrt.leftRight(
              color,
              [rank + MOVE[`start${color}`][1], file],
              oppKing,
              pawn
            )
          ) {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[`start${color}`][1]]}+`
            );
          } else {
            lm.p[color][`${rank}${file}`].push(
              `${fl[file]}${rk[rank + MOVE[`start${color}`][1]]}`
            );
          }
          board[locOfPawn[0]][locOfPawn[1]] = pawn;
          board[rank + MOVE[`start${color}`][1]][file] = curr_piece;
        }
      }

      /* Capture Piece on left */
      if (
        ALLPCS[1 - color].includes(
          board[rank + square_left[0]][file + square_left[1]]
        )
      ) {
        curr_piece = board[rank + square_left[0]][file + square_left[1]];
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank + square_left[0]][file + square_left[1]] = pawn;
        if (
          ltrt.leftRight(
            color,
            [rank + square_left[0], file + square_left[1]],
            oppKing,
            pawn
          )
        ) {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }+`
          );
        } else {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        board[rank + square_left[0]][file + square_left[1]] = curr_piece;
      } else if (
        /* En passant on left */
        rank == EP[color] &&
        prevMove ==
          `${rank + MOVE[`start${color}`][1]}${file - 1}${fl[file - 1]}${
            rk[rank]
          }`
      ) {
        curr_piece = board[rank + square_left[0]][file + square_left[1]];
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank][file - 1] = " ";
        board[rank + square_left[0]][file + square_left[1]] = pawn;

        if (
          ltrt.leftRight(color, [
            rank + square_left[0],
            file + square_left[1],
            oppKing,
            pawn,
          ])
        ) {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }ep+`
          );
        } else {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_left[1]]}${
              rk[rank + square_left[0]]
            }ep`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        if (color) {
          board[rank][file - 1] = "p";
        } else {
          board[rank][file - 1] = "P";
        }
        board[rank + square_left[0]][file + square_left[1]] = curr_piece;
      }
      /* Capture Piece on right */
      if (
        ALLPCS[1 - color].includes(
          board[rank + square_right[0]][file + square_right[1]]
        )
      ) {
        curr_piece = board[rank + square_right[0]][file + square_right[1]];
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank + square_right[0]][file + square_right[1]] = pawn;
        if (
          ltrt.leftRight(
            color,
            [rank + square_right[0], file + square_right[1]],
            oppKing,
            pawn
          )
        ) {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }+`
          );
        } else {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        board[rank + square_right[0]][file + square_right[1]] = curr_piece;
      } else if (
        /* En passant on right */
        rank == EP[color] &&
        prevMove ==
          `${rank + MOVE[`start${color}`][1]}${file + 1}${fl[file + 1]}${
            rk[rank]
          }`
      ) {
        curr_piece = board[rank + square_right[0]][file + square_right[1]];
        board[locOfPawn[0]][locOfPawn[1]] = " ";
        board[rank][file + 1] = " ";
        board[rank + square_right[0]][file + square_right[1]] = pawn;
        if (
          ltrt.leftRight(
            color,
            [rank + square_right[0], file + square_right[1]],
            oppKing,
            pawn
          )
        ) {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }ep+`
          );
        } else {
          lm.p[color][`${rank}${file}`].push(
            `${fl[file]}x${fl[file + square_right[1]]}${
              rk[rank + square_right[0]]
            }ep`
          );
        }
        board[locOfPawn[0]][locOfPawn[1]] = pawn;
        if (color) {
          board[rank][file + 1] = "p";
        } else {
          board[rank][file + 1] = "P";
        }
        board[rank + square_right[0]][file + square_right[1]] = curr_piece;
      }
    }
  }
}

module.exports = { findPawn };
