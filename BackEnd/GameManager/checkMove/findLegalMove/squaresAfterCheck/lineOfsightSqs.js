const not = require("../../notations");

function LOS_Squares(whichPieceGaveCheck, piece_pos, kingPos, squareArray) {
  if (whichPieceGaveCheck === "n" || whichPieceGaveCheck === "p") {
    // Knights and pawns cannot be blocked
    return;
  }

  const [pieceRow, pieceCol] = piece_pos;
  const [kingRow, kingCol] = kingPos;

  let addRow = 0;
  let addCol = 0;

  if (kingRow === pieceRow) {
    // Horizontal (same rank)
    addCol = kingCol > pieceCol ? 1 : -1;
  } else if (kingCol === pieceCol) {
    // Vertical (same file)
    addRow = kingRow > pieceRow ? 1 : -1;
  } else if (Math.abs(kingRow - pieceRow) === Math.abs(kingCol - pieceCol)) {
    // Diagonal
    addRow = kingRow > pieceRow ? 1 : -1;  
    addCol = kingCol > pieceCol ? 1 : -1;  
  } else {
    return; 
  }

  let currentRow = pieceRow + addRow;
  let currentCol = pieceCol + addCol;

  while (currentRow !== kingRow || currentCol !== kingCol) {
    const square = `${not.FILE[currentCol]}${not.RANK[currentRow]}`;
    squareArray.push(square);

    currentRow += addRow;
    currentCol += addCol;
  }
}

module.exports = { LOS_Squares };
