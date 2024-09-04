const not = require("../../notations");
const RNK = require("../Rook/findForCheck/rank");
const FL = require("../Rook/findForCheck/file");
const left = require("../Bishop/findForCheck/leftDiagonal");
const right = require("../Bishop/findForCheck/rightDiagonal");

function findMovesAfterPin(
  pieceToPush,
  actualPiece, // pinned piece
  color,
  pinnedPcs,
  lm,
  board,
  inGamePcs,
  pinnedPiecePos
) {
  function captureCheck(rank, file, rows, cols) {
    lm[pieceToPush][color][`${rank}${file}`].push(
      `${actualPiece}x${not.FILE[cols]}${not.RANK[rows]}+`
    );
  }
  function captureMove(rank, file, rows, cols) {
    lm[pieceToPush][color][`${rank}${file}`].push(
      `${actualPiece}x${not.FILE[cols]}${not.RANK[rows]}`
    );
  }
  function normalMove(rank, file, rows, cols) {
    lm[pieceToPush][color][`${rank}${file}`].push(
      `${actualPiece}${not.FILE[cols]}${not.RANK[rows]}`
    );
  }
  function normalCheck(rank, file, rows, cols) {
    lm[pieceToPush][color][`${rank}${file}`].push(
      `${actualPiece}${not.FILE[cols]}${not.RANK[rows]}+`
    );
  }

  function findForcheck(currPinnedPiecePos) {
    const oppKing = not.KING[1 - color];
    const [rank, file] = currPinnedPiecePos;
    if (pieceToPush == "q") {
      return (
        RNK.rank([rank, file], oppKing, color, "q") ||
        FL.file([rank, file], oppKing, color, "q") ||
        right.rightDiag([rank, file], king, color, "q") ||
        left.leftDiag([rank, file], king, color, "q")
      );
    } else {
      return (
        RNK.rank([rank, file], oppKing, color, "r") ||
        FL.file([rank, file], oppKing, color, "r")
      );
    }
  }
  const pinnedPieceKey = `${pinnedPiecePos[0]}${pinnedPiecePos[1]}`;
  const kingPos = inGamePcs[not.KING[color]][0];
  let pinningPiece = pinnedPcs[color][actualPiece][pinnedPieceKey][0];
  if (color) {
    pinningPiece = pinningPiece.toUpperCase();
  }
  const pinningPiecePos = pinnedPcs[color][actualPiece][pinnedPieceKey][3];
  pinnedPcs[color][actualPiece][pinnedPieceKey][6] = [];

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

    if (direction == "right" || direction == "left") {
      /* Add moves until pinned piece reaches king */
      while (col !== kingCol) {
        if (direction === "right") {
          col--;
        } else {
          col++;
        }
        if (col == kingCol) break;
        if (findForcheck([row, col])) {
          normalCheck(startRow, startCol, row, col);
        } else {
          normalMove(startRow, startCol, row, col);
        }
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
        if (findForcheck([row, col])) {
          normalCheck(startRow, startCol, row, col);
        } else {
          normalMove(startRow, startCol, row, col);
        }
        pinnedPcs[color][actualPiece][pinnedPieceKey][6].push(
          `${pinningPiece}${not.FILE[col]}${not.RANK[row]}`
        );
      }
    } else if (direction == "up" || direction == "down") {
      /* Add moves until pinned piece reaches king */
      while (row !== kingRow) {
        console.log("running");
        if (direction === "up") {
          row++;
        } else {
          row--;
        }
        if (row == kingRow) break;
        if (findForcheck([row, col])) {
          normalCheck(startRow, startCol, row, col);
        } else {
          normalMove(startRow, startCol, row, col);
        }
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
        if (findForcheck([row, col])) {
          normalCheck(startRow, startCol, row, col);
        } else {
          normalMove(startRow, startCol, row, col);
        }
        pinnedPcs[color][actualPiece][pinnedPieceKey][6].push(
          `${pinningPiece}${not.FILE[col]}${not.RANK[row]}`
        );
      }
    }

    /* Add the capture move */
    if (findForcheck(pinningPiecePos)) {
      captureCheck(startRow, startCol, endRow, endCol);
    } else {
      captureMove(startRow, startCol, endRow, endCol);
    }

    pinnedPcs[color][actualPiece][pinnedPieceKey][5] =
      lm[pieceToPush][color][`${startRow}${startCol}`];

    /*  Add pinning piece moves till it touches an edge of the board */
    (row = endRow), (col = endCol);
    while (row >= 0 && col >= 0 && row <= 7 && col <= 7) {
      if (direction === "right") {
        col++;
      } else if (direction === "left") {
        col--;
      } else if (direction === "up") {
        row--;
      } else if (direction === "down") {
        row++;
      }
      if (row < 0 || row > 7 || col < 0 || col > 7) break;
      pinnedPcs[color][actualPiece][pinnedPieceKey][6].push(
        `${pinningPiece}${not.FILE[col]}${not.RANK[row]}`
      );
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
