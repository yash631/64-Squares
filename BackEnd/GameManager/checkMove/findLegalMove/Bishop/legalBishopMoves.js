const left = require("./findForCheck/leftDiagonal");
const right = require("./findForCheck/rightDiagonal");
const RNK = require("../Rook/findForCheck/rank");
const FL = require("../Rook/findForCheck/file");
const not = require("../../notations");

function findBishop(col, lm, ALLPCS, iGP, rk, fl, board, piece) {
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
    /* left diagonal up-left */
    while (--rank >= 0 && --file >= 0) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (RNK.rank([rank, file], king) || FL.file([rank, file], king)) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (right.rightDiag([rank, file], king)) {
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
          RNK.rank([rank, file], king) ||
          FL.file([rank, file], king) ||
          right.rightDiag([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (right.rightDiag([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }
    /* left diagonal down-right */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++rank <= 7 && ++file <= 7) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (RNK.rank([rank, file], king) || FL.file([rank, file], king)) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (right.rightDiag([rank, file], king)) {
          captureCheck(rank, file, rows, cols);
          break;
        }
        captureMove(rank, file, rows, cols);
        break;
      } else if (board[rank][file] != " ") {
        /* Check for same color pieces */
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          RNK.rank([rank, file], king) ||
          FL.file([rank, file], king) ||
          right.rightDiag([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (right.rightDiag([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }

    /* right diagonal down-left */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++rank <= 7 && --file >= 0) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (RNK.rank([rank, file], king) || FL.file([rank, file], king)) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (left.leftDiag([rank, file], king)) {
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
          RNK.rank([rank, file], king) ||
          FL.file([rank, file], king) ||
          left.leftDiag([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (left.leftDiag([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }
    /* right diagonal up-right */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (--rank >= 0 && ++file <= 7) {
      if (ALLPCS[1 - col].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (RNK.rank([rank, file], king) || FL.file([rank, file], king)) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        if (left.leftDiag([rank, file], king)) {
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
          RNK.rank([rank, file], king) ||
          FL.file([rank, file], king) ||
          left.leftDiag([rank, file], king)
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (left.leftDiag([rank, file], king)) {
        normalCheck(rank, file, rows, cols);
      } else {
        normalMove(rank, file, rows, cols);
      }
    }
  }
}
module.exports = { findBishop };
