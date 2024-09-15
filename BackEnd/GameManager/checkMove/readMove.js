const getBoard = require("../Board/createBoard");
const chk = require("./readCheck");
const not = require("./notations");
const getIndex = require("../checkMove/checkValid/getBoardIndex");

async function readThisMove(move, color, promotedPiece) {
  const board = getBoard.Board;
  const c = not.COLOR[color];
  const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
  const king = not.KING[c];
  const oppKing = not.KING[1 - c];
  const kingPos = inGamePcs[king][0];
  const oppKingPos = inGamePcs[oppKing][0];
  let enPassantPawnSquare = undefined;
  let promotionSquare = undefined;
  const movePiece = move.piece;
  const pcsSymbol = not.SYMBOLS[movePiece];
  const source = move.source;
  const target = move.target;
  let sourceSq = [not.RTI[source[1]], not.FTI[source[0]]];
  let targetSq = [not.RTI[target[1]], not.FTI[target[0]]];
  let finalMove = "";
  let piece = not.COLORPCS[movePiece];

  console.log(
    c,
    pcsSymbol,
    move.piece,
    piece,
    finalMove,
    source,
    target,
    sourceSq,
    targetSq
  );

  if (piece === "K" && source === "e1" && target === "g1") {
    piece = "R";
    targetSq = [not.RTI[1], not.FTI["f"]];
    finalMove = "O-O";
  } else if (piece === "k" && source === "e8" && target === "g8") {
    piece = "R";
    targetSq = [not.RTI[8], not.FTI["f"]];
    finalMove = "O-O";
  } else if (piece === "K" && source === "e1" && target === "c1") {
    piece = "R";
    targetSq = [not.RTI[1], not.FTI["d"]];
    finalMove = "O-O-O";
  } else if (piece === "k" && source === "e8" && target === "c8") {
    piece = "R";
    targetSq = [not.RTI[8], not.FTI["d"]];
    finalMove = "O-O-O";
  } else {
    let promotionRank = c === 1 ? 0 : 7;
    if (board[targetSq[0]][targetSq[1]] !== " ") {
      if (movePiece === "wP" || movePiece === "bP") {
        if (
          targetSq[0] === promotionRank &&
          (targetSq[1] === sourceSq[1] - 1 || targetSq[1] === sourceSq[1] + 1)
        ) {
          promotionSquare = `${not.FILE[targetSq[1]]}${
            not.RANK[promotionRank]
          }`;
          if (!c) {
            promotedPiece = promotedPiece.toLowerCase();
          }
          piece = promotedPiece;
          finalMove = `${source[0]}x${target}=${promotedPiece}`;
        } else {
          finalMove = `${source[0]}x${target}`;
        }
      } else {
        finalMove = `${piece}x${target}`;
      }
    } else if (board[targetSq[0]][targetSq[1]] === " ") {
      if (movePiece === "wP" || movePiece === "bP") {
        let epDirection = -1;
        let enPassantCapturePawn = "P";
        if (c) {
          epDirection = 1;
          enPassantCapturePawn = "p";
        }
        const enPassantCaptureRank = targetSq[0] + epDirection;
        const enPassantCaptureFile = targetSq[1];
        if (targetSq[0] === promotionRank && targetSq[1] === sourceSq[1]) {
          promotionSquare = `${not.FILE[targetSq[1]]}${
            not.RANK[promotionRank]
          }`;
          if (!c) {
            promotedPiece = promotedPiece.toLowerCase();
          }
          piece = promotedPiece;
          finalMove = `${target}=${promotedPiece}`;
        } else if (
          source[0] !== target[0] &&
          board[enPassantCaptureRank][enPassantCaptureFile] ===
            enPassantCapturePawn
        ) {
          enPassantPawnSquare = `${not.FILE[enPassantCaptureFile]}${not.RANK[enPassantCaptureRank]}`;
          finalMove = `${source[0]}x${target}ep`; // En passant notation
        } else {
          finalMove = target;
        }
      } else {
        finalMove = `${piece}${target}`;
      }
    }
  }
  if (chk.findCheck(board, piece, targetSq, oppKingPos)) {
    finalMove += "+";
  }

  // console.log("FinalMove is : ", finalMove);
  return [
    c,
    pcsSymbol,
    piece,
    source,
    finalMove,
    enPassantPawnSquare,
    promotionSquare,
  ];
}

async function checkValidity(move, color, promotionPiece) {
  return new Promise(async (resolve, reject) => {
    try {
      const [
        c,
        pcsSymb,
        piece,
        src,
        finalMove,
        enPassantCapturePawn,
        promotionSquare,
      ] = await readThisMove(move, color, promotionPiece);
      /* console.log(
        c,
        pcsSymb,
        piece,
        src,
        finalMove,
        enPassantCapturePawn,
        promotionSquare
      ); */
      const result = getIndex.squareToIndex(c, pcsSymb, src, finalMove);
      if (result) {
        // Resolves with true if the move is valid
        resolve({
          result: result,
          finalMove: finalMove,
          enPassantCapturePawn: enPassantCapturePawn,
          promotionSquare: promotionSquare,
          promotionPiece: piece,
        });
      } else {
        // Resolves with false if the move is invalid
        resolve(false);
      }
    } catch (error) {
      // Rejects if there's an error during validation
      console.error("Error in checkValidity:", error);
      reject(error);
    }
  });
}

module.exports = { checkValidity };
