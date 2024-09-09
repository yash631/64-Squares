const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");

function file(square, king, color, piece) {
  /* Up File */
  let rank = square[0],
    file = square[1];
  while (--rank >= 0) {
    if (getBoard.Board[rank][file] == king) {
      return { piece, rank : square[0], file : square[1] };
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  /* Down File */
  rank = square[0];
  while (++rank <= 7) {
    if (getBoard.Board[rank][file] == king) {
      return { piece, rank : square[0], file : square[1] };
    } else if (getBoard.Board[rank][file] != " ") {
      break;
    }
  }
  if (piece != "q") {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    /* Check for Discovered check from Bishop */
    const b = Bishop.bishopDiscovery(
      getBoard.Board,
      "b",
      inGamePcs,
      king,
      color
    );
    if (b) {
      return b;
    }
    /*  Check for Discovered check from Queen */
    const q = Bishop.bishopDiscovery(
      getBoard.Board,
      "q",
      inGamePcs,
      king,
      color
    );
    if (q) {
      return q;
    }
  }
  return 0;
}
module.exports = { file };
