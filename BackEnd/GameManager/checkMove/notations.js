const ALLPIECES = {
  1: ["P", "N", "B", "R", "Q"],
  0: ["p", "n", "b", "r", "q"],
};
const COLOR = {
  1: "WHITE",
  0: "BLACK",
  white: 1,
  black: 0,
};
const PIECES = {
  p: "PAWN",
  b: "BISHOP",
  r: "ROOK",
  n: "KNIGHT",
  q: "QUEEN",
  k: "KING",
};
const SYMBOLS = {
  wP: "p",
  bP: "p",
  wR: "r",
  bR: "r",
  wB: "b",
  bB: "b",
  wN: "n",
  bN: "n",
  wQ: "q",
  bQ: "q",
  wK: "k",
  bK: "k",
};
const COLORPCS = {
  wP: "P",
  bP: "p",
  wR: "R",
  bR: "r",
  wB: "B",
  bB: "b",
  wN: "N",
  bN: "n",
  wQ: "Q",
  bQ: "q",
  wK: "K",
  bK: "k",
}
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
const DIRECTIONS = [
  { dir: "LDU", move: [-1, -1] }, // left diagonal up
  { dir: "LDD", move: [1, 1] }, // left diagonal down
  { dir: "RDU", move: [-1, 1] }, // right diagonal up
  { dir: "RDD", move: [1, -1] }, // right diagonal down
  { dir: "FU", move: [-1, 0] }, // file up
  { dir: "FD", move: [1, 0] }, // file down
  { dir: "RL", move: [0, -1] }, // rank left
  { dir: "RR", move: [0, 1] }, // rank right
];
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
function isSameDirection(square1, square2) {
  /* const fileToNumber = (file) => file.charCodeAt(0) - 'a'.charCodeAt(0) + 1; */

  const [file1, rank1] = [FTI[square1[0]], parseInt(square1[1])];
  const [file2, rank2] = [FTI[square2[0]], parseInt(square2[1])];

  const sameRank = rank1 === rank2;
  const sameFile = file1 === file2;
  const sameDiagonal = Math.abs(file1 - file2) === Math.abs(rank1 - rank2);

  return sameRank || sameFile || sameDiagonal;
}

module.exports = {
  ALLPIECES,
  FILE,
  RANK,
  COLOR,
  PIECES,
  SYMBOLS,
  COLORPCS,
  KING,
  ROOK,
  RTI,
  FTI,
  DIRECTIONS,
  isSameDirection,
};
