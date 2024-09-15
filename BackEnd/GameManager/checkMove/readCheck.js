function findCheck(color, inGamePcs, board, piece, source, oppKingPos) {
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
      [-1, 1],
      [-1, -1],
    ], // Black pawn attacking (reverse direction of white)
  };

  if (piece === "P" || piece === "p") {
    if (directions[piece].some(([dx, dy]) => {
      const newRow = srcRow + dx;
      const newCol = srcCol + dy;
      return newRow === oppKingRow && newCol === oppKingCol;
    })) {
      return true; // Return true if the pawn can check the king
    }
  }

  if (piece.toUpperCase() === "N") {
    if (directions.N.some(([dx, dy]) => {
      const newRow = srcRow + dx;
      const newCol = srcCol + dy;
      return newRow === oppKingRow && newCol === oppKingCol;
    })) {
      return true; // Return true if the knight can check the king
    }
  }

  function canGiveCheck(pieceType, pieceRow, pieceCol) {
    const validDirections = directions[pieceType.toUpperCase()] || [];

    for (const [dx, dy] of validDirections) {
      let row = pieceRow + dx;
      let col = pieceCol + dy;

      while (row >= 0 && row < 8 && col >= 0 && col < 8) {
        const currentSquare = board[row][col];

        if (row === oppKingRow && col === oppKingCol) {
          return true; // The piece is putting the king in check
        }

        if (currentSquare !== " ") {
          break; // Blocked by another piece
        }

        row += dx;
        col += dy;
      }
    }
    return false;
  }

  const PIECES = color ? ["R", "B", "Q"] : ["r", "b", "q"];

  for (const pieceType of PIECES) {
    if (inGamePcs[pieceType]) {
      for (const [pieceRow, pieceCol] of inGamePcs[pieceType]) {

        if (canGiveCheck(pieceType, pieceRow, pieceCol)) {
          return true; 
        }
      }
    }
  }

  return false;
}

module.exports = { findCheck };
