const not = require("../../notations");
const ltrt = require("./findForCheck/leftRightDiag");
const prom = require("./findForCheck/atPromotion");

function findMovesAfterPin(
  color,
  pawn,
  square_left,
  square_right,
  oppKing,
  lm,
  board,
  pinnedPiecePos,
  pinningPiecePos,
  checkInfo
) {
  function captureMove(rank, file, row, col) {
    lm.p[color][`${rank}${file}`].push(
      `${not.FILE[file]}x${not.FILE[col]}${not.RANK[row]}`
    );
  }
  function captureCheck(rank, file, row, col, checkPieceInfo) {
    const move = `${not.FILE[file]}x${not.FILE[col]}${not.RANK[row]}+`;
    checkInfo[color][move] = {
      checkPiece: checkPieceInfo.piece,
      rank: checkPieceInfo.rank,
      file: checkPieceInfo.file,
    };
    lm.p[color][`${rank}${file}`].push(move);
  }
  function handlePinCapture(rank, file, pnRank, pnFile, squareDir) {
    const [squareRank, squareFile] = squareDir;
    let checkPieceInfo;
    let curr_piece;

    if (file + squareFile === pnFile) {
      curr_piece = board[pnRank][pnFile];
      board[rank][file] = " ";
      board[pnRank][pnFile] = pawn;

      checkPieceInfo = ltrt.leftRight(color, [pnRank, pnFile], oppKing, pawn);

      if (checkPieceInfo) {
        captureCheck(rank, file, pnRank, pnFile, checkPieceInfo);
      } else {
        captureMove(rank, file, pnRank, pnFile);
      }

      board[rank][file] = pawn;
      board[pnRank][pnFile] = curr_piece;
    }
  }
  const [rank, file] = pinnedPiecePos;
  const [pnRank, pnFile] = pinningPiecePos;
  if (file + square_left[1] !== pnFile && file + square_right[1] !== pnFile) {
    return;
  }
  handlePinCapture(rank, file, pnRank, pnFile, square_left);
  handlePinCapture(rank, file, pnRank, pnFile, square_right);
  return;
}
module.exports = { findMovesAfterPin };
