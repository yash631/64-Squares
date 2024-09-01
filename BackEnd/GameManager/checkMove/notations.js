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
  pos0: [0, 4],
  pos1: [7, 4],
};
const ROOK = {
  0: "r",
  1: "R",
  pos0: {
    q: [0, 0],
    k: [0, 7],
  },
  pos1: {
    q: [7, 0],
    k: [7, 7],
  },
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
const RTI = {
  1: 7,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
  8: 0,
};
const FTI = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};
module.exports = {
  ALLPIECES,
  FILE,
  RANK,
  COLOR,
  PIECES,
  KING,
  ROOK,
  RTI,
  FTI,
};
