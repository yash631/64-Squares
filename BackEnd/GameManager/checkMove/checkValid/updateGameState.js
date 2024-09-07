const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");
const king = require("../findLegalMove/King/legalKingMoves");
const not = require("../notations");

function updateGS(
  move,
  len,
  color,
  piece,
  Game_State,
  curr_row,
  curr_col,
  new_row,
  new_col
) {
  if (color) {
    piece = piece.toUpperCase();
  }
  Game_State.push(move);
  console.log("MOVES : ", Game_State);
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
    if (move[0] == not.KING[color]) {
      king.Castling[color].k = 0;
      king.Castling[color].q = 0;
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

    /* For En-passant */
    if (move.includes("ep")) {
      /* Remove the pawn from board */
      if (new_col > curr_col) {
        /* En-passant on right side */
        getBoard.Board[curr_row][curr_col + 1] = " ";
      } else {
        /* En-passant on left side */
        getBoard.Board[curr_row][curr_col - 1] = " ";
      }
    }
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
  }
  updateBoard.updateInGamePcs(
    getBoard.Board,
    piece,
    curr_row,
    curr_col,
    new_row,
    new_col
  );
  getBoard.prevMove = `${curr_row}${curr_col}${move}`;
  // console.log(getBoard.prevMove);
  getBoard.showBoard(getBoard.Board);
  console.log();
  return true;
}
module.exports = { updateGS };
