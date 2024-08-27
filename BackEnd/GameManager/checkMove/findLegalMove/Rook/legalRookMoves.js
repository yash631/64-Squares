const RNK = require("./findForCheck/rank");
const FL = require("./findForCheck/file");
const left = require("../Bishop/findForCheck/leftDiagonal");
const right = require("../Bishop/findForCheck/rightDiagonal");
const not = require("../../notations");

function findRook(col, lm, ALLPCS, iGP, rk, fl, board, piece) {
  const king = not.KING[1-col];
  function normalMove(rank, file, rows, cols) {
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[1 - col]}${fl[file]}${rk[rank]}`
    );
  }
  function captureMove(rank, file, rows, cols) {
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[1 - col]}x${fl[file]}${rk[rank]}`
    );
  }
  function normalCheck(rank, file, rows, cols) {
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[1 - col]}${fl[file]}${rk[rank]}+`
    );
  }
  function captureCheck(rank, file, rows, cols) {
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[1 - col]}x${fl[file]}${rk[rank]}+`
    );
  }
  for (const locOfPiece of iGP[piece[1 - col]]) {
    let rank = locOfPiece[0],
      file = locOfPiece[1];
    let rows = rank,
      cols = file;
    if (!lm[piece[1]][col][`${rows}${cols}`]) {
      lm[piece[1]][col][`${rows}${cols}`] = [];
    }
    /* file up */
    while (--rank >= 0) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king) ||
            right.rightDiag([rank, file], king)
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (RNK.rank([rank, file], king)) {
          captureCheck(rank, file, rows, cols);
          break;
        }
        captureMove(rank, file, rows, cols);
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king) ||
          right.rightDiag([rank, file], king) ||
          RNK.rank([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (RNK.rank([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }
    /* file down */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++rank <= 7) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king) ||
            right.rightDiag([rank, file], king)
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (RNK.rank([rank, file], king)) {
          captureCheck(rank, file, rows, cols);
          break;
        }
        captureMove(rank, file, rows, cols);
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king) ||
          right.rightDiag([rank, file], king) ||
          RNK.rank([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (RNK.rank([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }
    /* rank left */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (--file >= 0) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king) ||
            right.rightDiag([rank, file], king)
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (FL.file([rank, file], king)) {
          captureCheck(rank, file, rows, cols);
          break;
        }
        captureMove(rank, file, rows, cols);
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king) ||
          right.rightDiag([rank, file], king) ||
          FL.file([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (FL.file([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }
    /* rank right */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++file <= 7) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king) ||
            right.rightDiag([rank, file], king)
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (FL.file([rank, file], king)) {
          captureCheck(rank, file, rows, cols);
          break;
        }
        captureMove(rank, file, rows, cols);
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king) ||
          right.rightDiag([rank, file], king) ||
          FL.file([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (FL.file([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }
  }
}
module.exports = { findRook };
