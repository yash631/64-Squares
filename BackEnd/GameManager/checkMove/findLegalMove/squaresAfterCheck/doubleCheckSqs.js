const not = require("../../notations");

function blockSquaresInDoubleCheck(
  kingPos,
  board,
  attackingPieces,
  blockedSquaresForKing
) {
  const directions = {
    r: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ],
    b: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    q: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    n: [ // Knight moves
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

  attackingPieces.forEach(({ type, position }) => {
    const [attackerRow, attackerCol] = position;
    const attackDirections = directions[type] || [];
    attackDirections.forEach(([dr, dc]) => {
      let row = attackerRow + dr;
      let col = attackerCol + dc;
      if (type === 'n') { // Knight moves are special
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
          blockedSquaresForKing.push(`${not.FILE[col]}${not.RANK[row]}`);
        }
      } else {
        while (row >= 0 && row < 8 && col >= 0 && col < 8) {
          blockedSquaresForKing.push(`${not.FILE[col]}${not.RANK[row]}`);
          if (board[row][col] !== " ") {
            if (board[row][col] !== "K" && board[row][col] !== "k") break;
          }
          row += dr;
          col += dc;
        }
      }
    });
  });
}

module.exports = { blockSquaresInDoubleCheck };
