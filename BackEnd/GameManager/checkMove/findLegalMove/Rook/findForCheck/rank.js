const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");

function rank(square, king, color, piece, gameid) {
  /* Left Rank */
  let rank = square[0],
    file = square[1];
  const board = getBoard.getCurrentBoard(gameid);
  while (--file >= 0) {
    if (board[rank][file] == king) {
      return { piece, rank : square[0], file : square[1] };
    } else if (board[rank][file] != " ") {
      break;
    }
  }
  /* Right Rank */
  file = square[1];
  while (++file <= 7) {
    if (board[rank][file] == king) {
      return { piece, rank : square[0], file : square[1] };
    } else if (board[rank][file] != " ") {
      break;
    }
  }
  if (piece != "q") {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(board);
    /* Check for Discovered check from Bishop */
    const b = Bishop.bishopDiscovery(
      board,
      "b",
      inGamePcs,
      king,
      color,
      gameid,
    );
    if (b) {
      return b;
    }
    /*  Check for Discovered check from Queen */
    const q = Bishop.bishopDiscovery(
      board,
      "q",
      inGamePcs,
      king,
      color,
      gameid,
    );
    if (q) {
      return q;
    }
  }
  return 0;
}
module.exports = { rank };
