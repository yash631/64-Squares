const not = require("../../notations");
const dcrp = require("../../checkValid/decryptMove");
const updLM = require("./updateLegalMoves");
const los = require("../squaresAfterCheck/lineOfsightSqs");
const findBlocked = require("../squaresAfterCheck/findBlockedKingSqs");
const getBoard = require("../../../Board/createBoard");

function findMoves(
  color,
  king,
  kingPos,
  whichPieceGaveCheck,
  checkPiecePos_NEW,
  LEGALMOVES,
  inGamePcs,
  blockedSquaresForKing,
  gameid,
) {
  const board = getBoard.getCurrentBoard(gameid);

  /* Find the squares from king moves covered by the opponent checking piece in the line of sight with the king*/
  let lineOfSight = [];
  los.LOS_Squares(
    whichPieceGaveCheck,
    checkPiecePos_NEW,
    kingPos,
    lineOfSight,
  );
 
  // console.log("LOS : ", lineOfSight);

  let checkPieceSquare = `${not.FILE[checkPiecePos_NEW[1]]}${
    not.RANK[checkPiecePos_NEW[0]]
  }`;
  // console.log("checkPiece Square :",checkPieceSquare);

  /* Updating Legal Moves for capturing checking piece and blocking the check */
  for (const everyPiece in LEGALMOVES) {
    if (everyPiece == "k") {
      continue;
    }
    for (const uniquePiece in LEGALMOVES[everyPiece][color]) {
      /* Include the playable moves by each piece in availableMoves */
      const availableMoves = [];
      for (const singleMove of LEGALMOVES[everyPiece][color][uniquePiece]) { 
        if (lineOfSight.length == 0) {
          if (singleMove.includes(`x${checkPieceSquare}`)) {
            availableMoves.push(singleMove);
          }
        } else {
          for (const move of lineOfSight) {
            if (
              /* To find squares to block the king and checking piece */
              singleMove.includes(move) ||
              /* To capture the checking piece */
              singleMove.includes(`x${checkPieceSquare}`)
            ) {
              availableMoves.push(singleMove);
            }
          }
        }
      }
      LEGALMOVES[everyPiece][color][uniquePiece] = availableMoves;
    }
  }
  /* To find squares from the king moves that are covered by checking piece */
  findBlocked.kingSqBlockedBypiece(
    1 - color, // color of opponent piece
    whichPieceGaveCheck, // opponent checking piece
    checkPiecePos_NEW, // position of opponent checking piece (Board index)
    LEGALMOVES, // All legal moves from opponent piece side
    blockedSquaresForKing, // Sqaures to block the king to move
    lineOfSight,
    king, // King who is in check
    board, // Board
    inGamePcs, // Current piece in the game with their position
  );
  // delete LEGALMOVES[whichPieceGaveCheck][1-color][`${checkPiecePos_NEW[0]}${checkPiecePos_NEW[1]}`];

  /*  Next move Squares of all pieces to block the king to move there */
  for (const everyPiece in LEGALMOVES) {
    for (const uniquePiece in LEGALMOVES[everyPiece][1 - color]) {
      for (const singleMove of LEGALMOVES[everyPiece][1 - color][uniquePiece]) {
        blockedSquaresForKing.push(singleMove);
      }
    }
  }

  /* Moves of opponent side pieces */
  // console.log("blocked squares : ",blockedSquaresForKing);

  /* All Squares that are blocked by the opponent side */
  dcrp.decryptMove(blockedSquaresForKing, whichPieceGaveCheck, 1 - color);
  // console.log("decrypted move : ", blockedSquaresForKing);

  /* Remove the all squares blocked and covered by the piece giving check from the King moves*/
  updLM.updateLM(color, kingPos, LEGALMOVES, blockedSquaresForKing);

  /* Remaining Sqaures for the King Left */
  // console.log("king : ",LEGALMOVES["k"][color]);
}
module.exports = { findMoves };
