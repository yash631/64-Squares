const not = require("../notations");
const dcrp = require("./decryptMove");
const Bishop = require("../findLegalMove/Bishop/afterPinnedMoves");
const Rook = require("../findLegalMove/Rook/afterPinnedMoves");

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

  function removeCurrentPinnedPiece(color, pinnedPiece, pinnedPiecePos) {
    const pinningPiece =
      pinnedPcs?.[color]?.[pinnedPiece]?.[pinnedPiecePos]?.[0];
    const pinningPiecePos =
      pinnedPcs?.[color]?.[pinnedPiece]?.[pinnedPiecePos]?.[3];
    delete pinnedPcs[color][pinnedPiece][pinnedPiecePos];
    delete pinningPcs[1 - color][pinningPiece][
      `${pinningPiecePos[0]}${pinningPiecePos[1]}`
    ];
  }
  function removeCurrentPinningPiece(color, pinningPiece, pinningPiecePos){
    const pinnedPiece =
      pinningPcs?.[color]?.[pinningPiece]?.[pinningPiecePos]?.[0];
    const pinnedPiecePos = 
      pinningPcs?.[color]?.[pinningPiece]?.[pinningPiecePos]?.[1];
    delete pinningPcs[color][pinningPiece][pinningPiecePos];
    delete pinnedPcs[1 - color][pinnedPiece][
     `${pinnedPiecePos[0]}${pinnedPiecePos[1]}`
    ];
  }

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

  function checkIfPieceMovedToPinnedSquares(
    movedPieceRow,
    movedPieceCol,
    movedPieceRank,
    movedPieceFile,
    pinnedPcs,
    color
  ) {
    // Loop through all pinned pieces for the specified color
    for (const pinnedPiece in pinnedPcs[color]) {
      for (const pinnedPos in pinnedPcs[color][pinnedPiece]) {
        if (
          pinnedPiece == pieceMoved &&
          movedPieceRow.toString() == pinnedPos[0] &&
          movedPieceCol.toString() == pinnedPos[1]
        ) {
          continue;
        }
        const pinnedSquares = [...pinnedPcs[color][pinnedPiece][pinnedPos][5]]; // Create a copy
        dcrp.decryptMove(pinnedSquares, pieceMoved, color); // Now passing a copy

        // Loop through each allowed square for the pinned piece
        for (const square of pinnedSquares) {
          const squareRank = square[1]; // Rank of the square
          const squareFile = square[0]; // File of the square
          // console.log("SquareRank and SquareFile : ", squareRank, squareFile);
          // console.log(`${movedPieceRank}`, movedPieceFile);
          // Check if the moved piece has moved to one of the pinned piece's allowed squares
          if (movedPieceRank === squareRank && movedPieceFile === squareFile) {
            console.log(
              `A piece moved to the pinned piece's square at ${squareFile}${squareRank}`
            );

            // Perform any action you need here, e.g., removing the pin or updating the state
            removeCurrentPinnedPiece(color, pinnedPiece, pinnedPos);
            return; // Exit the loop once the piece is found in one of the pinned squares
          }
        }
      }
    }
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
        } else {
          checkIfPieceMovedToPinnedSquares(
            pieceNewPos[0],
            pieceNewPos[1],
            pieceRank,
            pieceFile,
            pinnedPcs,
            color
          );
        }
      }
    } else {
      checkIfPieceMovedToPinnedSquares(
        pieceNewPos[0],
        pieceNewPos[1],
        pieceRank,
        pieceFile,
        pinnedPcs,
        color
      );
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
