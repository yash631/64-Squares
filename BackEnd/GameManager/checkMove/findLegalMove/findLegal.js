const getBoard = require("../../Board/createBoard");
const notations = require("../notations");
const pawn = require("./legalPawnMoves");
const bishop = require("./legalBishopMoves");
const rook = require("./legalRookMoves");
const knight = require("./legalKnightMoves");
const queen = require("./legalQueenMoves");
const king = require("./legalKingMoves");


function createLegalMoves() {
  const pieces = ["p", "b", "r", "n", "q", "k"];
  const legalMoves = {};

  pieces.forEach((piece) => {
    legalMoves[piece] = {
      0: [],
      1: [],
    };
  });

  return legalMoves;
}

function findAllLegalMoves(LEGALMOVES, color, prevMove) {
  pawn.findPawn(
    color,
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    getBoard.createInGamePcs(getBoard.Board),
    notations.RANK,
    notations.FILE,
    getBoard.Board,
    prevMove
  );
  bishop.findBishop(
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    getBoard.createInGamePcs(getBoard.Board),
    notations.RANK,
    notations.FILE,
    getBoard.Board,
    ["B", "b"]
  );
  rook.findRook(
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    getBoard.createInGamePcs(getBoard.Board),
    notations.RANK,
    notations.FILE,
    getBoard.Board,
    ["R", "r"]
  );
  knight.findKnight(
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    getBoard.createInGamePcs(getBoard.Board),
    notations.RANK,
    notations.FILE,
    getBoard.Board
  );
  queen.findQueen(
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    getBoard.createInGamePcs(getBoard.Board),
    notations.RANK,
    notations.FILE,
    getBoard.Board,
    ["Q", "q"]
  );
  king.findKing(
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    getBoard.createInGamePcs(getBoard.Board),
    notations.RANK,
    notations.FILE,
    getBoard.Board
  );
}

module.exports = { createLegalMoves, findAllLegalMoves };
