const findlegal = require("../findLegalMove/findLegal");
const getBoard = require("../../Board/createBoard");
const not = require("../notations");
const findBlocked = require("../findLegalMove/squaresAfterCheck/findBlockedKingSqs");
const dcrp = require("./decryptMove");
const gameSt = require("./updateGameState");
const los = require("../findLegalMove/squaresAfterCheck/lineOfsightSqs");
const pin = require("./updatePinnedPcs");

let LEGALMOVES = findlegal.createLegalMoves();
let isInCheck = 0;
let pinnedPcs = {
  0: {},
  1: {},
};
let pinningPcs = {
  0: {},
  1: {},
};
let whichPieceGaveCheck;
let checkPiecePos_OLD, checkPiecePos_NEW;

function isValid(piece, move, color, curr_row, curr_col, new_row, new_col) {
  const len = move.length;
  const inGamePcs = getBoard.createInGamePcs(getBoard.Board);
  const king = not.KING[color];
  const king_pos = inGamePcs[not.KING[color]][0];
  const kingRankFile = `${not.FILE[king_pos[1]]}${not.RANK[king_pos[0]]}`;
  let blockedSquaresForKing = [];

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
    pinnedPcs
  );

  /* Get the next Legal of opponent to block the king movement to those squares*/
  for (const allPcs in LEGALMOVES) {
    LEGALMOVES[allPcs][1 - color] = {};
  }
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    1 - color,
    getBoard.prevMove,
    isInCheck,
    pinnedPcs
  );

  for (const allPieces in LEGALMOVES) {
    for (const singlePiece in LEGALMOVES[allPieces][1 - color]) {
      for (const eachMove of LEGALMOVES[allPieces][1 - color][singlePiece]) {
        blockedSquaresForKing.push(eachMove);
      }
    }
  }
  dcrp.decryptMove(blockedSquaresForKing, piece, color);

  /* Block the squares from King Already covered by Opp pieces */

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

  if (isInCheck) {
    /* Find the squares from king moves covered by the opponent checking piece in the line of sight with the king*/
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
  }

  /* Print Full LegalMoves Object */
  // console.log(LEGALMOVES);

  /* SHOW FINAL LEGAL MOVES */
  showLegalMoves(LEGALMOVES, color);
  console.log(`-----------------------------------------------`);

  /*for (const allPcs in LEGALMOVES) {
    LEGALMOVES[allPcs][1-color] = {};
  }
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    1-color,
    getBoard.prevMove,
    isInCheck,
    pinnedPcs
  );
  showLegalMoves(LEGALMOVES,1-color);
  console.log(`-----------------------------------------------`);*/

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
    /*findlegal.findAllLegalMoves(
      LEGALMOVES,
      getBoard.Board,
      getBoard.createInGamePcs(getBoard.Board),
      color,
      getBoard.prevMove,
      isInCheck,
      pinnedPcs
    );*/
    pin.updatePinnedPieceState(
      color,
      piece,
      move,
      [curr_row, curr_col],
      [new_row, new_col],
      pinnedPcs,
      pinningPcs,
      not.KING[color],
      inGamePcs,
      LEGALMOVES
    );

    if (isInCheck) {
      /* If king Didn't move */
      if (move[0] != "k" && move[0] != "K") {
        /* If the checking piece is not captured */
        if (move[1] != "x") {
          /* Add piece that blocked check */
          pinnedPcs[color][piece] = {
            [`${new_row}${new_col}`]: [
              whichPieceGaveCheck,
              [new_row, new_col],
              [`${not.FILE[new_col]}${not.RANK[new_row]}`],
              [checkPiecePos_NEW[0], checkPiecePos_NEW[1]],
              [
                `${not.FILE[checkPiecePos_NEW[1]]}${
                  not.RANK[checkPiecePos_NEW[0]]
                }`,
              ],
              [],
              [],
            ],
          };
          pinningPcs[1 - color] = {
            [`${whichPieceGaveCheck}`]: {
              [`${checkPiecePos_NEW[0]}${checkPiecePos_NEW[1]}`]: [
                piece,
                `${new_row}${new_col}`,
              ],
            },
          };
        }
      }
      isInCheck = 0;
    } else if (move[len - 1] == "+") {
      whichPieceGaveCheck = move[0].toLowerCase();
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
    // console.log(`Pinned Pieces : ${JSON.stringify(pinnedPcs, null, 3)}`);
    // console.log(`Pinning Pieces : ${JSON.stringify(pinningPcs, null, 3)}`);
  } else {
    console.log("ILLEGAL MOVE");
    return false;
  }
}

module.exports = { isValid };
