const ALLPIECES = {
  1: ["P", "N", "B", "R", "Q"],
  0: ["p", "n", "b", "r", "q"],
};
const COLOR = {
  1: "WHITE",
  0: "BLACK",
};
const PIECES = {
  p: "PAWN",
  b: "BISHOP",
  r: "ROOK",
  n: "KNIGHT",
  q: "QUEEN",
  k: "KING",
};
/* for finding check */
const KING = {
  0: "k",
  1: "K",
};

const FILE = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
  },
  RANK = {
    0: 8,
    1: 7,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 1,
  };
module.exports = { ALLPIECES, FILE, RANK, COLOR, PIECES, KING };
