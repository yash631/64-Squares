const not = require("../../notations");
const ltrt = require("./findForCheck/leftRightDiag");
const prom = require("./findForCheck/atPromotion");

function findMovesAfterPin(
  color,
  pawn,
  MOVE,
  pinnedPcs,
  oppKing,
  lm,
  board,
  inGamePcs,
  pinnedPiecePos
) {
  let curr_piece;
  function normalMove(rank, file) {
    lm.p[color][`${rank}${file}`].push(
      `${not.FILE[file]}${not.RANK[rank + MOVE[color]]}`
    );
  }
  function normalCheck(rank, file) {
    lm.p[color][`${rank}${file}`].push(
      `${not.FILE[file]}${not.RANK[rank + MOVE[color]]}+`
    );
  }

  const [rank, file] = pinnedPiecePos;

  /* Default Move */
  if (board[rank + MOVE[color]][file] == " ") {
    curr_piece = board[rank + MOVE[color]][file];
    board[rank][file] = " ";
    board[rank + MOVE[color]][file] = pawn;
    if (ltrt.leftRight(color, [rank + MOVE[color], file], oppKing, pawn)) {
      normalCheck(rank, file);
    } else {
      normalMove(rank, file);
    }
    board[rank][file] = pawn;
    board[rank + MOVE[color]][file] = curr_piece;

    /* Starting Move */
    if (
      rank == MOVE[`start${color}`][0] &&
      board[rank + MOVE[`start${color}`][1]][file] == " "
    ) {
      curr_piece = board[rank + MOVE[`start${color}`][1]][file];
      board[rank][file] = " ";
      board[rank + MOVE[`start${color}`][1]][file] = pawn;

      if (
        ltrt.leftRight(
          color,
          [rank + MOVE[`start${color}`][1], file],
          oppKing,
          pawn
        )
      ) {
        lm.p[color][`${rank}${file}`].push(
          `${not.FILE[file]}${not.RANK[rank + MOVE[`start${color}`][1]]}+`
        );
      } else {
        lm.p[color][`${rank}${file}`].push(
          `${not.FILE[file]}${not.RANK[rank + MOVE[`start${color}`][1]]}`
        );
      }
      board[rank][file] = pawn;
      board[rank + MOVE[`start${color}`][1]][file] = curr_piece;
    }
  }
}
module.exports = { findMovesAfterPin };
