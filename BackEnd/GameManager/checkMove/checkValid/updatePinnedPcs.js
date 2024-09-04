const not = require("../notations");
const dcrp = require("./decryptMove");
const Bishop = require("../findLegalMove/Bishop/afterPinnedMoves");
const Rook = require("../findLegalMove/Rook/afterPinnedMoves");

function updatePinnedPieceState(
  color,
  piece,
  move,
  pieceCurrPos,
  pieceNewPos,
  pinnedPcs,
  pinningPcs,
  king,
  inGamePcs,
  LEGALMOVES
) {
  function updatePinnedPieces() {}
  function updatePinningPieces() {}
  function changePinnedPiecePos(pinnedPiece, oldPos, newPos) {
    /* Update Pinning Piece information */
    const pinningPiece = pinnedPcs?.[color]?.[pinnedPiece]?.[oldPos]?.[0];
    const pinningPiecePos = pinnedPcs?.[color]?.[pinnedPiece]?.[oldPos]?.[3];
    pinningPcs[1 - color][pinningPiece][
      `${pinningPiecePos[0]}${pinningPiecePos[1]}`
    ][1] = `${newRow}${newCol}`;

    /* Update Pinned Piece position */
    pinnedPcs[color][pinnedPiece][oldPos][1] = newPos;
    pinnedPcs[color][pinnedPiece][oldPos][2] = [
      `${not.FILE[newPos[1]]}${not.RANK[newPos[0]]}`,
    ];

    /* Creating new property of new position for pinned piece */
    pinnedPcs[color][pinnedPiece][`${newPos[0]}${newPos[1]}`] =
      pinnedPcs[color][pinnedPiece][oldPos];

    /* Delete the old property */
    delete pinnedPcs[color][pinnedPiece][oldPos];
    let actualPiece = pinnedPiece;

  }
  function changePinningPiecePos(pinningPiece, oldPos, newPos) {
    /* Update Pinned Piece information */
    const pinnedPiece = pinningPcs?.[color]?.[pinningPiece]?.[oldPos]?.[0];
    const pinnedPiecePos = pinningPcs?.[color]?.[pinningPiece]?.[oldPos]?.[1];
    pinnedPcs[1 - color][pinnedPiece][
      `${pinnedPiecePos[0]}${pinnedPiecePos[1]}`
    ][3] = newPos;
    pinnedPcs[1 - color][pinnedPiece][
      `${pinnedPiecePos[0]}${pinnedPiecePos[1]}`
    ][4] = [`${not.FILE[newPos[1]]}${not.RANK[newPos[0]]}`];

    /* Creating new property of new position for pinning piece */
    pinningPcs[color][pinningPiece][`${newPos[0]}${newPos[1]}`] =
      pinningPcs[color][pinningPiece][oldPos];

    /* Delete the old property */
    delete pinningPcs[color][pinningPiece][oldPos];
  }

  const pieceRow = pieceCurrPos[0],
    pieceCol = pieceCurrPos[1];
  const newRow = pieceNewPos[0],
    newCol = pieceNewPos[1];

  for (const allPinnedPcs in pinnedPcs[color]) {
    if (piece == allPinnedPcs) {
      for (const uniquePiece in pinnedPcs[color][allPinnedPcs]) {
        if ([`${pieceRow}${pieceCol}`] == uniquePiece) {
          console.log(
            `pinned piece ${piece} from [${pieceRow},${pieceCol}] moved to [${newRow},${newCol}]`
          );
          changePinnedPiecePos(piece, uniquePiece, [newRow, newCol]);
        }
      }
    }
  }
  for (const allPinningPcs in pinningPcs[color]) {
    if (piece == allPinningPcs) {
      for (const uniquePiece in pinningPcs[color][allPinningPcs]) {
        if ([`${pieceRow}${pieceCol}`] == uniquePiece) {
          console.log(
            `pinning piece ${piece} from [${pieceRow},${pieceCol}] moved to [${newRow},${newCol}]`
          );
          changePinningPiecePos(piece, uniquePiece, [newRow, newCol]);
        }
      }
    }
  }
}
module.exports = { updatePinnedPieceState };
