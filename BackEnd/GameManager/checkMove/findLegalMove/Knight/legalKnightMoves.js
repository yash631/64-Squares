const allDir = require("./findForCheck/allDirections");
const not = require("../../notations");
const getBoard = require("../../../Board/createBoard");
const newPin = require("../King/findPins/checkNewPins");

function findKnight(color, lm, ALLPCS, iGP, rk, fl, board, isInCheck) {
  const king = not.KING[1 - color];
  let knight = "n";
  if (color) {
    knight = "N";
  }
  let curr_piece;
  const totalMoves = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-1, -2],
    [-2, -1],
    [1, -2],
    [2, -1],
  ];
  const pinnedPcs = newPin.getPinnedPcs();

  function normalMove(rank, file, rows, cols) {
    lm.n[color][`${rows}${cols}`].push(`${knight}${fl[file]}${rk[rank]}`);
  }
  function captureMove(rank, file, rows, cols) {
    lm.n[color][`${rows}${cols}`].push(`${knight}x${fl[file]}${rk[rank]}`);
  }
  function normalCheck(rank, file, rows, cols) {
    lm.n[color][`${rows}${cols}`].push(`${knight}${fl[file]}${rk[rank]}+`);
  }
  function captureCheck(rank, file, rows, cols) {
    lm.n[color][`${rows}${cols}`].push(`${knight}x${fl[file]}${rk[rank]}+`);
  }
  for (const locOfKnight of iGP[knight]) {
    lm.n[color][`${locOfKnight[0]}${locOfKnight[1]}`] = [];

    /* Check if the Piece is pinned to the king */
    const pinPos = `${locOfKnight[0]}${locOfKnight[1]}`;
    if ("n" in pinnedPcs[color]) {
      if (pinnedPcs[color]["n"][pinPos]) {
        continue;
      }
    }

    for (const move of totalMoves) {
      let rank = locOfKnight[0] + move[0],
        file = locOfKnight[1] + move[1];
      if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
        if (ALLPCS[1 - color].includes(board[rank][file])) {
          curr_piece = board[rank][file];
          board[rank][file] = knight;
          board[locOfKnight[0]][locOfKnight[1]] = " ";
          if (allDir.movesArray([rank, file], totalMoves, king, color)) {
            captureCheck(rank, file, locOfKnight[0], locOfKnight[1]);
          } else {
            captureMove(rank, file, locOfKnight[0], locOfKnight[1]);
          }
          board[rank][file] = curr_piece;
          board[locOfKnight[0]][locOfKnight[1]] = knight;
        } else if (board[rank][file] == " ") {
          curr_piece = board[rank][file];
          board[rank][file] = knight;
          board[locOfKnight[0]][locOfKnight[1]] = " ";
          if (allDir.movesArray([rank, file], totalMoves, king, color)) {
            normalCheck(rank, file, locOfKnight[0], locOfKnight[1]);
          } else {
            normalMove(rank, file, locOfKnight[0], locOfKnight[1]);
          }
          board[rank][file] = curr_piece;
          board[locOfKnight[0]][locOfKnight[1]] = knight;
        } else if (board[rank][file] !== " ") {
          lm.n[color][`${locOfKnight[0]}${locOfKnight[1]}`].push(
            `${board[rank][file]}${fl[file]}${rk[rank]}`
          );
        }
      }
    }
  }
}
module.exports = { findKnight };
