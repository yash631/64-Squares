const findlegal = require("../findLegalMove/findLegal");
const getBoard = require("../../Board/createBoard");
const not = require("../notations");
const gameSt = require("./updateGameState");
const oppMoves = require("../findLegalMove/King/removeNextMoves");
const newPin = require("../findLegalMove/King/findPins/checkNewPins");
const afterCheck = require("../findLegalMove/King/inCheckMoves");
const sqsCovered = require("../findLegalMove/King/squaresCoveredByPinnedPcs");
const sqsInDoubleCheck = require("../findLegalMove/squaresAfterCheck/doubleCheckSqs");
const doubleChk = require("./lookForDoubleCheck");

let LEGALMOVES = findlegal.createLegalMoves();
let isInCheck = 0;
let whichPieceGaveCheck;
let checkPiecePos_NEW;
let lookForChkmtAndStlmt = false;

function isValid(
  piece,
  move,
  color,
  curr_row,
  curr_col,
  new_row,
  new_col,
  gameid
) {
  let flagForCheck = false;
  let checkInfo = {
    0: {},
    1: {},
  };
  /* Check for new Pins */
  newPin.detectPins(gameid);

  const len = move.length;
  let board = getBoard.getCurrentBoard(gameid);
  let prevMove = getBoard.getPrevMove(gameid);
  let inGamePcs = getBoard.createInGamePcs(board); // Current pieces object with posiitons
  let king = not.KING[color]; // Own side King
  let kingPos = inGamePcs[king][0]; // Position of own side king in the board
  let blockedSquaresForKing = []; // Include squares to restrict the king to make move on them

  /* Print Legal Moves */
  function showLegalMoves(LEGALMOVES, C) {
    console.log(
      `CURRENT POSITION OF ${not.COLOR[C]} PIECES AND THEIR LEGAL MOVES`
    );
    for (const allPieces in LEGALMOVES) {
      console.log(`-->>${not.PIECES[allPieces]}<<--`);
      for (const singlePiece in LEGALMOVES[allPieces][C]) {
        console.log(`${not.FILE[singlePiece[1]]}${not.RANK[singlePiece[0]]}`);
        console.log(LEGALMOVES[allPieces][C][singlePiece]);
      }
      console.log("\n");
    }
  }

  /* Empty previous Legal moves of current color side */
  for (const allPcs in LEGALMOVES) {
    LEGALMOVES[allPcs][color] = {};
  }
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    board,
    inGamePcs,
    color,
    prevMove,
    isInCheck,
    checkInfo,
    gameid
  );
  /*
  console.log(
    "ALL CHECK PIECES INFORMATION FOR ",
    not.COLOR[color],
    "\n",
    checkInfo[color]
  );
  console.log(`-----------------------------------------------`);
  */

  sqsCovered.findSquares(
    newPin.getPinnedPcs(gameid),
    1 - color, // color of opponent side
    blockedSquaresForKing, // adding the squares covered by opponent pinned Piece to restrict own king to move
    gameid
  );

  oppMoves.findOppMoves(
    1 - color, // Color of opponent side
    king, // Own king
    kingPos, // Position of own king
    LEGALMOVES, // LegalMoves object
    blockedSquaresForKing, // Squares restricted from opponent king to move
    isInCheck,
    checkInfo,
    gameid
  );

  if (isInCheck) {
    board = getBoard.getCurrentBoard(gameid);
    flagForCheck = true;
    doubleCheckPieceArray = doubleChk.isDoubleCheck(kingPos, board, color);
    // console.log(doubleCheckPieceArray);
    const checkPcs = doubleCheckPieceArray.checkingPieces;
    if (doubleCheckPieceArray.isDoubleCheck) {
      sqsInDoubleCheck.blockSquaresInDoubleCheck(
        kingPos,
        board,
        checkPcs,
        blockedSquaresForKing
      );
      // console.log("Checking Pieces : ", checkPcs);
      for (const singlePiece in LEGALMOVES) {
        if (singlePiece == "k") {
          continue;
        }
        for (const uniquePiece in LEGALMOVES[singlePiece][color]) {
          LEGALMOVES[singlePiece][color][uniquePiece] = [];
        }
      }
    }
    afterCheck.findMoves(
      color, // color of own side
      king, // king of own side
      kingPos, // position of own side king
      whichPieceGaveCheck, // piece who delivered check
      checkPiecePos_NEW, // square on which the piece made check
      LEGALMOVES, // legal moves object
      inGamePcs, // Object containing all current board pieces and positions
      blockedSquaresForKing, // squares restricted from opponent king to move
      gameid
    );
  }
  blockedSquaresForKing = []; // Empty the squares for later use if needed

  /* Print Full LegalMoves Object */
  // console.log(LEGALMOVES);

  /* SHOW FINAL LEGAL MOVES */
  // showLegalMoves(LEGALMOVES, color);
  // console.log(`-----------------------------------------------`);
  // showLegalMoves(LEGALMOVES, 1 - color);
  // console.log(`-----------------------------------------------`);

  if (lookForChkmtAndStlmt) {
    lookForChkmtAndStlmt = false;
    return;
  }
  if (LEGALMOVES[piece][color][`${curr_row}${curr_col}`].includes(move)) {
    gameSt.updateGS(
      move,
      len,
      color,
      piece,
      getBoard.getGameState(gameid),
      curr_row,
      curr_col,
      new_row,
      new_col,
      gameid
    );
    if (isInCheck) {
      isInCheck = false;
    } else if (move[len - 1] == "+") {
      whichPieceGaveCheck = checkInfo[color][move].checkPiece.toLowerCase();
      checkPiecePos_NEW = [
        checkInfo[color][move].rank,
        checkInfo[color][move].file,
      ];
      isInCheck = true;
    }

    /* Finding next moves of other side pieces */
    lookForChkmtAndStlmt = true;
    isValid(
      piece,
      move,
      1 - color,
      curr_row,
      curr_col,
      new_row,
      new_col,
      gameid
    );

    let Tmoves = 0;
    for (const allPcs in LEGALMOVES) {
      for (const uniquePiece in LEGALMOVES[allPcs][1 - color]) {
        for (const moves of LEGALMOVES[allPcs][1 - color][uniquePiece]) {
          // console.log("Move: ", moves);
          if (allPcs == "p") {
            /* Finding playable moves for pawns */
            if (moves[0] != "P" && move[1] != "p") {
              Tmoves++;
              break; // Breaking the loop just after a playable move is found
            }
          }
          if (moves[0].toLowerCase() === allPcs) {
            /* Finding playable moves for other pieces */
            Tmoves++;
            break; // Breaking the loop just after a playable move is found
          }
        }
      }
    }
    if (Tmoves === 0 && isInCheck) {
      console.log(`${not.COLOR[color]} delivered Checkmate`);
      return `1${color}${1 - color}`; // Return this for game ending in checkmate as 1 followed by winner color side followed by loser color side
    } else if (Tmoves === 0 && !isInCheck) {
      console.log("Stalemate");
      return `1/2`; // Return `1/2` for stalemate or draw
    }

    return `0`; // Return `0` if the move is legal and the game is still going
  } else {
    console.log("ILLEGAL MOVE");
    return false;
  }
}

module.exports = { isValid };
