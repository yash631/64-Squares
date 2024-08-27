function updateInGamePcs(board, piece, fromRow, fromCol, toRow, toCol) {
  if (board[fromRow][fromCol] === " ") {
    console.error("Piece not found in the inGamePcs object.");
    return;
  }
  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = " ";
}

module.exports = { updateInGamePcs };
