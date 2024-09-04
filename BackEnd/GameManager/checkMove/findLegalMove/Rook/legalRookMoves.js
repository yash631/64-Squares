const RNK = require("./findForCheck/rank");
const FL = require("./findForCheck/file");
const left = require("../Bishop/findForCheck/leftDiagonal");
const right = require("../Bishop/findForCheck/rightDiagonal");
const not = require("../../notations");
const pin = require("./afterPinnedMoves");

function findRook(
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

  // Function to handle the movement processing
  function processDirection(
    board,
    locOfPiece,
    king,
    pieceType,
    color,
    direction,
    lm,
    pinnedPcs,
    actual_piece,
    iGP,
    RNK,
    FL,
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

      if (board[rank][file] === king) {
        lm[pieceType][color][`${locOfPiece[0]}${locOfPiece[1]}`].push(
          `${king}${fl[file]}${rk[rank]}`
        );
      }

      if (ALLPCS[1 - color].includes(board[rank][file])) {
        if (pieceType === "q") {
          if (
            left.leftDiag([rank, file], king, color, pieceType) ||
            right.rightDiag([rank, file], king, color, pieceType)
          ) {
            captureCheck(rank, file, locOfPiece[0], locOfPiece[1]);
            break;
          }
        }

        let curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (
          RNK.rank([rank, file], king, color, pieceType) ||
          FL.file([rank, file], king, color, pieceType)
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
          RNK.rank([rank, file], king, color, pieceType) ||
          FL.file([rank, file], king, color, pieceType) ||
          left.leftDiag([rank,file],king,color,pieceType) ||
          right.rightDiag([rank,file],king,color,pieceType)
        ) {
          console.log("normalcheck");
          normalCheck(rank, file, locOfPiece[0], locOfPiece[1]);
        } else {
          normalMove(rank, file, locOfPiece[0], locOfPiece[1]);
        }
      } else if (board[rank][file] === " ") {
        let curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        if (RNK.rank([rank, file], king, color, pieceType) ||
            FL.file([rank,file],king,color,pieceType)) {
          normalCheck(rank, file, locOfPiece[0], locOfPiece[1]);
        } else {
          normalMove(rank, file, locOfPiece[0], locOfPiece[1]);
        }
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
      }
    }
  }

  // Main logic
  for (const locOfPiece of iGP[piece[1 - color]]) {
    const rows = locOfPiece[0],
      cols = locOfPiece[1];
    if (!lm[piece[1]][color][`${rows}${cols}`]) {
      lm[piece[1]][color][`${rows}${cols}`] = [];
    }
    /* Check if the Piece is pinned to the king */

    const pinPos = `${rows}${cols}`;
    const pinnedPiece = pinnedPcs[color]?.[piece[1 - color]]?.[pinPos];

    if (pinnedPiece) {
      const pinnedPieceType = pinnedPiece[0];
      const pinnedPiecePosition = pinnedPiece[3];
      const isPinnedPieceRookOrQueen = ["Q", "q", "R", "r"].includes(
        pinnedPieceType
      );

      if (
        isPinnedPieceRookOrQueen &&
        rows !== pinnedPiecePosition[0] &&
        cols !== pinnedPiecePosition[1]
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

    /* Process each direction */
    // File Up
    processDirection(
      board,
      locOfPiece,
      king,
      piece[1],
      color,
      [-1, 0],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );
    // File Down
    processDirection(
      board,
      locOfPiece,
      king,
      piece[1],
      color,
      [1, 0],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );
    // Rank Left
    processDirection(
      board,
      locOfPiece,
      king,
      piece[1],
      color,
      [0, -1],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );
    // Rank Right
    processDirection(
      board,
      locOfPiece,
      king,
      piece[1],
      color,
      [0, 1],
      lm,
      pinnedPcs,
      actual_piece,
      iGP,
      RNK,
      FL,
      captureCheck,
      captureMove,
      normalCheck,
      normalMove
    );
  }
}
module.exports = { findRook };
