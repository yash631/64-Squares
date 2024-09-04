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
      "Adding moves:",
      [startRow, startCol],
      [kingRow, kingCol],
      [endRow, endCol],
      direction
    );
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
        lm[pieceToPush][color][`${startRow}${startCol}`].push(
          `${actualPiece}${not.FILE[col]}${not.RANK[row]}`
        );
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
        lm[pieceToPush][color][`${startRow}${startCol}`].push(
          `${actualPiece}${not.FILE[col]}${not.RANK[row]}`
        );
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
        lm[pieceToPush][color][`${startRow}${startCol}`].push(
          `${actualPiece}${not.FILE[col]}${not.RANK[row]}`
        );
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
        lm[pieceToPush][color][`${startRow}${startCol}`].push(
          `${actualPiece}${not.FILE[col]}${not.RANK[row]}`
        );
        pinnedPcs[color][actualPiece][pinnedPieceKey][6].push(
          `${pinningPiece}${not.FILE[col]}${not.RANK[row]}`
        );
      }
    }

    /* Add the capture move */
    lm[pieceToPush][color][`${startRow}${startCol}`].push(
      `${actualPiece}x${not.FILE[pinningPiecePos[1]]}${
        not.RANK[pinningPiecePos[0]]
      }`
    );
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
