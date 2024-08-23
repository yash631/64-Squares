const { isValid } = require("./isValidMove");

function fixMove(move, color) {
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
  const allFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let curr_pos, new_pos;
  if (allFiles.includes(move[0])) {
    if (move[1] != "x") {
      curr_pos = [rank[move[1]] + 1, file[move[0]]];
      new_pos = [rank[move[1]], file[move[0]]];
    }
  }
  return isValid(
    move,
    color,
    curr_pos[0],
    curr_pos[1],
    new_pos[0],
    curr_pos[1]
  );
}
module.exports = { fixMove };
