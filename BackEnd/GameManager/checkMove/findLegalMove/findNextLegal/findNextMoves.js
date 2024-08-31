const not = require("../../notations");
const Queen = require("../Queen/legalQueenMoves");

function Bishop(locOfKing, piece_pos, blockedSqs, whichPiece) {
  if (locOfKing[0] + locOfKing[1] == piece_pos[0] + piece_pos[1]) {
    // console.log("BishopRightDiag");
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0] + 1]}`,
      `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0] - 1]}`
    );
  } else {
    // console.log("BishopLeftDiag");
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0] - 1]}`,
      `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0] + 1]}`
    );
  }
}
function Rook(locOfKing, piece_pos, blockedSqs, whichPiece) {
  if (locOfKing[0] == piece_pos[0]) {
    // console.log("RookRank");
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0]]}`,
      `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0]]}`
    );
  } else if (locOfKing[1] == piece_pos[1]) {
    // console.log("RookFile");
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1]]}${not.RANK[locOfKing[0] - 1]}`,
      `${whichPiece}${not.FILE[locOfKing[1]]}${not.RANK[locOfKing[0] + 1]}`
    );
  }
}
function Knight(locOfKing, piece_pos, blockedSqs, whichPiece) {
  // console.log("Knight");
  if (
    piece_pos[0] == locOfKing[0] - 2 &&
    piece_pos[1] == locOfKing[1] - 1 &&
    piece_pos[0] == locOfKing[0] + 1 &&
    piece_pos[1] == locOfKing[1] + 2
  ) {
    `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0] - 1]}`;
  } else if (
    piece_pos[0] == locOfKing[0] - 1 &&
    piece_pos[1] == locOfKing[1] - 2 &&
    piece_pos[0] == locOfKing[0] + 2 &&
    piece_pos[1] == locOfKing[1] + 1
  ) {
    `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0] + 1]}`;
  } else if (
    piece_pos[0] == locOfKing[0] - 2 &&
    piece_pos[1] == locOfKing[1] + 1 &&
    piece_pos[0] == locOfKing[0] + 1 &&
    piece_pos[1] == locOfKing[1] - 2
  ) {
    `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0] - 1]}`;
  } else if (
    piece_pos[0] == locOfKing[0] - 1 &&
    piece_pos[1] == locOfKing[1] + 2 &&
    piece_pos[0] == locOfKing[0] + 2 &&
    piece_pos[1] == locOfKing[1] - 1
  ) {
    `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0] + 1]}`;
  }
}

function nxtMvByPcGivCheck(
  color,
  whichPiece,
  piece_pos,
  LEGALMOVES,
  blockedSqs,
  king,
  board,
  inGamePcs
) {
  const locOfKing = [inGamePcs[king][0][0], inGamePcs[king][0][1]];
  // console.log("locofking :", locOfKing);
  // console.log("whichPiece : ", whichPiece);
  // console.log("locOfpiece : ", piece_pos);
  // console.log(blockedSqs);
  if (whichPiece == "b" || whichPiece == "B") {
    Bishop(locOfKing, piece_pos, blockedSqs, whichPiece);
  } else if (whichPiece == "r" || whichPiece == "R") {
    Rook(locOfKing, piece_pos, blockedSqs, whichPiece);
  } else if (whichPiece == "n" || whichPiece == "N") {
    Knight(locOfKing, piece_pos, blockedSqs, whichPiece);
  } else if (whichPiece == "q" || whichPiece == "Q") {
    Rook(locOfKing, piece_pos, blockedSqs, whichPiece);
    if (!Boolean(blockedSqs)) {
      Bishop(locOfKing, piece_pos, blockedSqs, whichPiece);
    }
    Queen.findQueen(
      color,
      LEGALMOVES,
      not.ALLPIECES,
      inGamePcs,
      not.RANK,
      not.FILE,
      board,
      ["Q", "q"],
      1
    );
    for (const queen of LEGALMOVES[whichPiece][color][
      `${piece_pos[0]}${piece_pos[1]}`
    ]) {
      blockedSqs.push(queen);
    }
    // delete LEGALMOVES[whichPiece][color][`${piece_pos[0]}${piece_pos[1]}`];
  }
  return blockedSqs;
}
module.exports = { nxtMvByPcGivCheck };
