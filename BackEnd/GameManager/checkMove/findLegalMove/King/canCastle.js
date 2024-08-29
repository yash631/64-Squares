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
module.exports = { kingRookCastle };
