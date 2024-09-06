const not = require("../../notations");
const allDir = require("./findForCheck/allDirections");
const castle = require("./canCastle");
const oppponent = require("../../checkValid/isValidMove");

let Castling = {
  0: {
    q: 1, // Queen side castling O-O-O for black
    k: 1, // King side castling O-O for black
  },
  1: {
    q: 1, // Queen side castling O-O-O for white
    k: 1, // King side castling O-O for white
  },
};

function findKing(color, lm, ALLPCS, iGP, rk, fl, board, isInCheck) {
  const opp_king = not.KING[1 - color];
  const king = not.KING[color];
  const king_sq = [iGP[king][0][0], iGP[king][0][1]];
  let curr_piece;

  const totalMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  function captureCheck(rank, file) {
    lm["k"][color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}x${fl[file]}${rk[rank]}+`
    );
  }
  function normalCheck(rank, file) {
    lm["k"][color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}${fl[file]}${rk[rank]}+`
    );
  }
  function captureMove(rank, file) {
    lm["k"][color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}x${fl[file]}${rk[rank]}`
    );
  }
  function normalMove(rank, file) {
    lm["k"][color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}${fl[file]}${rk[rank]}`
    );
  }
  function castlingMove(side) {
    if (side == "king") {
      lm["k"][color][`${king_sq[0]}${king_sq[1]}`].push("O-O");
    } else if (side == "queen") {
      lm["k"][color][`${king_sq[0]}${king_sq[1]}`].push("O-O-O");
    }
  }

  if (!lm["k"][color][`${king_sq[0]}${king_sq[1]}`]) {
    lm["k"][color][`${king_sq[0]}${king_sq[1]}`] = [];
  }

  if (isInCheck == 0) {
    /* Check if it's possible to castle i.e. king and queen-side rook didn't move till now*/
    if (Castling[color]["q"]) {
      /* Check if there is no piece between king and queen-side rook */
      if (castle.kingRookCastle(color, board, king, "q")) {
        castlingMove("queen");
      }
    }
    /* Check if it's possible to castle i.e. king and king-side rook didn't move till now */
    if (Castling[color]["k"]) {
      /* Check if there is no piece between king and king-side rook */
      if (castle.kingRookCastle(color, board, king, "k")) {
        castlingMove("king");
      }
    }
  }

  for (const move of totalMoves) {
    let rank = king_sq[0] + move[0],
      file = king_sq[1] + move[1];
    if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
      if (ALLPCS[1 - color].includes(board[rank][file])) {
        curr_piece = board[rank][file];
        board[rank][file] = king;
        board[king_sq[0]][king_sq[1]] = " ";
        if (
          allDir.movesArray(
            [king_sq[0], king_sq[0]],
            totalMoves,
            opp_king,
            color
          )
        ) {
          captureCheck(rank, file);
        } else {
          captureMove(rank, file);
        }
        board[rank][file] = curr_piece;
        board[king_sq[0]][king_sq[1]] = king;
      } else if (board[rank][file] == " ") {
        curr_piece = board[rank][file];
        board[rank][file] = king;
        board[king_sq[0]][king_sq[1]] = " ";
        if (
          allDir.movesArray(
            [king_sq[0], king_sq[0]],
            totalMoves,
            opp_king,
            color
          )
        ) {
          normalCheck(rank, file);
        } else {
          normalMove(rank, file);
        }
        board[rank][file] = curr_piece;
        board[king_sq[0]][king_sq[1]] = king;
      }
    }
  }
}
module.exports = { findKing, Castling };
