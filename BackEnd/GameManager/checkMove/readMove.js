const getBoard = require("../Board/createBoard");
const chk = require("./findCheck");

const not = require("./notations");
const getIndex = require("../checkMove/checkValid/getBoardIndex");

function readThisMove(move, color) {
  let board = getBoard.Board;
  const c = not.COLOR[color];
  const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
  const king = not.KING[c];
  const oppKing = not.KING[1 - c];
  const kingPos = inGamePcs[king][0];
  const oppKingPos = inGamePcs[oppKing][0];

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
    /* Capture Move */
    if (board[targetSq[0]][targetSq[1]] !== " ") {
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
    if (chk.findCheck(board, piece, targetSq, oppKingPos)) {
      console.log(oppKing, "King is in check");
      finalMove += "+";
    }
  }

  //   console.log(`Color : ${c}, Piece : ${piece}, Source : ${source}, Move : ${finalMove}`);

  return [c, pcsSymbol, source, finalMove];
}

async function checkValidity(move, color) {
  return new Promise((resolve, reject) => {
    try {
      const [c, pcsSymb, src, fnlmove] = readThisMove(move, color);
      console.log(c, pcsSymb, src, fnlmove);
      if (getIndex.squareToIndex(c, pcsSymb, src, fnlmove)) {
        resolve(fnlmove); // Resolves with true if the move is valid
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
