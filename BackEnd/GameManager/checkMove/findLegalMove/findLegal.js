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
    color,
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
    color,
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
    color,
    LEGALMOVES,
    notations.BLACKPIECES,
    notations.WHITEPIECES,
    getBoard.createInGamePcs(getBoard.Board),
    notations.RANK,
    notations.FILE,
    getBoard.Board
  );
  queen.findQueen(
    color,
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
    color,
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
