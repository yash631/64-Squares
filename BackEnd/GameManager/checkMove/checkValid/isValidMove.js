const findlegal = require("../findLegalMove/findLegal");
const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");
const not = require("../notations");
const king = require("../findLegalMove/King/legalKingMoves");

function isValid(piece, move, color, curr_row, curr_col, new_row, new_col) {
  let pieceListForCheck = [];
  function showLegalMoves(LEGALMOVES) {
    console.log(
      `CURRENT POSITION OF ${not.COLOR[color]} PIECES AND THEIR LEGAL MOVES`
    );
    for (const allPieces in LEGALMOVES) {
      console.log(`-->>${not.PIECES[allPieces]}<<--`);
      for (const singlePiece in LEGALMOVES[allPieces][color]) {
        console.log(
          `${not.FILE[singlePiece[1]]}${not.RANK[singlePiece[0]]} : ${
            LEGALMOVES[allPieces][color][singlePiece]
          }`
        );
      }
      console.log("\n");
    }
  }
  let LEGALMOVES = findlegal.createLegalMoves();
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    color,
    getBoard.prevMove
  );
  /* SHOW LEGAL MOVES */
  // showLegalMoves(LEGALMOVES);
  console.log(`-----------------------------------------------`);

  if (LEGALMOVES[piece][color][`${curr_row}${curr_col}`].includes(move)) {
    getBoard.Game_State.push(move);
    console.log("MOVES : ", getBoard.Game_State);
    if (move == "O-O") {
      king.Castling[color].k = -1;
      king.Castling[color].q = -1;
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.KING[color],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1] + 2
      );
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.ROOK[color],
        not.ROOK[`pos${color}`]["k"][0],
        not.ROOK[`pos${color}`]["k"][1],
        not.ROOK[`pos${color}`]["k"][0],
        not.ROOK[`pos${color}`]["k"][1] - 2
      );
    } else if (move == "O-O-O") {
      king.Castling[color].k = -1;
      king.Castling[color].q = -1;
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.KING[color],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1] - 2
      );
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.ROOK[color],
        not.ROOK[`pos${color}`]["q"][0],
        not.ROOK[`pos${color}`]["q"][1],
        not.ROOK[`pos${color}`]["q"][0],
        not.ROOK[`pos${color}`]["q"][1] + 3
      );
    } else {
      if (move[0] == "k") {
        king.Castling[0].k = 0;
        king.Castling[0].q = 0;
      } else if (move[0] == "K") {
        king.Castling[1].k = 0;
        king.Castling[1].q = 0;
      } else if (move[0] == "r") {
        if (curr_row == 0 && curr_col == 0) {
          king.Castling[0].q = 0;
        } else if (curr_row == 0 && curr_col == 7) {
          king.Castling[0].k = 0;
        }
      } else if (move[0] == "R") {
        if (curr_row == 7 && curr_col == 0) {
          king.Castling[1].q = 0;
        } else if (curr_row == 7 && curr_col == 7) {
          king.Castling[1].k = 0;
        }
      }
      if (color) {
        piece = piece.toUpperCase();
      }
      const len = move.length;
      /* For Pawn's promotion */
      if (not.ALLPIECES[color].includes(move[len - 1])) {
        piece = move[len - 1];
      } else if (
        /* For pawn's promotion with check or checkmate*/
        (move[len - 1] == "+" || move[len - 1] == "#") &&
        not.ALLPIECES[color].includes(move[len - 2])
      ) {
        piece = move[len - 2];
      }
      updateBoard.updateInGamePcs(
        getBoard.Board,
        piece,
        curr_row,
        curr_col,
        new_row,
        new_col
      );
    }
      getBoard.prevMove = `${curr_row}${curr_col}${move}`;
      // console.log(getBoard.prevMove);
      /*console.log(`\nBoard Updated after ${move}\n`);
      console.log(getBoard.createInGamePcs(getBoard.Board));*/
      getBoard.showBoard(getBoard.Board);
      console.log();
      return true;
  }
  return false;
}

module.exports = { isValid };
