const getBoard = require("../Board/createBoard");
const chk = require("./readCheck");

const not = require("./notations");
const getIndex = require("../checkMove/checkValid/getBoardIndex");

function readThisMove(move, color) {
  const board = getBoard.Board;
  const c = not.COLOR[color];
  const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
  const king = not.KING[c];
  const oppKing = not.KING[1 - c];
  const kingPos = inGamePcs[king][0];
  const oppKingPos = inGamePcs[oppKing][0];
  let enPassantPawnSquare=undefined;
  const movePiece = move.piece;
  const pcsSymbol = not.SYMBOLS[movePiece];
  const source = move.source;
  const target = move.target;
  const sourceSq = [not.RTI[source[1]], not.FTI[source[0]]];
  const targetSq = [not.RTI[target[1]], not.FTI[target[0]]];
  let finalMove = "";
  const piece = not.COLORPCS[movePiece];
  console.log(
    c,
    pcsSymbol,
    move.piece,
    piece,
    finalMove,
    source,
    target,
    targetSq
  );
  if (
    (piece === "K" && source === "e1" && target === "g1") ||
    (piece === "k" && source === "e8" && target === "g8")
  ) {
    finalMove = "O-O";
  } else if (
    (piece === "K" && source === "e1" && target === "c1") ||
    (piece === "k" && source === "e8" && target === "c8")
  ) {
    finalMove = "O-O-O";
  } else {
    /* Check for en passant */
    let epDirection = -1;
    let enPassantCapturePawn = "P";
    if (c) {
      epDirection = 1;
      enPassantCapturePawn = "p";
    }
    const enPassantCaptureRank = targetSq[0] + epDirection;
    const enPassantCaptureFile = targetSq[1];
    enPassantPawnSquare = `${not.FILE[enPassantCaptureFile]}${not.RANK[enPassantCaptureRank]}`;

    // Check if it's an en passant move
    if (
      (movePiece === "wP" || movePiece === "bP") &&
      source[0] !== target[0] &&
      board[targetSq[0]][targetSq[1]] === " " &&
      board[enPassantCaptureRank][enPassantCaptureFile] === enPassantCapturePawn
    ) {
      finalMove = `${source[0]}x${target}ep`; // En passant notation
    } else if (board[targetSq[0]][targetSq[1]] !== " ") {
      /* Capture Move */
      if (movePiece === "wP" || movePiece === "bP") {
        /* Pawn capture on a square */
        finalMove = `${source[0]}x${target}`;
      } else {
        /* Piece captures on a square */
        finalMove = `${piece}x${target}`;
      }
    } else if (board[targetSq[0]][targetSq[1]] === " ") {
      if (movePiece === "wP" || movePiece === "bP") {
        finalMove = target;
      } else {
        finalMove = `${piece}${target}`;
      }
    }
  }

  if (chk.findCheck(board, piece, targetSq, oppKingPos)) {
    console.log(oppKing, "King is in check");
    finalMove += "+";
  }
  console.log("FinalMove is : ", finalMove);
  return [c, pcsSymbol , source, finalMove, enPassantPawnSquare];
}

async function checkValidity(move, color) {
  return new Promise((resolve, reject) => {
    try {
      const [c, pcsSymb ,src, finalMove, enPassantCapturePawn] = readThisMove(move, color);
      console.log(c, pcsSymb, src, finalMove, enPassantCapturePawn);
      if (getIndex.squareToIndex(c, pcsSymb, src, finalMove)) {
        resolve({enPassantCapturePawn : enPassantCapturePawn, finalMove : finalMove}); // Resolves with true if the move is valid
      } else {
        resolve(false); // Resolves with false if the move is invalid
      }
    } catch (error) {
      console.error("Error in checkValidity:", error);
      reject(error); // Rejects if there's an error during validation
    }
  });
}

module.exports = { checkValidity };
