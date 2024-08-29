const RNK = require("./findForCheck/rank");
const FL = require("./findForCheck/file");
const left = require("../Bishop/findForCheck/leftDiagonal");
const right = require("../Bishop/findForCheck/rightDiagonal");
const not = require("../../notations");

function findRook(color, lm, ALLPCS, iGP, rk, fl, board, piece) {
  const king = not.KING[1 - color];
  let actual_piece = piece[1 - color];
  let curr_piece;
  function normalMove(rank, file, rows, cols) {
    lm[piece[1]][color][`${rows}${cols}`].push(
      `${piece[1 - color]}${fl[file]}${rk[rank]}`
    );
  }
  function captureMove(rank, file, rows, cols) {
    lm[piece[1]][color][`${rows}${cols}`].push(
      `${piece[1 - color]}x${fl[file]}${rk[rank]}`
    );
  }
  function normalCheck(rank, file, rows, cols) {
    lm[piece[1]][color][`${rows}${cols}`].push(
      `${piece[1 - color]}${fl[file]}${rk[rank]}+`
    );
  }
  function captureCheck(rank, file, rows, cols) {
    lm[piece[1]][color][`${rows}${cols}`].push(
      `${piece[1 - color]}x${fl[file]}${rk[rank]}+`
    );
  }

  for (const locOfPiece of iGP[piece[1 - color]]) {
    let rank = locOfPiece[0],
      file = locOfPiece[1];
    let rows = rank,
      cols = file;
    if (!lm[piece[1]][color][`${rows}${cols}`]) {
      lm[piece[1]][color][`${rows}${cols}`] = [];
    }
    /* file up */
    while (--rank >= 0) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(king);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king, color, piece[1]) ||
            right.rightDiag([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (RNK.rank([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          board[rank][file] = curr_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king, color, piece[1]) ||
          right.rightDiag([rank, file], king, color, piece[1]) ||
          RNK.rank([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[rank][file] == " ") {
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (RNK.rank([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
      }
    }
    /* file down */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++rank <= 7) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(king);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king, color, piece[1]) ||
            right.rightDiag([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (RNK.rank([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          board[rank][file] = curr_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king, color, piece[1]) ||
          right.rightDiag([rank, file], king, color, piece[1]) ||
          RNK.rank([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[rank][file] == " ") {
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (RNK.rank([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
      }
    }
    /* rank left */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (--file >= 0) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(king);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king, color, piece[1]) ||
            right.rightDiag([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (FL.file([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          board[rank][file] = curr_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king, color, piece[1]) ||
          right.rightDiag([rank, file], king, color, piece[1]) ||
          FL.file([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[rank][file]) {
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (FL.file([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
      }
    }
    /* rank right */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++file <= 7) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(king);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            left.leftDiag([rank, file], king, color, piece[1]) ||
            right.rightDiag([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (FL.file([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          board[rank][file] = curr_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          left.leftDiag([rank, file], king, color, piece[1]) ||
          right.rightDiag([rank, file], king, color, piece[1]) ||
          FL.file([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[rank][file]) {
        curr_piece = board[rank][file];
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        board[rank][file] = actual_piece;
        if (FL.file([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        board[rank][file] = curr_piece;
      }
    }
  }
}
module.exports = { findRook };
