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

function isValid(piece, move, color, curr_row, curr_col, new_row, new_col) {
  let flagForCheck = false;
  let checkInfo = {
    0: {},
    1: {},
  };
  /* Check for new Pins */
  newPin.detectPins();

  const len = move.length;
  let inGamePcs = getBoard.createInGamePcs(getBoard.Board); // Current pieces object with posiitons
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
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    color,
    getBoard.prevMove,
    isInCheck,
    checkInfo
  );
  /*console.log(
    "ALL CHECK PIECES INFORMATION FOR ",
    not.COLOR[color],
    "\n",
    checkInfo[color]
  );
  console.log(`-----------------------------------------------`);*/

  sqsCovered.findSquares(
    newPin.getPinnedPcs(),
    1 - color, // color of opponent side
    blockedSquaresForKing // adding the squares covered by opponent pinned Piece to restrict own king to move
  );

  oppMoves.findOppMoves(
    1 - color, // Color of opponent side
    king, // Own king
    kingPos, // Position of own king
    LEGALMOVES, // LegalMoves object
    blockedSquaresForKing, // Squares restricted from opponent king to move
    isInCheck,
    checkInfo
  );

  if (isInCheck) {
    console.log("Piece that Gave check : ", whichPieceGaveCheck,checkPiecePos_NEW);
    flagForCheck = true;
    doubleCheckPieceArray = doubleChk.isDoubleCheck(
      kingPos,
      getBoard.Board,
      color
    );
    // console.log(doubleCheckPieceArray);
    const checkPcs = doubleCheckPieceArray.checkingPieces;
    if (doubleCheckPieceArray.isDoubleCheck) {
      sqsInDoubleCheck.blockSquaresInDoubleCheck(
        kingPos,
        getBoard.Board,
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
      blockedSquaresForKing // squares restricted from opponent king to move
    );
  }
  blockedSquaresForKing = []; // Empty the squares for later use if needed

  /* Print Full LegalMoves Object */
  // console.log(LEGALMOVES);

  /* SHOW FINAL LEGAL MOVES */
  showLegalMoves(LEGALMOVES, color);
  console.log(`-----------------------------------------------`);
  // showLegalMoves(LEGALMOVES, 1 - color);
  // console.log(`-----------------------------------------------`);

  /* Handle CheckMate Move */
  if (move[len - 1] === "#") {
    gameSt.updateGS(
      move,
      len,
      color,
      piece,
      getBoard.Game_State,
      curr_row,
      curr_col,
      new_row,
      new_col
    );
    inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    king = not.KING[1 - color]; // opponent side king
    kingPos = inGamePcs[king][0]; // position of opponent side king
    move[len - 1] = "+";

    /* Find pieces moves of side who made chekmate move */
    oppMoves.findOppMoves(
      color, // color of own side
      king,
      kingPos,
      LEGALMOVES,
      blockedSquaresForKing,
      true,
      checkInfo
    );
    /* Find piece moves of side who received checkmate move */
    afterCheck.findMoves(
      1 - color,
      king,
      kingPos,
      piece, // Piece who just made a move(the piece who made checkmate move)
      [new_row, new_col],
      LEGALMOVES,
      inGamePcs,
      blockedSquaresForKing
    );
    showLegalMoves(LEGALMOVES, 1 - color);
    console.log(`-----------------------------------------------`);
    /* Find if there is not move left  */
    for (const singlePiece in LEGALMOVES) {
      for (const uniquePiece in LEGALMOVES[singlePiece][1 - color]) {
        if (singlePiece == "k") {
          let tMoves = 0;
          for (const m of LEGALMOVES[singlePiece][1 - color][uniquePiece]) {
            if (m[0] == not.KING[1 - color]) {
              tMoves++;
            }
          }
          if (tMoves.length > 0) {
            console.log("IllegalMove");
            return false;
          }
          continue;
        }
        if (LEGALMOVES[singlePiece][1 - color][uniquePiece].length > 0) {
          console.log(LEGALMOVES[singlePiece][1 - color][uniquePiece]);
          console.log("Illegal Move");
          return false;
        }
      }
    }
    console.log("CheckMate");
    return true;
  }
  if (LEGALMOVES[piece][color][`${curr_row}${curr_col}`].includes(move)) {
    gameSt.updateGS(
      move,
      len,
      color,
      piece,
      getBoard.Game_State,
      curr_row,
      curr_col,
      new_row,
      new_col
    );
     if(isInCheck){
      isInCheck = false;
     }
    if (move[len - 1] == "+") {
      whichPieceGaveCheck = checkInfo[color][move].checkPiece.toLowerCase();
      checkPiecePos_NEW = [
        checkInfo[color][move].rank,
        checkInfo[color][move].file,
      ];
      isInCheck = true;
    }
    return true;
  } else {
    console.log("ILLEGAL MOVE");
    return false;
  }
}

module.exports = { isValid };
