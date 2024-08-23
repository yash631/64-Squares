const getBoard = require("./createBoard");

function updateInGamePcs(board, currentPcs, fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];

  if (piece === " ") {
    console.error("No piece at the source position.");
    return;
  }
  const pieceList = currentPcs[piece];
  const index = pieceList.findIndex(
    (pos) => pos[0] === fromRow && pos[1] === fromCol
  );

  if (index === -1) {
    console.error("Piece not found in the inGamePcs object.");
    return;
  }
  pieceList[index] = [toRow, toCol];
  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = " ";
  
}

module.exports = { updateInGamePcs };