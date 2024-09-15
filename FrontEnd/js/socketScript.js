$(document).ready(function () {
  let board = ChessBoard("chessBoard", {
    draggable: false,
    position: "start",
    orientation: "white",
    onDrop: handleMove,
  });

  const socket = io.connect("http://localhost:8000/");

  let userId;
  let gameId;
  let playerName = document.getElementById("playerName");
  let joinGame = document.getElementById("joinGame");
  let playerColor;
  let isPlayerTurn = false;

  socket.on("connect", () => {
    userId = socket.id;
    console.log("Your ID:", userId);
  });

  socket.on("player_joined_game", (name) => {
    console.log(name, "joined the game");
  });

  playerName.addEventListener("input", () => {
    ply_name = playerName.value;
    joinGame.disabled = ply_name === "";
  });

  joinGame.addEventListener("click", () => {
    if (socket.connected) {
      playerName.disabled = true;
      joinGame.disabled = true;
      playerName.style.backgroundColor = "lightgray";
      joinGame.style.backgroundColor = "lightgray";
      socket.emit("joinGame", { userID: userId, Name: playerName.value });
    }
  });

  function showPromotionModal(pawnPiece, targetSquare, moveData) {
    const modal = document.getElementById("promotionModal");
    modal.style.display = "block";

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

        // Complete the promotion
        socket.emit("new_move", {
          gameid: gameId,
          move: moveData,
          promotionPiece: promotionPiece,
        });

        // Disable player's turn until server confirms
        isPlayerTurn = false;
      };
    });
  }

  function handleMove(
    source,
    target,
    piece,
    newPosition,
    oldPosition,
    orientation
  ) {
    if (!isPlayerTurn) {
      return "snapback";
    }

    const isWhitePiece = piece[0] === "w";
    const isBlackPiece = piece[0] === "b";

    if (
      (playerColor === "white" && !isWhitePiece) ||
      (playerColor === "black" && !isBlackPiece)
    ) {
      return "snapback";
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

    // Check if the target square is valid
    if (!validSquares.includes(target)) {
      return "snapback"; // If the target is off the board, snap the piece back
    }

    const moveData = {
      playerColor,
      source,
      target,
      piece,
      newPosition,
      oldPosition,
      userId,
      gameId,
    };

    const promotionRank = playerColor === "white" ? "8" : "1";
    if (
      (piece === "wP" && target[1] === promotionRank) ||
      (piece === "bP" && target[1] === promotionRank)
    ) {
      showPromotionModal(piece, target, moveData);
      return;
    }

    // Disable dragging after making a move
    board.draggable = false;

    // Get current board state
    let currentBoardState = board.fen();
    const isValid = validateMove(source, target, piece, board);

    // Handle invalid move
    if (!isValid) {
      return "snapback";
    }

    socket.emit("new_move", { gameid: gameId, move: moveData });

    // Disable player's turn temporarily after making a move
    isPlayerTurn = false;

    socket.on("invalid_move", (data) => {
      board.position(currentBoardState);
      isPlayerTurn = true;
      board.draggable = true; // Re-enable dragging
    });

    socket.on("valid_move", (data) => {
      isPlayerTurn = false;
      board.draggable = true; // Re-enable dragging after valid move
    });
  }

  // Listen for a move made by the opponent
  socket.on("move_made", (data) => {
    const { gameid, move } = data;
    makeMove(board, move.source, move.target);

    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
      board.draggable = true; // Enable dragging when it's player's turn
    }
  });

  socket.on("castlingMove", (data) => {
    const { side, color, move } = data;
    if (side === "king-side") {
      if (color === "white") {
        makeMove(board, "e1", "g1");
        makeMove(board, "h1", "f1");
      } else if (color === "black") {
        makeMove(board, "e8", "g8");
        makeMove(board, "h8", "f8");
      }
    } else if (side === "queen-side") {
      if (color === "white") {
        makeMove(board, "e1", "c1");
        makeMove(board, "a1", "d1");
      } else if (color === "black") {
        makeMove(board, "e8", "c8");
        makeMove(board, "a8", "d8");
      }
    }
    console.log(playerColor, move.piece[0]);
    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
    }
  });

  socket.on("enPassant", (data) => {
    const { color, captureSquare, move } = data;

    makeMove(board, move.source, move.target);
    const currentPosition = board.position(); // Get the current position as an object

    // Assuming en passant occurs from e5 to d6, and we need to remove the black pawn on e5
    delete currentPosition[captureSquare]; // Remove the captured pawn from its square

    // Now set the updated position back to the board
    board.position(currentPosition);

    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
    }
  });

  socket.on("promotion", (data) => {
    const { color, promotionSquare, promotionPiece, move } = data;
    let promPc = promotionPiece;
    promPc = promPc.toUpperCase();
    if (color == "white") {
      promPc = "w" + promPc;
    } else {
      promPc = "b" + promPc;
    }

    makeMove(board, move.source, move.target);
    const currentPosition = board.position();

    currentPosition[promotionSquare] = promPc;

    board.position(currentPosition);
    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
    }
  });

  socket.on("checkmate", (data) => {
    const { won, lost, gameid, move } = data;
    makeMove(board, move.source, move.target);

    const currentPosition = board.position();
    let winner;
    let loser;

    if (won === "1") {
      winner = "White";
      loser = "Black";
    } else if (won === "0") {
      winner = "Black";
      loser = "White";
    }
    alert(`${winner} won by Checkmate`);
    closeBoard(board, currentPosition);
  });

  socket.on("stalemate", (data) => {
    const {move} = data;
    makeMove(board, move.source, move.target);

    const currentPosition = board.position();
    alert("Stalemate");
    closeBoard(board, currentPosition);
  });

  socket.on("Game_Aborted", () => {
    alert("The game has been aborted.");
    board.position("start");
  });

  socket.on("Resignation", (userName) => {
    alert(`${userName} has resigned.`);
    board.position("start");
  });

  socket.on("player_count_update", (playerCount) => {
    Players = playerCount;
    console.log("Players in the lobby: ", Players);
    if (Players % 2 === 0 && Players >= 2) {
      joinGame.innerText = "Match started";
    }
  });

  socket.on("gameID", (data) => {
    gameId = data.gameId;
    playerColor = data.playerColor;
    console.log("Game ID received:", gameId);
    console.log("Player Color:", playerColor);

    isPlayerTurn = playerColor === "white";

    board.destroy();
    board = ChessBoard("chessBoard", {
      draggable: true,
      position: "start",
      orientation: playerColor,
      onDrop: handleMove,
    });
  });
});