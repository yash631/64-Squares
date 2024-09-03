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

function findAllLegalMoves(
  LEGALMOVES,
  Board,
  inGamePcs,
  color,
  prevMove,
  isInCheck,
  pinnedPcs
) {
  pawn.findPawn(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    prevMove,
    isInCheck,
    pinnedPcs
  );
  bishop.findBishop(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    ["B", "b"],
    isInCheck,
    pinnedPcs
  );
  rook.findRook(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    ["R", "r"],
    isInCheck,
    pinnedPcs
  );
  knight.findKnight(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    isInCheck,
    pinnedPcs
  );
  queen.findQueen(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    ["Q", "q"],
    isInCheck,
    pinnedPcs
  );
  king.findKing(
    color,
    LEGALMOVES,
    not.ALLPIECES,
    inGamePcs,
    not.RANK,
    not.FILE,
    Board,
    isInCheck,
    pinnedPcs
  );
}

module.exports = { createLegalMoves, findAllLegalMoves };
