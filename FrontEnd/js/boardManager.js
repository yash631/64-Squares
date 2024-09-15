function closeBoard(board, position) {
  board.position(position);
  board.draggable = false;
}

function validateMove(source, target, piece, board) {
  const targetPiece = board.position()[target];
  if (!targetPiece) {
    return true;
  }
  const isSourceWhite = piece[0] === "w";
  const isTargetWhite = targetPiece[0] === "w";
  console.log(
    "Is source white:",
    isSourceWhite,
    "Is target white:",
    isTargetWhite
  );

  if (isSourceWhite === isTargetWhite) {
    return false;
  }
  return true;
}

function checkBoard(board) {
  const fen = board.fen();
  const position = board.position();
  console.log("Current board pieces and their positions:");

  for (const square in position) {
    console.log(`${square}: ${position[square]}`);
  }
}

function makeMove(board, source, target) {
  board.move(source + "-" + target);
}

const validSquares = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "d1",
  "d2",
  "d3",
  "d4",
  "d5",
  "d6",
  "d7",
  "d8",
  "e1",
  "e2",
  "e3",
  "e4",
  "e5",
  "e6",
  "e7",
  "e8",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "g1",
  "g2",
  "g3",
  "g4",
  "g5",
  "g6",
  "g7",
  "g8",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "h7",
  "h8",
];
