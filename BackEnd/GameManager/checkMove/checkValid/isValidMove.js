const findlegal = require("../findLegalMove/findLegal");
const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");
const not = require("../notations");
const king = require("../findLegalMove/King/legalKingMoves");
const findBlocked = require("../findLegalMove/findNextLegal/findBlockedKingSqs");
const dcrp = require("./decryptMove");
const gameSt = require("./updateGameState");
const los = require("../findLegalMove/findNextLegal/lineOfsightSqs");

let LEGALMOVES = findlegal.createLegalMoves();
let isInCheck = 0;
let whichPieceGaveCheck;
let checkPiecePos_OLD, checkPiecePos_NEW;

function isValid(piece, move, color, curr_row, curr_col, new_row, new_col) {
  const len = move.length;
  function showLegalMoves(LEGALMOVES) {
    console.log(
      `CURRENT POSITION OF ${not.COLOR[color]} PIECES AND THEIR LEGAL MOVES`
    );
    for (const allPieces in LEGALMOVES) {
      console.log(`-->>${not.PIECES[allPieces]}<<--`);
      for (const singlePiece in LEGALMOVES[allPieces][color]) {
        console.log(
          `${not.FILE[singlePiece[1]]}${not.RANK[singlePiece[0]]} : ${
            LEGALMOVES[allPieces][color][singlePiece]
          }`
        );
      }
      console.log("\n");
    }
  }

  /* Empty previous Legal moves of current color side */
  for (const allPcs in LEGALMOVES) {
    LEGALMOVES[allPcs][color] = {};
  }
  /* Find the squares from king moves covered by the opponent checking piece in the line of sight with the king*/
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    color,
    getBoard.prevMove,
    isInCheck
  );

  if (isInCheck) {
    /* Get the next Leagal of opponent to block the king movement to those squares*/
    for (const allPcs in LEGALMOVES) {
      LEGALMOVES[allPcs][1 - color] = {};
    }
    findlegal.findAllLegalMoves(
      LEGALMOVES,
      getBoard.Board,
      getBoard.createInGamePcs(getBoard.Board),
      1 - color,
      getBoard.prevMove,
      1
    );
    /*console.log(
      `CURRENT POSITION OF ${not.COLOR[1 - color]} PIECES AND THEIR LEGAL MOVES`
    );
    for (const allPieces in LEGALMOVES) {
      console.log(`-->>${not.PIECES[allPieces]}<<--`);
      for (const singlePiece in LEGALMOVES[allPieces][1 - color]) {
        console.log(
          `${not.FILE[singlePiece[1]]}${not.RANK[singlePiece[0]]} : ${
            LEGALMOVES[allPieces][1 - color][singlePiece]
          }`
        );
      }
      console.log("\n");
    }*/

    let inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    let blockedSquaresForKing = [];
    const king_pos = inGamePcs[not.KING[color]][0];
    let lineOfSight = [];

    los.LOS_Squares(
      1 - color,
      whichPieceGaveCheck,
      checkPiecePos_NEW,
      LEGALMOVES[whichPieceGaveCheck][1 - color][
        `${checkPiecePos_NEW[0]}${checkPiecePos_NEW[1]}`
      ],
      not.KING[color],
      lineOfSight
    );

    // console.log("LOS : ", lineOfSight);

    let checkPieceSquare = `${not.FILE[checkPiecePos_NEW[1]]}${
      not.RANK[checkPiecePos_NEW[0]]
    }`;
    const regexCheckPieceSquare = new RegExp(`^${checkPieceSquare}$`);

    /* Updating Legal Moves for capturing checking and blocking the check */
    for (const everyPiece in LEGALMOVES) {
      if (everyPiece == "k") {
        continue;
      }
      for (const uniquePiece in LEGALMOVES[everyPiece][color]) {
        /* Include the playable moves by each piece in availableMoves */
        const availableMoves = [];
        for (const singleMove of LEGALMOVES[everyPiece][color][uniquePiece]) {
          for (const move of lineOfSight) {
            const regexMove = new RegExp(`^${move}$`);
            if (
              /* To find squares to block the king and checking piece */
              regexMove.test(singleMove) ||
              /* To capture the checking piece */
              regexCheckPieceSquare.test(singleMove)
            ) {
              availableMoves.push(singleMove);
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
      not.KING[color], // King who is in check
      getBoard.Board, // Board
      inGamePcs // Current piece in the game with their position
    );

    // delete LEGALMOVES[whichPieceGaveCheck][1-color][`${checkPiecePos_NEW[0]}${checkPiecePos_NEW[1]}`];

    /*  Next move Squares of all pieces to block the king to move there */
    for (const everyPiece in LEGALMOVES) {
      for (const uniquePiece in LEGALMOVES[everyPiece][1 - color]) {
        for (const singleMove of LEGALMOVES[everyPiece][1 - color][
          uniquePiece
        ]) {
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
    for (const bl_move of blockedSquaresForKing) {
      for (
        let i = 0;
        i < LEGALMOVES["k"][color][`${king_pos[0]}${king_pos[1]}`].length;
        i++
      ) {
        const single_move =
          LEGALMOVES["k"][color][`${king_pos[0]}${king_pos[1]}`][i];
        if (single_move.includes(bl_move)) {
          LEGALMOVES["k"][color][`${king_pos[0]}${king_pos[1]}`].splice(i, 1);
          break;
        }
      }
    }

    /* Remaining Sqaures for the King Left */
    // console.log("king : ",LEGALMOVES["k"][color]);
    isInCheck = 0;
  }

  /* Print Full LegalMoves Object */
  // console.log(LEGALMOVES);

  /* SHOW FINAL LEGAL MOVES */
  showLegalMoves(LEGALMOVES);
  console.log(`-----------------------------------------------`);

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
    if (move[len - 1] == "+") {
      whichPieceGaveCheck = move[0];
      checkPiecePos_OLD = [curr_row, curr_col];
      checkPiecePos_NEW = [new_row, new_col];
      isInCheck = 1;
      /*  console.log(
        ` Is in Check : ${Boolean(isInCheck)}\n`,
        `Piece : ${whichPieceGaveCheck}\n`,
        `Position : ${not.FILE[checkPiecePos_OLD[1]]}${
          not.RANK[checkPiecePos_OLD[0]]
        }->${not.FILE[checkPiecePos_NEW[1]]}${not.RANK[checkPiecePos_NEW[0]]}`
      ); */
    }
  } else {
    console.log("ILLEGAL MOVE");
    return false;
  }
}

module.exports = { isValid };
