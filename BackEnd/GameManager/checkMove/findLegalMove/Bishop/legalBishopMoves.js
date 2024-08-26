const left = require("./findForCheck/leftDiagonal");
const right = require("./findForCheck/rightDiagonal");
const RNK = require("../Rook/findForCheck/rank");
const FL = require("../Rook/findForCheck/file");
const not = require("../../notations");

function findBishop(col, lm, bp, wp, iGP, rk, fl, board, piece) {
  function normalMove(rank, file, rows, cols) {
    let whichPiece;
    if (col) {
      whichPiece = 0;
    } else {
      whichPiece = 1;
    }
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[whichPiece]}${fl[file]}${rk[rank]}`
    );
  }
  function captureMove(rank, file, rows, cols) {
    let whichPiece;
    if (col) {
      whichPiece = 0;
    } else {
      whichPiece = 1;
    }
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[whichPiece]}x${fl[file]}${rk[rank]}`
    );
  }
  function normalCheck(rank, file, rows, cols) {
    let whichPiece;
    if (col) {
      whichPiece = 0;
    } else {
      whichPiece = 1;
    }
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[whichPiece]}${fl[file]}${rk[rank]}+`
    );
  }
  function captureCheck(rank, file, rows, cols) {
    let whichPiece;
    if (col) {
      whichPiece = 0;
    } else {
      whichPiece = 1;
    }
    lm[piece[1]][col][`${rows}${cols}`].push(
      `${piece[whichPiece]}x${fl[file]}${rk[rank]}+`
    );
  }
  const king = not.KING[col];
  if (col) {
    /* White side Piece */
    for (const locOfPiece of iGP[piece[0]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      let rows = rank,
        cols = file;
      if (!lm[piece[1]]["1"][`${rows}${cols}`]) {
        lm[piece[1]]["1"][`${rows}${cols}`] = [];
      }
      /* left diagonal up-left */
      while (--rank >= 0 && --file >= 0) {
        if (bp.includes(board[rank][file])) {
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
        if (bp.includes(board[rank][file])) {
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
        if (bp.includes(board[rank][file])) {
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
        if (bp.includes(board[rank][file])) {
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
  } else {
    /* Black side Piece */
    for (const locOfPiece of iGP[piece[1]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      let rows = rank,
        cols = file;
      if (!lm[piece[1]]["0"][`${rows}${cols}`]) {
        lm[piece[1]]["0"][`${rows}${cols}`] = [];
      }
      /* left diagonal left */
      while (--rank >= 0 && --file >= 0) {
        if (wp.includes(board[rank][file])) {
          /* For Queen */
          if (piece[1] == "q") {
            if (RNK.rank([rank, file], king) || FL.file([rank, file], king)) {
              captureCheck(rank, file, rows, cols);
              break;
            }
          }
          if (right.rightDiag([rank, file], king)) {
            captureCheck(rank, file, rows, cols);
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
      /* left diagonal right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7 && ++file <= 7) {
        if (wp.includes(board[rank][file])) {
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
      /* right diagonal left */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (++rank <= 7 && --file >= 0) {
        if (wp.includes(board[rank][file])) {
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
      /* right diagonal right */
      (rank = locOfPiece[0]), (file = locOfPiece[1]);
      while (--rank >= 0 && ++file <= 7) {
        if (wp.includes(board[rank][file])) {
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
}
module.exports = { findBishop };
