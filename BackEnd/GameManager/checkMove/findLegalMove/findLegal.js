const not = require("../notations");
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

function findAllLegalMoves(LEGALMOVES, Board, inGamePcs, color, prevMove) {
  pawn.findPawn(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    prevMove
  );
  bishop.findBishop(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    ["B", "b"]
  );
  rook.findRook(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    ["R", "r"]
  );
  knight.findKnight(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board
  );
  queen.findQueen(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    ["Q", "q"]
  );
  king.findKing(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board
  );
}

module.exports = { createLegalMoves, findAllLegalMoves };
