const getBoard = require("../../../../Board/createBoard");
const not = require("../../../notations");
const board = getBoard.Board;
const inGamePcs = getBoard.createInGamePcs(board);
const showPin = require("./showPinObjects");

let pinnedPcs = {
  0: {}, // Black
  1: {}, // White
};

let pinningPcs = {
  0: {}, // Black
  1: {}, // White
};

function findExistingPins(color) {
  const king = not.KING[color];
  const kingPos = [inGamePcs[king][0][0], inGamePcs[king][0][1]];
  const directions = not.DIRECTIONS;

  directions.forEach((direction) => {
    let row = kingPos[0] + direction.move[0];
    let col = kingPos[1] + direction.move[1];

    let pinnedPiece = null;

    while (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
      const piece = board[row][col];

      if (piece === " ") {
        row += direction.move[0];
        col += direction.move[1];
        continue;
      }

      if (
        (color === 1 && /[PNBRQK]/.test(piece)) ||
        (color === 0 && /[pnbrqk]/.test(piece))
      ) {
        if (pinnedPiece !== null) break;
        pinnedPiece = [row, col, piece.toLowerCase()];
      } else {
        if (isPinningPiece(piece, direction)) {
          storePinDetails(pinnedPiece, [row, col, piece.toLowerCase()], color);
        }
        break;
      }

      row += direction.move[0];
      col += direction.move[1];
    }
  });
}

function isPinningPiece(piece, direction) {
  const straight =
    (Math.abs(direction.move[0]) === 1 && direction.move[1] === 0) ||
    (Math.abs(direction.move[1]) === 1 && direction.move[0] === 0);

  const diagonal =
    Math.abs(direction.move[0]) === 1 && Math.abs(direction.move[1]) === 1;

  if (/[pnbrqk]/.test(piece)) {
    if (
      piece === "q" ||
      (piece === "r" && straight) ||
      (piece === "b" && diagonal)
    )
      return true;
  }

  if (/[PNBRQK]/.test(piece)) {
    if (
      piece === "Q" ||
      (piece === "R" && straight) ||
      (piece === "B" && diagonal)
    )
      return true;
  }

  return false;
}

function storePinDetails(pinnedPiece, pinningPiece, color) {
  if (pinnedPiece === null) return;

  const [pinnedRow, pinnedCol, pinnedType] = pinnedPiece;
  const [pinningRow, pinningCol, pinningType] = pinningPiece;

  const pinnedKey = `${pinnedRow}${pinnedCol}`; 
  const pinningKey = `${pinningRow}${pinningCol}`; 

  const pinnedSquare = not.FILE[pinnedCol] + not.RANK[pinnedRow];
  const pinningSquare = not.FILE[pinningCol] + not.RANK[pinningRow];

  // Add to pinnedPcs
  if (!pinnedPcs[color][pinnedType]) {
    pinnedPcs[color][pinnedType] = {};
  }

  pinnedPcs[color][pinnedType][pinnedKey] = [
    pinningType,
    [pinnedRow, pinnedCol],
    [pinnedSquare],
    [pinningRow, pinningCol],
    [pinningSquare],
    [],
    [],
    [],
  ];

  // Add to pinningPcs of the opposite color
  const oppositeColor = 1 - color;
  if (!pinningPcs[oppositeColor][pinningType]) {
    pinningPcs[oppositeColor][pinningType] = {};
  }

  pinningPcs[oppositeColor][pinningType][pinningKey] = [pinnedType, pinnedKey];

  console.log(
    `Pinned piece ${pinnedType} at ${pinnedSquare} by ${pinningType} at ${pinningSquare}`
  );
  console.log("-->Pinned Pieces<--");
  showPin.printTableWithSpacing(pinnedPcs);
  console.log("\n-->Pinning Pieces<--");
  showPin.printTableWithSpacing(pinningPcs);
  console.log("\n");
}

module.exports = { findExistingPins, pinnedPcs, pinningPcs };
