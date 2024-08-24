const { isValid } = require("./isValidMove");

function fixMove(initial_Sq, move, color) {
  const rank = {
      1: 7,
      2: 6,
      3: 5,
      4: 4,
      5: 3,
      6: 2,
      7: 1,
      8: 0,
    },
    file = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      e: 4,
      f: 5,
      g: 6,
      h: 7,
    };
  let curr_sq = [],
    target_sq = [];
  curr_sq[0] = rank[initial_Sq[1]];
  curr_sq[1] = file[initial_Sq[0]];
  const allfiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const allpieces = ["b", "B", "r", "R", "n", "N", "q", "Q", "k", "K"];
  if (allfiles.includes(move[0])) {
    if (allfiles.includes(move[1])) {
      target_sq[0] = rank[move[2]];
      target_sq[1] = file[move[1]];
    } else if (move[1] == "x") {
      target_sq[0] = rank[move[3]];
      target_sq[1] = file[move[2]];
    } else {
      target_sq[0] = rank[move[1]];
      target_sq[1] = file[move[0]];
    }
  } else if (allpieces.includes(move[0])) {
    if (move[1] == "x") {
      target_sq[0] = rank[move[3]];
      target_sq[1] = file[move[2]];
    } else {
      target_sq[0] = rank[move[2]];
      target_sq[1] = file[move[1]];
    }
  }
  console.log(`Move Entered :${move}`);
  console.log(`Intial Sqaure => ${curr_sq}, Target Sqaure ${[target_sq]}\n`);
  return isValid(
    move,
    color,
    curr_sq[0],
    curr_sq[1],
    target_sq[0],
    target_sq[1]
  );
}
module.exports = { fixMove };
