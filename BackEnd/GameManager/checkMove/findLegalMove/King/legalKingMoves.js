const not = require("../../notations");
const allDir = require("./findForCheck/allDirections");

function findKing(color, lm, ALLPCS, iGP, rk, fl, board) {
  const opp_king = not.KING[1 - color];
  const king = not.KING[color];
  const king_sq = [iGP[king][0][0], iGP[king][0][1]];
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
    lm.k[color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}x${fl[file]}${rk[rank]}+`
    );
  }
  function normalCheck(rank, file) {
    lm.k[color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}${fl[file]}${rk[rank]}+`
    );
  }
  function captureMove(rank, file) {
    lm.k[color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}x${fl[file]}${rk[rank]}`
    );
  }
  function normalMove(rank, file) {
    lm.k[color][`${king_sq[0]}${king_sq[1]}`].push(
      `${king}${fl[file]}${rk[rank]}`
    );
  }
  if (!lm.k[color][`${king_sq[0]}${king_sq[1]}`]) {
    lm.k[color][`${king_sq[0]}${king_sq[1]}`] = [];
  }
  for (const move of totalMoves) {
    let rank = king_sq[0] + move[0],
      file = king_sq[1] + move[1];
    if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
      if (ALLPCS[1 - color].includes(board[rank][file])) {
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
        board[rank][file] = " ";
        board[king_sq[0]][king_sq[1]] = king;
      } else if (board[rank][file] == " ") {
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
        board[rank][file] = " ";
        board[king_sq[0]][king_sq[1]] = king;
      }
    }
  }
}
module.exports = { findKing };
