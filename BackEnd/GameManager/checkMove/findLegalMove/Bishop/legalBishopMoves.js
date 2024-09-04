const left = require("./findForCheck/leftDiagonal");
const right = require("./findForCheck/rightDiagonal");
const RNK = require("../Rook/findForCheck/rank");
const FL = require("../Rook/findForCheck/file");
const not = require("../../notations");
const pin = require("./afterPinnedMoves");

function findBishop(
  color,
  lm,
  ALLPCS,
  iGP,
  rk,
  fl,
  board,
  piece,
  isInCheck,
  pinnedPcs
) {
  const oppKing = not.KING[1 - color];
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
  function processDiagonal(
    board,
    locOfPiece,
    oppKing,
    pieceType,
    color,
    direction,
    lm,
    pinnedPcs,
    actual_piece,
    iGP,
    RNK,
    FL,
    right,
    left,
    captureCheck,
    captureMove,
    normalCheck,
    normalMove
  ) {
    let [rank, file] = locOfPiece;
    const [rankChange, fileChange] = direction;

    while (
      rank + rankChange >= 0 &&
      rank + rankChange <= 7 &&
      file + fileChange >= 0 &&
      file + fileChange <= 7
    ) {
      rank += rankChange;
      file += fileChange;

      if (board[rank][file] === oppKing) {
        lm[pieceType][color][`${locOfPiece[0]}${locOfPiece[1]}`].push(
          `${oppKing}${fl[file]}${rk[rank]}`
        );
      }

      if (ALLPCS[1 - color].includes(board[rank][file])) {
        if (pieceType === "q") {
          if (
            RNK.rank([rank, file], oppKing, color, pieceType) ||
            FL.file([rank, file], oppKing, color, pieceType)
          ) {
            captureCheck(rank, file, locOfPiece[0], locOfPiece[1]);
            break;
          }
        }
        let curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (
          right.rightDiag([rank, file], oppKing, color, pieceType) ||
          left.leftDiag([rank, file], oppKing, color, pieceType)
        ) {
          captureCheck(rank, file, locOfPiece[0], locOfPiece[1]);
          board[rank][file] = curr_piece;
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          break;
        }
        captureMove(rank, file, locOfPiece[0], locOfPiece[1]);
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        break;
      } else if (board[rank][file] !== " ") {
        break;
      } else if (pieceType === "q") {
        if (
          RNK.rank([rank, file], oppKing, color, pieceType) ||
          FL.file([rank, file], oppKing, color, pieceType) ||
          right.rightDiag([rank, file], oppKing, color, pieceType) ||
          left.leftDiag([rank,file],oppKing,color,pieceType)
        ) {
          normalCheck(rank, file, locOfPiece[0], locOfPiece[1]);
        } else {
          normalMove(rank, file, locOfPiece[0], locOfPiece[1]);
        }
      } else if (board[rank][file] === " ") {
        let curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (right.rightDiag([rank, file], oppKing, color, pieceType) ||
            left.leftDiag([rank,file],oppKing,color,pieceType)) {
          normalCheck(rank, file, locOfPiece[0], locOfPiece[1]);
        } else {
          normalMove(rank, file, locOfPiece[0], locOfPiece[1]);
        }
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
      }
    }
  }

  for (const locOfPiece of iGP[piece[1 - color]]) {
    const rows = locOfPiece[0],
      cols = locOfPiece[1];
    if (!lm[piece[1]][color][`${locOfPiece[0]}${locOfPiece[1]}`]) {
      lm[piece[1]][color][`${locOfPiece[0]}${locOfPiece[1]}`] = [];
    }
    /* Check if the Piece is pinned to the oppKing */

    const pinPos = `${rows}${cols}`;
    const pinnedPiece = pinnedPcs[color]?.[piece[1 - color]]?.[pinPos];

    if (pinnedPiece) {
      const pinnedPieceType = pinnedPiece[0];
      const pinnedPiecePosition = pinnedPiece[3];
      const isPinnedPieceBishopOrQueen = ["Q", "q", "B", "b"].includes(
        pinnedPieceType
      );

      if (
        isPinnedPieceBishopOrQueen &&
        (rows == pinnedPiecePosition[0] || cols == pinnedPiecePosition[1])
      ) {
        continue;
      } else {
        pin.findMovesAfterPin(
          piece[1],
          actual_piece,
          color,
          pinnedPcs,
          lm,
          board,
          iGP,
          [rows, cols]
        );
        continue;
      }
    }
      /* Process each diagonal */
    // left diagonal up-left
    processDiagonal(
      board,
      locOfPiece,
      oppKing,
      piece[1],
      color,
      [-1, -1],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      right,
      left,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );

    // left diagonal down-right
    processDiagonal(
      board,
      locOfPiece,
      oppKing,
      piece[1],
      color,
      [1, 1],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      right,
      left,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );

    // right diagonal down-left
    processDiagonal(
      board,
      locOfPiece,
      oppKing,
      piece[1],
      color,
      [1, -1],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      right,
      left,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );

    // right diagonal up-right
    processDiagonal(
      board,
      locOfPiece,
      oppKing,
      piece[1],
      color,
      [-1, 1],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      right,
      left,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );
  }
}
module.exports = { findBishop };
