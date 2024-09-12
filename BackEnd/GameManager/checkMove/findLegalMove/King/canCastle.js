const not = require("../../notations");

function kingRookCastle(color, board, king, side) {
  let kingRank = not.KING[`pos${color}`][0],
    kingFile = not.KING[`pos${color}`][1],
    rookRank = not.ROOK[`pos${color}`][side][0],
    rookFile = not.ROOK[`pos${color}`][side][1];
  if (board[kingRank][kingFile] == king) {
    if (board[rookRank][rookFile] == not.ROOK[color]) {
      if (side == "k") {
        while (++kingFile < 7) {
          if (board[kingRank][kingFile] != " ") {
            return 0;
          }
        }
        return 1;
      } else if (side == "q") {
        while (--kingFile > 0) {
          if (board[kingRank][kingFile] != " ") {
            return 0;
          }
        }
        return 1;
      }
    }
    return 0;
  }
  return 0;
}

function isCastleCheck(color, board, oppKingPos, side) {
  const rookMoves = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const oppKing = not.KING[1 - color];
  let rookRank, rookFile;
  if (side === "k") {
    rookRank = color === 0 ? 0 : 7;
    rookFile = 5;
  } else if (side === "q") {
    rookRank = color === 0 ? 0 : 7;
    rookFile = 3;
  }
  for (const [dirRank, dirFile] of rookMoves) {
    let currRank = rookRank + dirRank;
    let currFile = rookFile + dirFile;
    while (currRank >= 0 && currRank <= 7 && currFile >= 0 && currFile <= 7) {
      const piece = board[currRank][currFile];
      if (piece === oppKing) {
        return { piece: "r", rank: currRank, file: currFile };
      }
      if (piece !== " ") {
        break;
      }
      currRank += dirRank;
      currFile += dirFile;
    }
  }
  return 0;
}

module.exports = { kingRookCastle, isCastleCheck };
