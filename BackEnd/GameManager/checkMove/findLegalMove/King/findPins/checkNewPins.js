const getBoard = require("../../../../Board/createBoard");
const not = require("../../../notations");
const board = getBoard.Board;
const showPin = require("./showPinObjects");

// Data structures to hold information about pinned and pinning pieces
let pinnedPcs = {
  0: {}, // Black side
  1: {}, // White side
};

let pinningPcs = {
  0: {}, // Black side
  1: {}, // White side
};

// Function to find and store all existing pins on the board for a given color
function findExistingPins(color) {
  const inGamePcs = getBoard.createInGamePcs(board);
  const king = not.KING[color]; // Get the king's notation based on color (0 for Black, 1 for White)
  const kingPos = [inGamePcs[king][0][0], inGamePcs[king][0][1]]; // Get the king's position
  const directions = not.DIRECTIONS; // Get all possible movement directions for pins

  directions.forEach((direction) => {
    let row = kingPos[0] + direction.move[0]; // Calculate the initial position in the current direction
    let col = kingPos[1] + direction.move[1];

    let pinnedPiece = null; // Variable to keep track of the pinned piece

    // Move in the current direction until we hit the edge of the board
    while (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
      const piece = board[row][col]; // Get the piece at the current position

      if (piece === " ") {
        // If the square is empty, move to the next square in the same direction
        row += direction.move[0];
        col += direction.move[1];
        continue;
      }

      // Check if the piece belongs to the same color as the king
      if (
        (color === 1 && /[PNBRQK]/.test(piece)) || // White pieces
        (color === 0 && /[pnbrqk]/.test(piece)) // Black pieces
      ) {
        if (pinnedPiece !== null) break; // If there was a pinned piece before, stop searching
        pinnedPiece = [row, col, piece.toLowerCase()]; // Mark this piece as the pinned piece
      } else {
        // Check if the current piece is capable of pinning
        if (isPinningPiece(piece, direction)) {
          // Store the details of the pin if it's valid
          storePinDetails(pinnedPiece, [row, col, piece.toLowerCase()], color);
        }
        break; // Stop searching in this direction
      }

      // Move to the next square in the same direction
      row += direction.move[0];
      col += direction.move[1];
    }
  });
}

// Helper function to determine if a piece can pin in a given direction
function isPinningPiece(piece, direction) {
  const straight =
    (Math.abs(direction.move[0]) === 1 && direction.move[1] === 0) ||
    (Math.abs(direction.move[1]) === 1 && direction.move[0] === 0);

  const diagonal =
    Math.abs(direction.move[0]) === 1 && Math.abs(direction.move[1]) === 1;

  // Check if the piece can be a pinning piece based on its type and the direction
  if (/[pnbrqk]/.test(piece)) {
    // Black pieces
    if (
      piece === "q" ||
      (piece === "r" && straight) ||
      (piece === "b" && diagonal)
    )
      return true;
  }

  if (/[PNBRQK]/.test(piece)) {
    // White pieces
    if (
      piece === "Q" ||
      (piece === "R" && straight) ||
      (piece === "B" && diagonal)
    )
      return true;
  }

  return false; // The piece cannot pin in this direction
}

// Function to store the details of a pin in the pinnedPcs and pinningPcs objects
function storePinDetails(pinnedPiece, pinningPiece, color) {
  if (pinnedPiece === null) return; // No pinned piece to store

  const [pinnedRow, pinnedCol, pinnedType] = pinnedPiece; // Unpack pinned piece details
  const [pinningRow, pinningCol, pinningType] = pinningPiece; // Unpack pinning piece details

  const pinnedKey = `${pinnedRow}${pinnedCol}`; // Unique key for the pinned piece position
  const pinningKey = `${pinningRow}${pinningCol}`; // Unique key for the pinning piece position

  // Get the square notation (e.g., "e4") for both pieces
  const pinnedSquare = not.FILE[pinnedCol] + not.RANK[pinnedRow];
  const pinningSquare = not.FILE[pinningCol] + not.RANK[pinningRow];

  // Add to pinnedPcs for the color of the pinned piece
  if (!pinnedPcs[color][pinnedType]) {
    pinnedPcs[color][pinnedType] = {};
  }

  pinnedPcs[color][pinnedType][pinnedKey] = [
    pinningType, // Type of the pinning piece
    [pinnedRow, pinnedCol], // Position of the pinned piece
    [pinnedSquare], // Square notation of the pinned piece
    [pinningRow, pinningCol], // Position of the pinning piece
    [pinningSquare], // Square notation of the pinning piece
  ];

  // Add to pinningPcs for the opposite color of the pinning piece
  const oppositeColor = 1 - color;
  if (!pinningPcs[oppositeColor][pinningType]) {
    pinningPcs[oppositeColor][pinningType] = {};
  }

  pinningPcs[oppositeColor][pinningType][pinningKey] = [pinnedType, pinnedKey];

  // Output debug information
  console.log(
    `Pinned piece ${pinnedType} at ${pinnedSquare} by ${pinningType} at ${pinningSquare}`
  );
}

// Function to detect pins and reset the pinnedPcs and pinningPcs objects
function detectPins() {
  pinnedPcs = {
    0: {},
    1: {},
  };
  pinningPcs = {
    0: {},
    1: {},
  };

  // Find pins for both black and white
  for (let i of [0, 1]) {
    findExistingPins(i);
  }

  // Print the updated pinnedPcs and pinningPcs objects
  console.log("--> Pinned Pieces <--");
  showPin.printTableWithSpacing(pinnedPcs);

  console.log("\n--> Pinning Pieces <--");
  showPin.printTableWithSpacing(pinningPcs);
}

// Make sure that when the module is accessed, it reflects the latest state
function getPinnedPcs() {
  return pinnedPcs;
}

function getPinningPcs() {
  return pinningPcs;
}

module.exports = { detectPins, getPinnedPcs, getPinningPcs };
