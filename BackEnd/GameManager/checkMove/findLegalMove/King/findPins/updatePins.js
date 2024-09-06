const getBoard = require("../../../../Board/createBoard");
const not = require("../../../notations");
const board = getBoard.Board;
const inGamePcs = getBoard.createInGamePcs(board);
const showPin = require("./showPinObjects");

function updatePinnedPieceState(
  color,
  pieceMoved,
  move,
  pieceCurrPos,
  pieceNewPos,
  pinnedPcs,
  pinningPcs,
  king,
  inGamePcs,
  LEGALMOVES
) {
  const pieceRank = `${not.RANK[pieceNewPos[0]]}`;
  const pieceFile = `${not.FILE[pieceNewPos[1]]}`;
  const pieceRow = pieceCurrPos[0];
  const pieceCol = pieceCurrPos[1];
  const newRow = pieceNewPos[0];
  const newCol = pieceNewPos[1];
  const oppKing = not.KING[1 - color];

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

  /* Change pinnedPcs & pinningPcs Object if Curr piece moved is a pinned Piece */
  let pinnedPieceFound = false;
  for (const allPinnedPcs in pinnedPcs[color]) {
    if (pieceMoved === allPinnedPcs) {
      for (const uniquePiece in pinnedPcs[color][allPinnedPcs]) {
        if (`${pieceRow}${pieceCol}` === uniquePiece) {
          pinnedPieceFound = true; // The pieceMoved is found in pinnedPcs[color]
          console.log(
            `pinned piece ${pieceMoved} from [${pieceRow}, ${pieceCol}] moved to [${newRow}, ${newCol}]`
          );
          changePinnedPiecePos(pieceMoved, uniquePiece, [newRow, newCol]);
          break;
        }
      }
    }
    if (pinnedPieceFound) {
      break;
    }
  }

  /* Change pinned & pinningPcs Object if Curr piece moved is a pinning Piece */
  let pinningPieceFound = false;
  for (const pinningPiece in pinningPcs[color]) {
    if (pieceMoved == pinningPiece) {
      for (const uniquePiece in pinningPcs[color][pinningPiece]) {
        if ([`${pieceRow}${pieceCol}`] == uniquePiece) {
          pinningPieceFound = true;
          console.log(
            `pinning piece ${pieceMoved} from [${pieceRow},${pieceCol}] moved to [${newRow},${newCol}]`
          );
          changePinningPiecePos(pieceMoved, uniquePiece, [newRow, newCol]);
          break;
        }
      }
    }
    if (pinningPieceFound) {
      break;
    }
  }
}

module.exports = { updatePinnedPieceState };
