const getBoard = require("../../../Board/createBoard");
const findlegal = require("../findLegal");
const dcrp = require("../../checkValid/decryptMove");
const updLM = require("./updateLegalMoves");
const pawn = require("../Pawn/legalPawnMoves");

function findOppMoves(
  color,
  king,
  kingPos,
  LEGALMOVES,
  blockedSquaresForKing,
  isInCheck
) {
  /* Get the next Legal of opponent to block the king movement to those squares (Imp.)*/
  for (const allPcs in LEGALMOVES) {
    LEGALMOVES[allPcs][color] = {};
  }
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    color,
    getBoard.prevMove,
    isInCheck
  );

  for (const allPieces in LEGALMOVES) {
    if(allPieces === "p"){
      continue;
    }
    for (const singlePiece in LEGALMOVES[allPieces][color]) {
      for (const eachMove of LEGALMOVES[allPieces][color][singlePiece]) {
        blockedSquaresForKing.push(eachMove);
      }
    }
  }
  const pawnSquares = pawn.pawnCaptureSquares[color];
  for(let i = 0;i < pawnSquares.length; i++){
    blockedSquaresForKing.push(pawnSquares[i]);
  }
  dcrp.decryptMove(blockedSquaresForKing);

  /* Block the squares from King already covered by Opp pieces */
  updLM.updateLM(1 - color, kingPos, LEGALMOVES, blockedSquaresForKing);
}

module.exports = { findOppMoves };
