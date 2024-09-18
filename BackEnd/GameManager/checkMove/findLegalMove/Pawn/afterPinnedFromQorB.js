const not = require("../../notations");
const ltrt = require("./findForCheck/leftRightDiag");

function findMovesAfterPin(
  color,
  pawn,
  MOVE,
  prevMove,
  EP,
  square_left,
  square_right,
  oppKing,
  lm,
  board,
  pinnedPiecePos,
  pinningPiecePos,
  checkInfo,
  gameid,
) {
  function normalEnPassant(rank, file, row, col) {
    lm.p[color][`${rank}${file}`].push(
      `${not.FILE[file]}x${not.FILE[col]}${not.RANK[row]}ep`
    );
  }
  function EnPassantCheck(rank, file, row, col, checkPieceInfo) {
    const move = `${not.FILE[file]}x${not.FILE[col]}${not.RANK[row]}ep+`;
    checkInfo[color][move] = {
      checkPiece: checkPieceInfo.piece,
      rank: checkPieceInfo.rank,
      file: checkPieceInfo.file,
    };
    lm.p[color][`${rank}${file}`].push(move);
  }
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
  
  function handlePinCapture(rank, file, pngRank, pngFile, squareDir) {
    const [squareRank, squareFile] = squareDir;
    let checkPieceInfo;
    let curr_piece;

    // Regular capture
    if (file + squareFile === pngFile) {
      curr_piece = board[pngRank][pngFile];
      board[rank][file] = " ";
      board[pngRank][pngFile] = pawn;

      checkPieceInfo = ltrt.leftRight(color, [pngRank, pngFile], oppKing, pawn, gameid);

      if (checkPieceInfo) {
        captureCheck(rank, file, pngRank, pngFile, checkPieceInfo);
      } else {
        captureMove(rank, file, pngRank, pngFile);
      }

      board[rank][file] = pawn;
      board[pngRank][pngFile] = curr_piece;
    }

    // En passant capture
    const enPassantRank = rank + squareRank;
    const enPassantFile = file + squareFile;

    if (
      EP[color] &&
      EP[color] === rank &&
      prevMove ==
        `${rank + MOVE[`start${color}`][1]}${enPassantFile}${
          not.FILE[enPassantFile]
        }${not.RANK[rank]}`
    ) {
      curr_piece = board[enPassantRank][enPassantFile];
      board[rank][file] = " ";
      board[enPassantRank][enPassantFile] = pawn; // Move the pawn for en passant

      checkPieceInfo = ltrt.leftRight(
        color,
        [enPassantRank, enPassantFile],
        oppKing,
        pawn,
        gameid,
      );
      if (checkPieceInfo) {
        EnPassantCheck(
          rank,
          file,
          enPassantRank,
          enPassantFile,
          checkPieceInfo
        );
      } else {
        normalEnPassant(rank, file, enPassantRank, enPassantFile);
      }
      board[rank][file] = pawn;
      board[enPassantRank][enPassantFile] = curr_piece;
    }
  }
  const [rank, file] = pinnedPiecePos;
  const [pngRank, pngFile] = pinningPiecePos;
  handlePinCapture(rank, file, pngRank, pngFile, square_left);
  handlePinCapture(rank, file, pngRank, pngFile, square_right);
  return;
}
module.exports = { findMovesAfterPin };
