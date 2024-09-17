function closeBoard(ChessBoard, position, playerColor) {
  board = ChessBoard("chessBoard", {
    draggable: false, // Disable dragging after game ends
    position: position, // Keep the current board position
    orientation: playerColor,
  });
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

function updateMovesDisplay(move) {
  const movesContainer = document.getElementById("movesContainer");

  if (!movesContainer) {
    console.error("Moves container not found!");
    return;
  }

  const moveCount = movesContainer.children.length + 1; // Get the next move number

  // Create a new move element for the latest move
  const moveElement = document.createElement("div");
  moveElement.style.padding = "10px";
  moveElement.style.border = "1px solid #ccc";
  moveElement.style.borderRadius = "5px";
  moveElement.style.backgroundColor = "#f9f9f9";
  moveElement.style.textAlign = "center";

  // Set the text for the new move
  moveElement.textContent = move;

  // Append the new move to the moves container
  movesContainer.appendChild(moveElement);
}

function showPromotionModal(socket, pawnPiece, targetSquare, gameId, moveData) {
  const modal = document.getElementById("promotionModal");
  modal.style.display = "block";

  const color = pawnPiece === "wP" ? "w" : "b";

  document.getElementById(
    "promoteQueen"
  ).src = `/FrontEnd/img/chesspieces/Maurizio_fantasy/${color}Q.png`;
  document.getElementById(
    "promoteRook"
  ).src = `/FrontEnd/img/chesspieces/Maurizio_fantasy/${color}R.png`;
  document.getElementById(
    "promoteKnight"
  ).src = `/FrontEnd/img/chesspieces/Maurizio_fantasy/${color}N.png`;
  document.getElementById(
    "promoteBishop"
  ).src = `/FrontEnd/img/chesspieces/Maurizio_fantasy/${color}B.png`;

  const promotionButtons = {
    promoteQueen: "Q",
    promoteRook: "R",
    promoteBishop: "B",
    promoteKnight: "N",
  };

  Object.keys(promotionButtons).forEach((btnId) => {
    document.getElementById(btnId).onclick = function () {
      const promotionPiece = promotionButtons[btnId];
      modal.style.display = "none";

      // Emit the move with the selected promotion piece
      socket.emit("new_move", {
        gameid: gameId,
        move: moveData,
        promotionPiece: promotionPiece,
      });
    };
  });
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
