function findCheck(board, piece, source, oppKingPos) {
  const [srcRow, srcCol] = source;
  const [oppKingRow, oppKingCol] = oppKingPos;

  const directions = {  
    R: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ], // Rook: straight lines
    B: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ], // Bishop: diagonal moves
    Q: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ], // Queen: rook + bishop moves
    N: [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ], // Knight
    p: [
      [1, -1],
      [1, 1],
    ], // White pawn attacking (diagonal capture)
    P: [
      [-1, -1],
      [-1, 1],
    ], // Black pawn attacking (reverse direction)
  };

  // Handle pawns separately to avoid converting them to uppercase
  if (piece === "P" || piece === "p") {
    return directions[piece].some(([dx, dy]) => {
      const newRow = srcRow + dx;
      const newCol = srcCol + dy;
      return newRow === oppKingRow && newCol === oppKingCol;
    });
  }

  // For other pieces, convert to uppercase for uniform handling
  const pieceUpper = piece.toUpperCase(); 

  if (pieceUpper === "N") {
    return directions.N.some(([dx, dy]) => {
      const newRow = srcRow + dx;
      const newCol = srcCol + dy;
      return newRow === oppKingRow && newCol === oppKingCol;
    });
  }

  const validDirections = directions[pieceUpper] || [];
  for (const [dx, dy] of validDirections) {
    let row = srcRow + dx;
    let col = srcCol + dy;

    while (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const currentSquare = board[row][col];

      if (row === oppKingRow && col === oppKingCol) {
        return true; // The piece is putting the king in check
      }

      if (currentSquare !== " ") {
        break;
      }

      row += dx;
      col += dy;
    }
  }

  return false;
}

module.exports = { findCheck };
