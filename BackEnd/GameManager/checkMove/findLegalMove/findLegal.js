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
  checkInfo
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
    checkInfo
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
    checkInfo
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
    checkInfo
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
    checkInfo
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
    checkInfo
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
    checkInfo
  );
}

module.exports = { createLegalMoves, findAllLegalMoves };
