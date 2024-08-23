const getBoard = require("../../Board/createBoard");
const notations = require("../notations");
const pawn = require("./legalPawnMoves");
const bishop = require("./legalBishopMoves");
const rook = require("./legalRookMoves");
const knight = require("./legalKnightMoves");
const queen = require("./legalQueenMoves");
const king = require("./legalKingMoves")

let prevMove;

let LEGALMOVES = {
  p: {
    0: [],
    1: [],
  },
  b: {
    0: [],
    1: [],
  },
  r: {
    0: [],
    1: [],
  },
  n: {
    0: [],
    1: [],
  },
  q: {
    0: [],
    1: [],
  },
  k: {
    0: [],
    1: [],
  },
};

function findAllLegalMoves(color) {
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

module.exports = { LEGALMOVES, findAllLegalMoves };