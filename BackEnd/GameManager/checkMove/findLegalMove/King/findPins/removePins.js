/*
const getBoard = require("../../../../Board/createBoard");
const not = require("../../../notations");
const board = getBoard.Board;
const inGamePcs = getBoard.createInGamePcs(board);
const showPin = require("./showPinObjects");
const newPin = require("./checkNewPins");

// Helper function to determine if a piece is currently pinned
function isPiecePinned(piece, piecePos, kingPos, directions) {
  const color = /[a-z]/.test(piece) ? 0 : 1; // Determine color based on piece notation

  // Check if the piece is pinned in any direction
  for (const direction of directions) {
    let row = piecePos[0] + direction.move[0];
    let col = piecePos[1] + direction.move[1];

    let pinnedPiece = null;

    while (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
      const boardPiece = board[row][col];

      if (boardPiece === " ") {
        row += direction.move[0];
        col += direction.move[1];
        continue;
      }

      if (
        (color === 1 && /[PNBRQK]/.test(boardPiece)) ||
        (color === 0 && /[pnbrqk]/.test(boardPiece))
      ) {
        if (pinnedPiece !== null) return false; // Found another piece before the pinning piece
        pinnedPiece = [row, col, boardPiece.toLowerCase()];
      } else {
        if (isPinningPiece(boardPiece, direction)) {
          return true; // Piece is pinned if pinning piece is found in the direction
        }
        return false; // Stop checking further if not pinned
      }

      row += direction.move[0];
      col += direction.move[1];
    }
  }
  return false; // Piece is not pinned if no valid pin found
}

// Function to remove unpinned pieces from newPin.pinnedPcs and newPin.pinningPcs
function removeUnpinnedPieces() {
  const directions = not.DIRECTIONS; // Get all possible movement directions

  // Check each side (Black and White)
  for (const color of [0, 1]) {
    const pinnedPieces = newPin.pinnedPcs[color];
    const pinningPieces = newPin.pinningPcs[1 - color];

    // Remove unpinned pieces from newPin.pinnedPcs
    for (const pieceType in pinnedPieces) {
      const pieceDict = pinnedPieces[pieceType];
      for (const position in pieceDict) {
        const pieceInfo = pieceDict[position];
        const piecePos = [parseInt(position[0]), parseInt(position[1])];

        // Check if the piece is still pinned
        if (
          !isPiecePinned(
            pieceType,
            piecePos,
            inGamePcs[not.KING[color]],
            directions
          )
        ) {
          console.log(
            `Removing unpinned piece ${pieceType} at [${piecePos[0]}, ${piecePos[1]}]`
          );
          delete newPin.pinnedPcs[color][pieceType][position]; // Remove from newPin.pinnedPcs

          // Remove from newPin.pinningPcs
          if (pinningPieces[pieceInfo[0]]) {
            delete pinningPieces[pieceInfo[0]][pieceInfo[1]]; // Remove from newPin.pinningPcs
          }
        }
      }

      // Clean up empty objects in newPin.pinnedPcs
      if (Object.keys(newPin.pinnedPcs[color][pieceType]).length === 0) {
        delete newPin.pinnedPcs[color][pieceType];
      }
    }

    // Clean up empty objects in newPin.pinningPcs
    for (const pieceType in newPin.pinningPcs[color]) {
      if (Object.keys(newPin.pinningPcs[color][pieceType]).length === 0) {
        delete newPin.pinningPcs[color][pieceType];
      }
    }
  }

  // Output debug information
  console.log("--> Updated Pinned Pieces <--");
  showPin.printTableWithSpacing(newPin.pinnedPcs);
  console.log("\n--> Updated Pinning Pieces <--");
  showPin.printTableWithSpacing(newPin.pinningPcs);
  console.log("\n");
}

module.exports = { removeUnpinnedPieces };
*/