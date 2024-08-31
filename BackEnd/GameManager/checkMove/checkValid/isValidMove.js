const findlegal = require("../findLegalMove/findLegal");
const updateBoard = require("../../Board/updateBoard");
const getBoard = require("../../Board/createBoard");
const not = require("../notations");
const king = require("../findLegalMove/King/legalKingMoves");
const nextMove = require("../findLegalMove/findNextLegal/findNextMoves");
const dcrp = require("./decryptMove");
let LEGALMOVES = findlegal.createLegalMoves();
let isInCheck = 0;
let whichPieceGaveCheck;
let checkPiecePos_OLD,checkPiecePos_NEW;

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
  if (isInCheck) {
    /* Get the Next moves by all piece of side giving check */
    for (const allPcs in LEGALMOVES) {
      LEGALMOVES[allPcs][1-color] = {};
    }
    findlegal.findAllLegalMoves(
      LEGALMOVES,
      getBoard.Board,
      getBoard.createInGamePcs(getBoard.Board),
      1-color,
      getBoard.prevMove,
      1
    );

    let inGamePcs = getBoard.createInGamePcs(getBoard.Board);
    let blockedSquaresForKing = [];
    const king_pos = inGamePcs[not.KING[color]][0];

    /* Finding the next moves or sqaures by the checking piece to limit the king moves */
    nextMove.nxtMvByPcGivCheck(
      1 - color, // color of checking piece
      whichPieceGaveCheck, // checking piece
      checkPiecePos_NEW, // position of checking piece (Board index)
      LEGALMOVES, // All legal moves from checking piece side
      blockedSquaresForKing, // Sqaures to block the king to move
      not.KING[color], // King who is in check
      getBoard.Board, // Board
      inGamePcs // Current piece in the game with their position
    );
    
    // delete LEGALMOVES[whichPieceGaveCheck][1-color][`${checkPiecePos_NEW[0]}${checkPiecePos_NEW[1]}`];
    console.log(
      `CURRENT POSITION OF ${not.COLOR[1-color]} PIECES AND THEIR LEGAL MOVES`
    );
    for (const allPieces in LEGALMOVES) {
      console.log(`-->>${not.PIECES[allPieces]}<<--`);
      for (const singlePiece in LEGALMOVES[allPieces][1-color]) {
        console.log(
          `${not.FILE[singlePiece[1]]}${not.RANK[singlePiece[0]]} : ${
            LEGALMOVES[allPieces][1-color][singlePiece]
          }`
        );
      }
      console.log("\n");
    }

    /* All possible Squares that can  be blocked by the checking piece */
    dcrp.decryptMove(blockedSquaresForKing, whichPieceGaveCheck, 1 - color);
    console.log(blockedSquaresForKing);

    /* Block the Squares from the King moves covered by the piece giving check */
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

    // console.log(checkPiecePos_NEW);
    // console.log("legalmoves of piece : ",LEGALMOVES[whichPieceGaveCheck][1-color]);
    // console.log(inGamePcs);
    isInCheck = 0;
  }
  for (const allPcs in LEGALMOVES) {
    LEGALMOVES[allPcs][color] = {};
  }
  findlegal.findAllLegalMoves(
    LEGALMOVES,
    getBoard.Board,
    getBoard.createInGamePcs(getBoard.Board),
    color,
    getBoard.prevMove,
    isInCheck
  );
  /* Print Full LegalMoves Object */
  // console.log(LEGALMOVES);

  /* SHOW LEGAL MOVES */
  showLegalMoves(LEGALMOVES);
  console.log(`-----------------------------------------------`);

  if (LEGALMOVES[piece][color][`${curr_row}${curr_col}`].includes(move)) {
    if (color) {
      piece = piece.toUpperCase();
    }
    getBoard.Game_State.push(move);
    console.log("MOVES : ", getBoard.Game_State);
    if (move == "O-O") {
      king.Castling[color].k = -1;
      king.Castling[color].q = -1;
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.KING[color],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1] + 2
      );
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.ROOK[color],
        not.ROOK[`pos${color}`]["k"][0],
        not.ROOK[`pos${color}`]["k"][1],
        not.ROOK[`pos${color}`]["k"][0],
        not.ROOK[`pos${color}`]["k"][1] - 2
      );
    } else if (move == "O-O-O") {
      king.Castling[color].k = -1;
      king.Castling[color].q = -1;
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.KING[color],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1],
        not.KING[`pos${color}`][0],
        not.KING[`pos${color}`][1] - 2
      );
      updateBoard.updateInGamePcs(
        getBoard.Board,
        not.ROOK[color],
        not.ROOK[`pos${color}`]["q"][0],
        not.ROOK[`pos${color}`]["q"][1],
        not.ROOK[`pos${color}`]["q"][0],
        not.ROOK[`pos${color}`]["q"][1] + 3
      );
    } else {
      if (move[0] == not.KING[color]) {
        king.Castling[color].k = 0;
        king.Castling[color].q = 0;
      } else if (move[0] == "r") {
        if (curr_row == 0 && curr_col == 0) {
          king.Castling[0].q = 0;
        } else if (curr_row == 0 && curr_col == 7) {
          king.Castling[0].k = 0;
        }
      } else if (move[0] == "R") {
        if (curr_row == 7 && curr_col == 0) {
          king.Castling[1].q = 0;
        } else if (curr_row == 7 && curr_col == 7) {
          king.Castling[1].k = 0;
        }
      }

      /* For Pawn's promotion */
      if (not.ALLPIECES[color].includes(move[len - 1])) {
        piece = move[len - 1];
      } else if (
        /* For pawn's promotion with check or checkmate*/
        (move[len - 1] == "+" || move[len - 1] == "#") &&
        not.ALLPIECES[color].includes(move[len - 2])
      ) {
        piece = move[len - 2];
      }
    }
    updateBoard.updateInGamePcs(
      getBoard.Board,
      piece,
      curr_row,
      curr_col,
      new_row,
      new_col
    );
    getBoard.prevMove = `${curr_row}${curr_col}${move}`;
    // console.log(getBoard.prevMove);
    getBoard.showBoard(getBoard.Board);
    /*console.log(`\nBoard Updated after ${move}\n`);
      console.log(getBoard.createInGamePcs(getBoard.Board)); */
    console.log();
    if (move[len - 1] == "+") {
      whichPieceGaveCheck = move[0];
      checkPiecePos_OLD - [curr_row,curr_col];
      checkPiecePos_NEW = [new_row, new_col];
      isInCheck = 1;
    }
    return true;
  }
  return false;
}

module.exports = { isValid };
