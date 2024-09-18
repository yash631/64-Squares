const left = require("./findForCheck/leftDiagonal");
const right = require("./findForCheck/rightDiagonal");
const RNK = require("../Rook/findForCheck/rank");
const FL = require("../Rook/findForCheck/file");
const not = require("../../notations");
const pin = require("./afterPinnedMoves");
const newPin = require("../King/findPins/checkNewPins");

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
  checkInfo,
  gameid,
) {
  const oppKing = not.KING[1 - color];
  const actual_piece = piece[1 - color];
  let curr_piece;
  let pinnedPcs = newPin.getPinnedPcs();
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
  function normalCheck(rank, file, rows, cols, checkPieceInfo) {
    const move = `${piece[1 - color]}${fl[file]}${rk[rank]}+`;
    checkInfo[color][move] = {
      checkPiece: checkPieceInfo.piece,
      rank: checkPieceInfo.rank,
      file: checkPieceInfo.file,
    };
    lm[piece[1]][color][`${rows}${cols}`].push(move);
  }
  function captureCheck(rank, file, rows, cols, checkPieceInfo) {
    const move = `${piece[1 - color]}x${fl[file]}${rk[rank]}+`;
    checkInfo[color][move] = {
      checkPiece: checkPieceInfo.piece,
      rank: checkPieceInfo.rank,
      file: checkPieceInfo.file,
    };
    lm[piece[1]][color][`${rows}${cols}`].push(move);
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
    normalMove,
    gameid,
  ) {
    let [rank, file] = locOfPiece;
    const [rankChange, fileChange] = direction;
    let checkPieceInfo;
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
          checkPieceInfo =
            RNK.rank([rank, file], oppKing, color, pieceType,gameid) ||
            FL.file([rank, file], oppKing, color, pieceType,gameid);
          if (checkPieceInfo) {
            captureCheck(
              rank,
              file,
              locOfPiece[0],
              locOfPiece[1],
              checkPieceInfo
            );
            break;
          }
        }
        let curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        checkPieceInfo =
          right.rightDiag([rank, file], oppKing, color, pieceType, gameid) ||
          left.leftDiag([rank, file], oppKing, color, pieceType, gameid);
        if (checkPieceInfo) {
          captureCheck(
            rank,
            file,
            locOfPiece[0],
            locOfPiece[1],
            checkPieceInfo
          );
          board[rank][file] = curr_piece;
          board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
          break;
        }
        captureMove(rank, file, locOfPiece[0], locOfPiece[1]);
        board[rank][file] = curr_piece;
        board[locOfPiece[0]][locOfPiece[1]] = actual_piece;
        break;
      } else if (board[rank][file] !== " ") {
        lm[pieceType][color][`${locOfPiece[0]}${locOfPiece[1]}`].push(
          `${board[rank][file]}${fl[file]}${rk[rank]}`
        );
        break;
      } else if (pieceType === "q") {
        checkPieceInfo =
          RNK.rank([rank, file], oppKing, color, pieceType, gameid) ||
          FL.file([rank, file], oppKing, color, pieceType, gameid) ||
          right.rightDiag([rank, file], oppKing, color, pieceType, gameid) ||
          left.leftDiag([rank, file], oppKing, color, pieceType, gameid);
        if (checkPieceInfo) {
          normalCheck(rank, file, locOfPiece[0], locOfPiece[1], checkPieceInfo);
        } else {
          normalMove(rank, file, locOfPiece[0], locOfPiece[1]);
        }
      } else if (board[rank][file] === " ") {
        let curr_piece = board[rank][file];
        board[rank][file] = actual_piece;
        board[locOfPiece[0]][locOfPiece[1]] = " ";
        checkPieceInfo =
          right.rightDiag([rank, file], oppKing, color, pieceType, gameid) ||
          left.leftDiag([rank, file], oppKing, color, pieceType, gameid);
        if (checkPieceInfo) {
          normalCheck(rank, file, locOfPiece[0], locOfPiece[1], checkPieceInfo);
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
    const pinnedPiece = pinnedPcs[color]?.[piece[1]]?.[pinPos];
    // console.log("rows,cols and pinnedPiecepos : ",[rows,cols],pinnedPiece);
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
          iGP,
          [rows, cols],
          checkInfo,
          gameid,
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
      normalMove,
      gameid,
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
      normalMove,
      gameid,
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
      normalMove,
      gameid
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
      normalMove,
      gameid,
    );
  }
}
module.exports = { findBishop };
