const getBoard = require("../../../../Board/createBoard");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function movesArray(square, totalMoves, king, color, gameid) {
  /* Discovered checks */
  let board =  getBoard.getCurrentBoard(gameid);
  const inGamePcs = getBoard.createInGamePcs(board);
  
  /* Check for Discovered check from Bishop */
  const b = Bishop.bishopDiscovery(board, "b", inGamePcs, king, color, gameid);
  if(b){
    return b;
  }
    /* Check for Discovered check from Rook */
  const r = Rook.rookDiscovery(board, "r", inGamePcs, king, color, gameid);
  if(r){
    return r;
  }
    /* Check for Discovered check from Queen */
  const q = Bishop.bishopDiscovery(board, "q", inGamePcs, king, color, gameid) ||
    Rook.rookDiscovery(board, "q", inGamePcs, king, color, gameid);
    if(q){
      return q;
    }
  return 0;
}
module.exports = { movesArray };
