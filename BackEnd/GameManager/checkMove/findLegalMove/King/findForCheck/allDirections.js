const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function movesArray(square, totalMoves, king, color) {
  /* Discovered checks */
  const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
  /* Check for Discovered check from Bishop */
  const b = Bishop.bishopDiscovery(getBoard.Board, "b", inGamePcs, king, color);
  if(b){
    return b;
  }
    /* Check for Discovered check from Rook */
  const r = Rook.rookDiscovery(getBoard.Board, "r", inGamePcs, king, color);
  if(r){
    return r;
  }
    /* Check for Discovered check from Queen */
  const q = Bishop.bishopDiscovery(getBoard.Board, "q", inGamePcs, king, color) ||
    Rook.rookDiscovery(getBoard.Board, "q", inGamePcs, king, color);
    if(q){
      return q;
    }
  return 0;
}
module.exports = { movesArray };
