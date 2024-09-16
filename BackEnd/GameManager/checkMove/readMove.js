const getBoard = require("../Board/createBoard");
const chk = require("./readCheck");
const not = require("./notations");
const getIndex = require("../checkMove/checkValid/getBoardIndex");
let gameEnd = false;

async function readThisMove(move, color, promotedPiece) {
  let board = getBoard.Board;
  const c = not.COLOR[color];
  let promotionSquare = undefined;
  let enPassantPawnSquare = undefined;
  let enPassantCapturePawn = undefined;
  let enPstPawnRank = undefined;
  let enPstPawnFile = undefined;
  let castleRookSq = undefined;
  let initialRookSq = undefined;
  const movePiece = move.piece;
  const pcsSymbol = not.SYMBOLS[movePiece];
  const source = move.source;
  const target = move.target;
  let sourceSq = [not.RTI[source[1]], not.FTI[source[0]]];
  let targetSq = [not.RTI[target[1]], not.FTI[target[0]]];
  let finalMove = "";
  let piece = not.COLORPCS[movePiece];

  /*console.log(
    c,
    pcsSymbol,
    move.piece,
    piece,
    finalMove,
    source,
    target,
    sourceSq,
    targetSq
  );*/

  if (piece === "K" && source === "e1" && target === "g1") {
    piece = "R";
    initialRookSq = [not.RTI[1], not.FTI["h"]];
    castleRookSq = [not.RTI[1], not.FTI["f"]];
    targetSq = [not.RTI[1], not.FTI["g"]];
    finalMove = "O-O";
  } else if (piece === "k" && source === "e8" && target === "g8") {
    piece = "r";
    initialRookSq = [not.RTI[8], not.FTI["h"]];
    castleRookSq = [not.RTI[8], not.FTI["f"]];
    targetSq = [not.RTI[8], not.FTI["g"]];
    finalMove = "O-O";
  } else if (piece === "K" && source === "e1" && target === "c1") {
    piece = "R";
    initialRookSq = [not.RTI[1], not.FTI["a"]];
    castleRookSq = [not.RTI[1], not.FTI["d"]];
    targetSq = [not.RTI[1], not.FTI["c"]];
    finalMove = "O-O-O";
  } else if (piece === "k" && source === "e8" && target === "c8") {
    piece = "r";
    initialRookSq = [not.RTI[8], not.FTI["a"]];
    castleRookSq = [not.RTI[8], not.FTI["d"]];
    targetSq = [not.RTI[8], not.FTI["c"]];
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
        enPassantCapturePawn = "P";
        if (c) {
          epDirection = 1;
          enPassantCapturePawn = "p";
        }
        enPstPawnRank = sourceSq[0];
        enPstPawnFile = targetSq[1];
        const enPassantCaptureRank = targetSq[0] + epDirection;
        const enPassantCaptureFile = targetSq[1];
        if (targetSq[0] === promotionRank && targetSq[1] === sourceSq[1]) {
          promotionSquare = `${not.FILE[targetSq[1]]}${
            not.RANK[promotionRank]
          }`;
          if (!c) {
            promotedPiece = promotedPiece.toLowerCase();
          }
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

  const curr_piece = board[targetSq[0]][targetSq[1]];
  const king = not.KING[c];
  console.log("FinalMove : ", finalMove);
  if (finalMove.includes("O-O")) {
    board[initialRookSq[0]][initialRookSq[1]] = " ";
    board[sourceSq[0]][sourceSq[1]] = " ";
    board[castleRookSq[0]][castleRookSq[1]] = piece;
    board[targetSq[0]][targetSq[1]] = king;
  } else if (finalMove.includes("=")) {
    board[targetSq[0]][targetSq[1]] = promotedPiece;
    board[sourceSq[0]][sourceSq[1]] = " ";
  } else if (finalMove.includes("ep")) {
    board[targetSq[0]][targetSq[1]] = piece;
    board[sourceSq[0]][sourceSq[1]] = " ";
    board[enPstPawnRank][enPstPawnFile] = " ";
  } else {
    board[targetSq[0]][targetSq[1]] = piece;
    board[sourceSq[0]][sourceSq[1]] = " ";
  }

  board = getBoard.Board;
  getBoard.showBoard(board);
  const inGamePcs = getBoard.createInGamePcs(board);
  const oppKing = not.KING[1 - c];
  const oppKingPos = inGamePcs[oppKing][0];

  if (chk.findCheck(c, inGamePcs, board, piece, targetSq, oppKingPos)) {
    finalMove += "+";
  }

  if (finalMove.includes("O-O")) {
    board[initialRookSq[0]][initialRookSq[1]] = piece;
    board[sourceSq[0]][sourceSq[1]] = king;
    board[castleRookSq[0]][castleRookSq[1]] = " ";
    board[targetSq[0]][targetSq[1]] = " ";
  } else if (finalMove.includes("ep")) {
    board[targetSq[0]][targetSq[1]] = " ";
    board[sourceSq[0]][sourceSq[1]] = piece;
    board[enPstPawnRank][enPstPawnFile] = enPassantCapturePawn;
  } else {
    board[targetSq[0]][targetSq[1]] = curr_piece;
    board[sourceSq[0]][sourceSq[1]] = piece;
  }
  getBoard.showBoard(getBoard.Board);
  return [
    c,
    pcsSymbol,
    piece,
    source,
    finalMove,
    enPassantPawnSquare,
    promotionSquare,
    promotedPiece,
  ];
}

async function checkValidity(move, color, promotionPiece) {
  return new Promise(async (resolve, reject) => {
    /* Return any accidental moves if game has ended */
    if (gameEnd) {
      return { status: "gameEnd", message: "Game has ended." };
    }

    /* Create the move string using move object and color received */
    try {
      let [
        c,
        pcsSymb,
        piece,
        src,
        finalMove,
        enPassantCapturePawn,
        promotionSquare,
        promotedPiece,
      ] = await readThisMove(move, color, promotionPiece);

      /* Find that the move is valid or not */
      const result = getIndex.squareToIndex(c, pcsSymb, src, finalMove);

      /* Change move string if checkmate occurs */
      if (result[0] === "1") {
        if (result[1] != "/") {
          finalMove = finalMove.slice(0, -1) + "#";
        }
        gameEnd = true;
      }

      if (result) {
        // Resolves with true if the move is valid
        resolve({
          status: "validMove",
          result: result,
          piece: piece,
          finalMove: finalMove,
          enPassantCapturePawn: enPassantCapturePawn,
          promotionSquare: promotionSquare,
          promotionPiece: promotedPiece,
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
