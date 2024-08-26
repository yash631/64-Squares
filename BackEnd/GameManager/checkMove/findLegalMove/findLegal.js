const notations = require("../notations");
const pawn = require("./Pawn/legalPawnMoves");
const bishop = require("./Bishop/legalBishopMoves");
const rook = require("./Rook/legalRookMoves");
const knight = require("./Knight/legalKnightMoves");
const queen = require("./Queen/legalQueenMoves");
const king = require("./King/legalKingMoves");


function createLegalMoves() {
  const pieces = ["p", "b", "r", "n", "q", "k"];
  const legalMoves = {};

  pieces.forEach((piece) => {
    legalMoves[piece] = {
      0: {},
      1: {},
    };
  });

  return legalMoves;
}

function findAllLegalMoves(LEGALMOVES,Board,inGamePcs, color, prevMove) {
  pawn.findPawn(
    color,
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    inGamePcs,
    notations.RANK,
    notations.FILE,
    Board,
    prevMove
  );
  bishop.findBishop(
    color,
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    inGamePcs,
    notations.RANK,
    notations.FILE,
    Board,
    ["B", "b"]
  );
  rook.findRook(
    color,
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    inGamePcs,
    notations.RANK,
    notations.FILE,
    Board,
    ["R", "r"]
  );
  knight.findKnight(
    color,
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    inGamePcs,
    notations.RANK,
    notations.FILE,
    Board
  );
  queen.findQueen(
    color,
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    inGamePcs,
    notations.RANK,
    notations.FILE,
    Board,
    ["Q", "q"]
  );
  king.findKing(
    color, 
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    inGamePcs,
    notations.RANK,
    notations.FILE,
    Board
  );
}

module.exports = { createLegalMoves, findAllLegalMoves };
