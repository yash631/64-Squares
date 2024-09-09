const not = require("../../notations");
const RNK = require("../Rook/findForCheck/rank");
const FL = require("../Rook/findForCheck/file");
const left = require("../Bishop/findForCheck/leftDiagonal");
const right = require("../Bishop/findForCheck/rightDiagonal");
const getBoard = require("../../../Board/createBoard");

function findMovesAfterPin(
  pinnedPiece,
  actualPiece,
  color,
  pinnedPcs,
  lm,
  inGamePcs,
  pinnedPiecePos,
  checkInfo
) {
  function captureCheck(rank, file, rows, cols, checkPieceInfo) {
    const move = `${actualPiece}x${not.FILE[cols]}${not.RANK[rows]}+`;
    checkInfo[color][move] = {
      checkPiece: checkPieceInfo.piece,
      rank: checkPieceInfo.rank,
      file: checkPieceInfo.file,
    };
    lm[pinnedPiece][color][`${rank}${file}`].push(move);
  }
  function captureMove(rank, file, rows, cols) {
    lm[pinnedPiece][color][`${rank}${file}`].push(
      `${actualPiece}x${not.FILE[cols]}${not.RANK[rows]}`
    );
  }
  function normalMove(rank, file, rows, cols) {
    lm[pinnedPiece][color][`${rank}${file}`].push(
      `${actualPiece}${not.FILE[cols]}${not.RANK[rows]}`
    );
  }
  function normalCheck(rank, file, rows, cols, checkPieceInfo) {
    const move = `${actualPiece}${not.FILE[cols]}${not.RANK[rows]}+`;
    checkInfo[color][move] = {
      checkPiece: checkPieceInfo.piece,
      rank: checkPieceInfo.rank,
      file: checkPieceInfo.file,
    };
    lm[pinnedPiece][color][`${rank}${file}`].push(move);
  }

  function findForcheck(currPinnedPiecePos) {
    const oppKing = not.KING[1 - color];
    const [rank, file] = currPinnedPiecePos;
    if (pinnedPiece == "q") {
      return (
        RNK.rank([rank, file], oppKing, color, "q") ||
        FL.file([rank, file], oppKing, color, "q") ||
        right.rightDiag([rank, file], oppKing, color, "q") ||
        left.leftDiag([rank, file], oppKing, color, "q")
      );
    } else {
      return (
        RNK.rank([rank, file], oppKing, color, "r") ||
        FL.file([rank, file], oppKing, color, "r")
      );
    }
  }
  const board = getBoard.Board;
  const pinnedPieceKey = `${pinnedPiecePos[0]}${pinnedPiecePos[1]}`;
  const kingPos = inGamePcs[not.KING[color]][0];
  let pinningPiece = pinnedPcs[color][pinnedPiece][pinnedPieceKey][0];

  /* To push the moves of Pinning Piece */
  if (color) {
    pinningPiece = pinningPiece.toLowerCase();
  } else {
    pinningPiece = pinningPiece.toUpperCase();
  }
  const pinningPiecePos = pinnedPcs[color][pinnedPiece][pinnedPieceKey][3];

  /* Function to add moves in the given direction */
  function addMoves(
    startRow,
    startCol,
    kingRow,
    kingCol,
    endRow,
    endCol,
    direction
  ) {
    let row = startRow,
      col = startCol;
    let curr_piece;
    let checkPieceInfo;
    if (direction == "right" || direction == "left") {
      /* Add moves until pinned piece reaches king */
      while (col !== kingCol) {
        if (direction === "right") {
          col--;
        } else {
          col++;
        }
        if (col == kingCol) break;
        if (board[row][col] != " ") break;
        curr_piece = board[row][col];
        board[row][col] = actualPiece;
        board[startRow][startCol] = " ";
        checkPieceInfo = findForcheck([row, col]);
        if (checkPieceInfo) {
          normalCheck(startRow, startCol, row, col, checkPieceInfo);
        } else {
          normalMove(startRow, startCol, row, col);
        }
        board[row][col] = curr_piece;
        board[startRow][startCol] = actualPiece;
      }
      col = startCol;
      /* Add moves until pinned piece reaches the pinningPiece */
      while (col !== endCol) {
        if (direction === "right") {
          col++;
        } else {
          col--;
        }
        if (col == endCol) break;
        if (board[row][col] != " ") break;
        curr_piece = board[row][col];
        board[row][col] = actualPiece;
        board[startRow][startCol] = " ";
        checkPieceInfo = findForcheck([row, col]);
        if (checkPieceInfo) {
          normalCheck(startRow, startCol, row, col, checkPieceInfo);
        } else {
          normalMove(startRow, startCol, row, col);
        }
        board[row][col] = curr_piece;
        board[startRow][startCol] = actualPiece;
      }
      curr_piece = board[row][col];
      board[row][col] = actualPiece;
      board[startRow][startCol] = " ";
      if (row == endRow && col == endCol) {
        /* Add the capture move */
        checkPieceInfo = findForcheck(pinningPiecePos);
        if (checkPieceInfo) {
          captureCheck(startRow, startCol, endRow, endCol, checkPieceInfo);
        } else {
          captureMove(startRow, startCol, endRow, endCol);
        }
      }
      board[row][col] = curr_piece;
      board[startRow][startCol] = actualPiece;
    } else if (direction == "up" || direction == "down") {
      /* Add moves until pinned piece reaches king */
      while (row !== kingRow) {
        if (direction === "up") {
          row++;
        } else {
          row--;
        }
        if (row == kingRow) break;
        if (board[row][col] != " ") break;
        curr_piece = board[row][col];
        board[row][col] = actualPiece;
        board[startRow][startCol] = " ";
        checkPieceInfo = findForcheck([row, col]);
        if (checkPieceInfo) {
          normalCheck(startRow, startCol, row, col, checkPieceInfo);
        } else {
          normalMove(startRow, startCol, row, col);
        }
        board[row][col] = curr_piece;
        board[startRow][startCol] = actualPiece;
      }
      row = startRow;
      /* Add moves until pinned piece reaches the pinningPiece */
      while (row !== endRow) {
        if (direction === "up") {
          row--;
        } else {
          row++;
        }
        if (row == endRow) break;
        if (board[row][col] != " ") break;
        curr_piece = board[row][col];
        board[row][col] = actualPiece;
        board[startRow][startCol] = " ";
        checkPieceInfo = findForcheck([row, col]);
        if (checkPieceInfo) {
          normalCheck(startRow, startCol, row, col, checkPieceInfo);
        } else {
          normalMove(startRow, startCol, row, col);
        }
        board[row][col] = curr_piece;
        board[startRow][startCol] = actualPiece;
      }
      curr_piece = board[row][col];
      board[row][col] = actualPiece;
      board[startRow][startCol] = " ";
      if (row == endRow && col == endCol) {
        /* Add the capture move */
        checkPieceInfo = findForcheck(pinningPiecePos);
        if (checkPieceInfo) {
          captureCheck(startRow, startCol, endRow, endCol, checkPieceInfo);
        } else {
          captureMove(startRow, startCol, endRow, endCol);
        }
      }
      board[row][col] = curr_piece;
      board[startRow][startCol] = actualPiece;
    }
  }

  if (kingPos[0] === pinnedPiecePos[0]) {
    if (kingPos[1] > pinnedPiecePos[1]) {
      /* Check from Rank right */
      addMoves(
        pinnedPiecePos[0],
        pinnedPiecePos[1],
        kingPos[0],
        kingPos[1],
        pinningPiecePos[0],
        pinningPiecePos[1],
        "left"
      );
    } else {
      /* Check from Rank left */
      addMoves(
        pinnedPiecePos[0],
        pinnedPiecePos[1],
        kingPos[0],
        kingPos[1],
        pinningPiecePos[0],
        pinningPiecePos[1],
        "right"
      );
    }
  } else if (kingPos[1] === pinnedPiecePos[1]) {
    if (kingPos[0] > pinnedPiecePos[0]) {
      /* Check from File up */
      addMoves(
        pinnedPiecePos[0],
        pinnedPiecePos[1],
        kingPos[0],
        kingPos[1],
        pinningPiecePos[0],
        pinningPiecePos[1],
        "up"
      );
    } else {
      /* Check from File down */
      addMoves(
        pinnedPiecePos[0],
        pinnedPiecePos[1],
        kingPos[0],
        kingPos[1],
        pinningPiecePos[0],
        pinningPiecePos[1],
        "down"
      );
    }
  }
}

module.exports = { findMovesAfterPin };
