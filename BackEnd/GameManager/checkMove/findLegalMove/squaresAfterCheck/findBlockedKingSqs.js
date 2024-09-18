const not = require("../../notations");

function Bishop(locOfKing, piece_pos, blockedSqs, whichPiece) {
  if (locOfKing[0] + locOfKing[1] == piece_pos[0] + piece_pos[1]) {
    /* Right Diagonal */
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0] + 1]}`,
      `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0] - 1]}`
    );
  } else if (locOfKing[0] - locOfKing[1] == piece_pos[0] - piece_pos[1]) {
    /* Left Diagonal */
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0] - 1]}`,
      `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0] + 1]}`
    );
  }
}

function Rook(locOfKing, piece_pos, blockedSqs, whichPiece) {
  if (locOfKing[0] == piece_pos[0]) {
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1] - 1]}${not.RANK[locOfKing[0]]}`,
      `${whichPiece}${not.FILE[locOfKing[1] + 1]}${not.RANK[locOfKing[0]]}`
    );
  } else if (locOfKing[1] == piece_pos[1]) {
    blockedSqs.push(
      `${whichPiece}${not.FILE[locOfKing[1]]}${not.RANK[locOfKing[0] - 1]}`,
      `${whichPiece}${not.FILE[locOfKing[1]]}${not.RANK[locOfKing[0] + 1]}`
    );
  }
}

function kingSqBlockedBypiece(
  color,
  whichPiece,
  piece_pos,
  LEGALMOVES,
  blockedSqs,
  lineOfSight,
  king,
  board,
  inGamePcs,
) 
{
  const locOfKing = [inGamePcs[king][0][0], inGamePcs[king][0][1]];
  
  if(whichPiece =="p" ||  whichPiece == "n"){
    return;
  }
  
  if (whichPiece == "b" || whichPiece == "B") {
    Bishop(locOfKing, piece_pos, blockedSqs, whichPiece);
  } else if (whichPiece == "r" || whichPiece == "R") {
    Rook(locOfKing, piece_pos, blockedSqs, whichPiece);
  } else if (whichPiece == "q" || whichPiece == "Q") {
    let randomArray = [];
    Rook(locOfKing, piece_pos, randomArray, whichPiece);
    if(randomArray.length == 0){
      Bishop(locOfKing, piece_pos, blockedSqs, whichPiece);
    } else{
      for(const moves of randomArray){
        blockedSqs.push(moves);
      }
    }
  }
   
  /* Remove the Square of the checking piece from blocking if is 1 square closer to king */
  if (
    Math.abs(piece_pos[0] - locOfKing[0]) == 1 ||
    Math.abs(piece_pos[1] - locOfKing[1]) == 1
  ) {
    const indexToRemove = blockedSqs.indexOf(
      `${whichPiece}${not.FILE[piece_pos[1]]}${not.RANK[piece_pos[0]]}`
    );
    if (indexToRemove !== -1) {
      blockedSqs.splice(indexToRemove, 1);
    }
  }
  return blockedSqs;
}
module.exports = { kingSqBlockedBypiece };
