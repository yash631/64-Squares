const { isValid } = require("./isValidMove");
const not = require("../notations");

function squareToIndex(color, piece, initial_Sq, move) {
  let curr_sq = [],
    target_sq = [];
  curr_sq[0] = not.RTI[initial_Sq[1]];
  curr_sq[1] = not.FTI[initial_Sq[0]];
  const allfiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
  if (allfiles.includes(move[0])) {
    if (allfiles.includes(move[1])) {
      target_sq[0] = not.RTI[move[2]];
      target_sq[1] = not.FTI[move[1]];
    } else if (move[1] == "x") {
      target_sq[0] = not.RTI[move[3]];
      target_sq[1] = not.FTI[move[2]];
    } else {
      target_sq[0] = not.RTI[move[1]];
      target_sq[1] = not.FTI[move[0]];
    }
  } else {
    if (move[1] == "x") {
      target_sq[0] = not.RTI[move[3]];
      target_sq[1] = not.FTI[move[2]];
    } else {
      target_sq[0] = not.RTI[move[2]];
      target_sq[1] = not.FTI[move[1]];
    }
  }
  return isValid(
    piece,
    move,
    color,
    curr_sq[0],
    curr_sq[1],
    target_sq[0],
    target_sq[1]
  );
}
module.exports = { squareToIndex };
