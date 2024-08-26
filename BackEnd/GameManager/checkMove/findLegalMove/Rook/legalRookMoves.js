const RNK = require("./findForCheck/rank");
const FL = require("./findForCheck/file");
const left = require("../Bishop/findForCheck/leftDiagonal");
const right = require("../Bishop/findForCheck/rightDiagonal");
const not = require("../../notations");

function findRook(col, lm, bp, wp, iGP, rk, fl, board, piece) {
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
    /* White side Rook */
    for (const locOfPiece of iGP[piece[0]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      let rows = rank,
        cols = file;
      if (!lm[piece[1]]["1"][`${rows}${cols}`]) {
        lm[piece[1]]["1"][`${rows}${cols}`] = [];
      }
      /* file up */
      while (--rank >= 0) {
        if (bp.includes(board[rank][file])) {
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
        if (bp.includes(board[rank][file])) {
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
        if (bp.includes(board[rank][file])) {
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
        if (bp.includes(board[rank][file])) {
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
  } else {
    /* Black side Rook */
    for (const locOfPiece of iGP[piece[1]]) {
      let rank = locOfPiece[0],
        file = locOfPiece[1];
      let rows = rank,
        cols = file;
      if (!lm[piece[1]]["0"][`${rows}${cols}`]) {
        lm[piece[1]]["0"][`${rows}${cols}`] = [];
      }
      /* file up */
      while (--rank >= 0) {
        if (wp.includes(board[rank][file])) {
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
        if (wp.includes(board[rank][file])) {
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
        if (wp.includes(board[rank][file])) {
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
        if (wp.includes(board[rank][file])) {
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
}
module.exports = { findRook };
