function isDoubleCheck(kingPos, board, color) {
  const directions = {
    rook: [
      [0, 1], // right
      [0, -1], // left
      [1, 0], // down
      [-1, 0], // up
    ],
    bishop: [
      [1, 1], // down-right diagonal
      [1, -1], // down-left diagonal
      [-1, 1], // up-right diagonal
      [-1, -1], // up-left diagonal
    ],
    queen: [ // Queen can move like both a rook and a bishop
      [0, 1], // right
      [0, -1], // left
      [1, 0], // down
      [-1, 0], // up
      [1, 1], // down-right diagonal
      [1, -1], // down-left diagonal
      [-1, 1], // up-right diagonal
      [-1, -1], // up-left diagonal
    ],
    knight: [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ],
  };

  const isValidSquare = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  let checkDirections = {}; // To store the pieces that are giving check
  let checkingPieces = []; // To store the position and type of pieces giving check

  const checkDirectionForPiece = (r, c, dr, dc, pieceType) => {
    let row = r + dr;
    let col = c + dc;
    while (isValidSquare(row, col)) {
      const piece = board[row][col];

      if (piece === " ") {
        row += dr;
        col += dc;
        continue;
      }

      // Determine piece color and type
      const pieceColor = piece === piece.toUpperCase() ? 1 : 0; // 1 for white, 0 for black
      const pieceTypeOnBoard = piece.toLowerCase(); // lowercase to match the types: 'r', 'b', etc.

      if (pieceColor === color) break; // Stop if hitting own piece

      if (pieceTypeOnBoard === pieceType || (pieceTypeOnBoard === 'q' && pieceType === 'r') || (pieceTypeOnBoard === 'q' && pieceType === 'b')) {
        checkDirections[pieceTypeOnBoard] = true; // Mark direction if it matches the piece type
        checkingPieces.push({ type: piece, position: [row, col] }); // Add piece and its position
        break;
      }
      break; // Stop if hitting other piece
    }
  };

  const checkForPieceTypes = (kingRow, kingCol) => {
    // Check rook and queen directions (straight lines)
    for (const [dr, dc] of directions.rook) {
      checkDirectionForPiece(kingRow, kingCol, dr, dc, "r");
    }
    // Check bishop and queen directions (diagonals)
    for (const [dr, dc] of directions.bishop) {
      checkDirectionForPiece(kingRow, kingCol, dr, dc, "b");
    }
    // Check knight directions
    for (const [dr, dc] of directions.knight) {
      const row = kingRow + dr;
      const col = kingCol + dc;
      if (isValidSquare(row, col)) {
        const piece = board[row][col];
        const pieceColor = piece === piece.toUpperCase() ? 1 : 0;
        if (piece && piece.toLowerCase() === "n" && pieceColor !== color) {
          checkDirections["n"] = true;
          checkingPieces.push({ type: piece, position: [row, col] });
        }
      }
    }
  };

  const [kingRow, kingCol] = kingPos;
  checkForPieceTypes(kingRow, kingCol);

  return {
    isDoubleCheck: Object.keys(checkDirections).length >= 2,
    checkingPieces, // Return the pieces giving check with their positions
  };
}

module.exports = { isDoubleCheck };
