const not = require("../../notations");
const getBoard = require("../../../Board/createBoard");

function calculateBlockedSquares(
  pinnedPiece,
  row,
  col,
  blockedSquares,
  color,
  board
) {
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
    queen: [
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

  // Check if square is within board boundaries
  const isValidSquare = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // find Rook, Bishop & Queen squares
  const BishopRookQueen = (dirList) => {
    for (const [dRow, dCol] of dirList) {
      let r = row;
      let c = col;
      while (isValidSquare(r, c)) {
        r += dRow;
        c += dCol;
        if (isValidSquare(r, c)) {
          if (board[r][c] === " ") {
            blockedSquares.push(`${not.FILE[c]}${not.RANK[r]}`); // Empty square
          } else if (board[r][c].color !== color) {
            blockedSquares.push(`${not.FILE[c]}${not.RANK[r]}`); // Opponent piece
            break; // Stop after capturing opponent
          } else {
            break; // Friendly piece
          }
        }
      }
    }
  };

  // find knight squares
  const Knight = () => {
    for (const [dRow, dCol] of directions.knight) {
      const r = row + dRow;
      const c = col + dCol;
      if (isValidSquare(r, c)) {
        if (board[r][c] === " " || board[r][c].color !== color) {
          blockedSquares.push(`${not.FILE[c]}${not.RANK[r]}`);
        }
      }
    }
  };

  // find pawn squares
  const Pawn = () => {
    const dir = color === 1 ? -1 : 1; // 1 for white, -1 for black
    if (
      isValidSquare(row + dir, col - 1) &&
      board[row + dir][col - 1] !== " " &&
      board[row + dir][col - 1].color !== color
    ) {
      blockedSquares.push(`${not.FILE[col - 1]}${not.RANK[row + dir]}`);
    }
    if (
      isValidSquare(row + dir, col + 1) &&
      board[row + dir][col + 1] !== " " &&
      board[row + dir][col + 1].color !== color
    ) {
      blockedSquares.push(`${not.FILE[col + 1]}${not.RANK[row + dir]}`);
    }
  };

  // Determine the piece and call appropriate handler
  switch (pinnedPiece) {
    case "r": 
      BishopRookQueen(directions.rook);
      break;
    case "b": 
      BishopRookQueen(directions.bishop);
      break;
    case "q": 
      BishopRookQueen(directions.queen);
      break;
    case "n":
      Knight();
      break;
    case "p": 
      Pawn();
      break;
    default:
      console.log("Unknown piece");
      break;
  }
}

function findSquares(pinnedPcs, color, blockedSquares) {
  const board = getBoard.Board;
  for (const pinnedPiece in pinnedPcs[color]) {
    let row, col;
    for (const uniquePiece in pinnedPcs[color][pinnedPiece]) {
      row = pinnedPcs[color][pinnedPiece][uniquePiece][1][0];
      col = pinnedPcs[color][pinnedPiece][uniquePiece][1][1];
    }
    calculateBlockedSquares(
      pinnedPiece,
      row,
      col,
      blockedSquares,
      color,
      board
    );
  }
}
module.exports = { findSquares };
