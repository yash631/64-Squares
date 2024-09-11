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

function isCheckmate() {
  return false;
}

function isDraw() {
  return false; 
}
