const not = require("../../notations");

function findMovesAfterPin(
  pieceToPush,
  actualPiece,
  color,
  pinnedPcs,
  lm,
  board,
  inGamePcs,
  pinnedPiecePos
) {
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
    console.log(
      "i am running",
      [startRow, startCol],
      [kingRow, kingCol],
      [endRow, endCol],
      direction
    );
    let row = startRow,
      col = startCol;

    /* Add moves until pinned piece reaches king */
    while (row !== kingRow && col !== kingCol) {
      if (direction === "right-up") {
        row++;
        col--;
      } else if (direction === "right-down") {
        row--;
        col++;
      } else if (direction === "left-up") {
        row++;
        col++;
      } else if (direction === "left-down") {
        row--;
        col--;
      }
      if (row === kingRow && col === kingCol) {
        break;
      }
      lm[pieceToPush][color][`${startRow}${startCol}`].push(
        `${actualPiece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
    (row = startRow), (col = startCol);

    /* Add moves until pinned piece reaches the pinningPiece */
    while (row !== endRow && col !== endCol) {
      if (direction === "right-up") {
        row--;
        col++;
      } else if (direction === "right-down") {
        row++;
        col--;
      } else if (direction === "left-up") {
        row--;
        col--;
      } else if (direction === "left-down") {
        row++;
        col++;
      }
      if (row == endRow && col == endCol) {
        break;
      }
      lm[pieceToPush][color][`${startRow}${startCol}`].push(
        `${actualPiece}${not.FILE[col]}${not.RANK[row]}`
      );
      pinnedPcs[color][actualPiece][pinnedPieceKey][6].push(
        `${pinningPiece}${not.FILE[col]}${not.RANK[row]}`
      );
    }

    /* Add the capture move */
    lm[pieceToPush][color][`${startRow}${startCol}`].push(
      `${actualPiece}x${not.FILE[pinningPiecePos[1]]}${
        not.RANK[pinningPiecePos[0]]
      }`
    );
    pinnedPcs[color][actualPiece][pinnedPieceKey][5] =
      lm[pieceToPush][color][`${startRow}${startCol}`];

    /* Add pinning piece moves till it touches an edge of the board */
    (row = endRow), (col = endCol);
    while (row >= 0 && col >= 0 && row <= 7 && col <= 7) {
      if (direction === "right-up") {
        row--;
        col++;
      } else if (direction === "right-down") {
        row++;
        col--;
      } else if (direction === "left-up") {
        row--;
        col--;
      } else if (direction === "left-down") {
        row++;
        col++;
      }
      if (row > 7 || row < 0 || col > 7 || col < 0) {
        break;
      }
      pinnedPcs[color][actualPiece][pinnedPieceKey][6].push(
        `${pinningPiece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
  }

  if (kingPos[0] > pinnedPiecePos[0] && kingPos[1] > pinnedPiecePos[1]) {
    /* Check from Left-Diagonal left */
    addMoves(
      pinnedPiecePos[0],
      pinnedPiecePos[1],
      kingPos[0],
      kingPos[1],
      pinningPiecePos[0],
      pinningPiecePos[1],
      "left-up"
    );
  } else if (kingPos[0] < pinnedPiecePos[0] && kingPos[1] < pinnedPiecePos[1]) {
    /* Check from Left-Diagonal right */
    addMoves(
      pinnedPiecePos[0],
      pinnedPiecePos[1],
      kingPos[0],
      kingPos[1],
      pinningPiecePos[0],
      pinningPiecePos[1],
      "left-down"
    );
  } else if (kingPos[0] < pinnedPiecePos[0] && kingPos[1] > pinnedPiecePos[1]) {
    /* Check from Right-Diagonal left */
    addMoves(
      pinnedPiecePos[0],
      pinnedPiecePos[1],
      kingPos[0],
      kingPos[1],
      pinningPiecePos[0],
      pinningPiecePos[1],
      "right-down"
    );
  } else if (kingPos[0] > pinnedPiecePos[0] && kingPos[1] < pinnedPiecePos[1]) {
    /* Check from Right-Diagonal right */
    addMoves(
      pinnedPiecePos[0],
      pinnedPiecePos[1],
      kingPos[0],
      kingPos[1],
      pinningPiecePos[0],
      pinningPiecePos[1],
      "right-up"
    );
  }
}
module.exports = { findMovesAfterPin };
