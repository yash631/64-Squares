const BLACKPIECES = ["p", "n", "b", "r", "q"];
const WHITEPIECES = ["P", "N", "B", "R", "Q"];
const COLOR = {
  1 : "WHITE",
  0 : "BLACK"
}
const pieces = {
  "p" : "PAWN",
  "b" : "BISHOP",
  "r" : "ROOK",
  "n" : "KNIGHT",
  "q" : "QUEEN",
  "k" : "KING"
}
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
module.exports = {BLACKPIECES , WHITEPIECES , FILE , RANK, COLOR, pieces};