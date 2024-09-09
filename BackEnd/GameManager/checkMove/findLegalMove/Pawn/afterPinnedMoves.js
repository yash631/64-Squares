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
  pinnedPiecePos,
  checkInfo
) {
  function normalMove(rank, file) {
    lm.p[color][`${rank}${file}`].push(
      `${not.FILE[file]}${not.RANK[rank + MOVE[color]]}`
    );
  }
  function normalCheck(rank, file, checkPieceInfo) {
    const move = `${not.FILE[file]}${not.RANK[rank + MOVE[color]]}+`;
    checkInfo[color][move] = {
      checkPiece: checkPieceInfo.piece,
      rank: checkPieceInfo.rank,
      file: checkPieceInfo.file,
    };
    lm.p[color][`${rank}${file}`].push(move);
  }

  const [rank, file] = pinnedPiecePos;
  let checkPieceInfo;
  let curr_piece;
  /* Default Move */
  if (board[rank + MOVE[color]][file] == " ") {
    curr_piece = board[rank + MOVE[color]][file];
    board[rank][file] = " ";
    board[rank + MOVE[color]][file] = pawn;
    checkPieceInfo = ltrt.leftRight(
      color,
      [rank + MOVE[color], file],
      oppKing,
      pawn
    );
    if (checkPieceInfo) {
      normalCheck(rank, file, checkPieceInfo);
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
      checkPieceInfo = ltrt.leftRight(
        color,
        [rank + MOVE[`start${color}`][1], file],
        oppKing,
        pawn
      );
      if (checkPieceInfo) {
        const move = `${not.FILE[file]}${
          not.RANK[rank + MOVE[`start${color}`][1]]
        }+`;
        checkInfo[color][move] = {
          checkPiece: checkPieceInfo.piece,
          rank: checkPieceInfo.rank,
          file: checkPieceInfo.file,
        };
        lm.p[color][`${rank}${file}`].push(move);
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
