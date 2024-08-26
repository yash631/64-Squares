const getBoard = require("../../../../Board/createBoard");
function movesArray(square, totalMoves, king) {
  for (const moves of totalMoves) {
    let rank = square[0] + moves[0],
      file = square[1] + moves[1];
    if (
      rank >= 0 &&
      rank <= 7 &&
      file >= 0 &&
      file <= 7 &&
      getBoard.Board[rank][file] == king
    ) {
      return 1;
    }
  }
}
module.exports = { movesArray };
