const left = require("./findForCheck/leftDiagonal");
const right = require("./findForCheck/rightDiagonal");
const RNK = require("../Rook/findForCheck/rank");
const FL = require("../Rook/findForCheck/file");
const not = require("../../notations");

function findBishop(color, lm, ALLPCS, iGP, rk, fl, board, piece,isInCheck) {
  const king = not.KING[1 - color];
  const actual_piece = piece[1 - color];
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
    /* left diagonal up-left */
    while (--rank >= 0 && --file >= 0) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(`${king}${fl[file]}${rk[rank]}`);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            RNK.rank([rank, file], king, color, piece[1]) ||
            FL.file([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (right.rightDiag([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[rank][file] = curr_piece;
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          RNK.rank([rank, file], king, color, piece[1]) ||
          FL.file([rank, file], king, color, piece[1]) ||
          right.rightDiag([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[file][rank] == " ") {
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (right.rightDiag([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
      }
    }
    /* left diagonal down-right */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++rank <= 7 && ++file <= 7) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(`${king}${fl[file]}${rk[rank]}`);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            RNK.rank([rank, file], king, color, piece[1]) ||
            FL.file([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (right.rightDiag([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[rank][file] = curr_piece;
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        break;
      } else if (board[rank][file] != " ") {
        /* Check for same color pieces */
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          RNK.rank([rank, file], king, color, piece[1]) ||
          FL.file([rank, file], king, color, piece[1]) ||
          right.rightDiag([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[rank][file] == " ") {
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (right.rightDiag([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
      }
    }

    /* right diagonal down-left */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (++rank <= 7 && --file >= 0) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(`${king}${fl[file]}${rk[rank]}`);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            RNK.rank([rank, file], king, color, piece[1]) ||
            FL.file([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (left.leftDiag([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[rank][file] = curr_piece;
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          RNK.rank([rank, file], king, color, piece[1]) ||
          FL.file([rank, file], king, color, piece[1]) ||
          left.leftDiag([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[rank][file] == " ") {
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (left.leftDiag([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
      }
    }
    /* right diagonal up-right */
    (rank = locOfPiece[0]), (file = locOfPiece[1]);
    while (--rank >= 0 && ++file <= 7) {
      if (board[rank][file] == king) {
        lm[piece[1]][color][`${rows}${cols}`].push(`${king}${fl[file]}${rk[rank]}`);
      }
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        /* For Queen */
        if (piece[1] == "q") {
          if (
            RNK.rank([rank, file], king, color, piece[1]) ||
            FL.file([rank, file], king, color, piece[1])
          ) {
            captureCheck(rank, file, rows, cols);
            break;
          }
        }
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (left.leftDiag([rank, file], king, color, piece[1])) {
          captureCheck(rank, file, rows, cols);
          board[rank][file] = curr_piece;
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          break;
        }
        captureMove(rank, file, rows, cols);
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        break;
      } else if (board[rank][file] != " ") {
        break;
      } else if (piece[1] == "q") {
        /* For Queen */
        if (
          RNK.rank([rank, file], king, color, piece[1]) ||
          FL.file([rank, file], king, color, piece[1]) ||
          left.leftDiag([rank, file], king, color, piece[1])
        ) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
      } else if (board[rank][file] == " ") {
        curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (left.leftDiag([rank, file], king, color, piece[1])) {
          normalCheck(rank, file, rows, cols);
        } else {
          normalMove(rank, file, rows, cols);
        }
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
      }
    }
  }
}
module.exports = { findBishop };
