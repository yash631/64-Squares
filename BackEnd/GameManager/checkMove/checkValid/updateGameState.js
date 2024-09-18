const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");
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
  new_col,
  gameid
) {
  if (color) {
    piece = piece.toUpperCase();
  }

  let board = getBoard.getCurrentBoard(gameid);
  Game_State.push(move);
  /* console.log("MOVES : ", Game_State); */

  if (move == "O-O" || move == "O-O+") {
    getBoard.removeFullCastle(gameid,color);

    updateBoard.updateInGamePcs(
      board,
      not.KING[color],
      not.KING[`pos${color}`][0],
      not.KING[`pos${color}`][1],
      not.KING[`pos${color}`][0],
      not.KING[`pos${color}`][1] + 2
    );
    updateBoard.updateInGamePcs(
      board,
      not.ROOK[color],
      not.ROOK[`pos${color}`]["k"][0],
      not.ROOK[`pos${color}`]["k"][1],
      not.ROOK[`pos${color}`]["k"][0],
      not.ROOK[`pos${color}`]["k"][1] - 2
    );
  } else if (move == "O-O-O" || move == "O-O-O+") {
    getBoard.removeFullCastle(gameid,color);

    updateBoard.updateInGamePcs(
      board,
      not.KING[color],
      not.KING[`pos${color}`][0],
      not.KING[`pos${color}`][1],
      not.KING[`pos${color}`][0],
      not.KING[`pos${color}`][1] - 2
    );
    updateBoard.updateInGamePcs(
      board,
      not.ROOK[color],
      not.ROOK[`pos${color}`]["q"][0],
      not.ROOK[`pos${color}`]["q"][1],
      not.ROOK[`pos${color}`]["q"][0],
      not.ROOK[`pos${color}`]["q"][1] + 3
    );
  } else {
    if (move[0] == not.KING[color]) {
      getBoard.removeFullCastle(gameid,color);
    } else if (move[0] == "r") {
      if (curr_row == 0 && curr_col == 0) {
        getBoard.removeSingleCastle(gameid,0,"q");
      } else if (curr_row == 0 && curr_col == 7) {
        getBoard.removeSingleCastle(gameid,0,"k");
      }
    } else if (move[0] == "R") {
      if (curr_row == 7 && curr_col == 0) {
        getBoard.removeSingleCastle(gameid,1,"q");
      } else if (curr_row == 7 && curr_col == 7) {
        getBoard.removeSingleCastle(gameid,1,"k");
      }
    }

    /* For En-passant */
    if (move.includes("ep")) {
      /* Remove the pawn from board */
      if (new_col > curr_col) {
        /* En-passant on right side */
        board[curr_row][curr_col + 1] = " ";
      } else {
        /* En-passant on left side */
        board[curr_row][curr_col - 1] = " ";
      }
    } else if (not.ALLPIECES[color].includes(move[len - 1])) {
    /* For Pawn's promotion */
      piece = move[len - 1];
    } else if (
      /* For pawn's promotion with check or checkmate*/
      (move[len - 1] == "+" || move[len - 1] == "#") &&
      not.ALLPIECES[color].includes(move[len - 2])
    ) {
      piece = move[len - 2];
    }
    updateBoard.updateInGamePcs(
      getBoard.getCurrentBoard(gameid),
      piece,
      curr_row,
      curr_col,
      new_row,
      new_col
    );
  }
  getBoard.setPrevMove(gameid, `${curr_row}${curr_col}${move}`);
  /* getBoard.showBoard(getBoard.getCurrentBoard(gameid)); */
  console.log();

  /* Piece successfully updated on board */
  return true; 
}
module.exports = { updateGS };
