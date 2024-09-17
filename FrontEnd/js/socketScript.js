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
  let isGameEnd = false;

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
    /* Disable Player turn to prevent any accidental moves till any piece for promotion is selected */
    isPlayerTurn = false;

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

  function handleMove(
    source,
    target,
    piece,
    newPosition,
    oldPosition,
    orientation
  ) {
    if (!isPlayerTurn || isGameEnd) {
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

      /* Return snapback to prevent displaying the pawn on promotional square */
      return "snapback";
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

    socket.emit("new_move", {
      gameid: gameId,
      move: moveData,
      promotionPiece: undefined,
    });

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
    isGameEnd = true;
  });

  socket.on("stalemate", (data) => {
    const { move } = data;

    const currentPosition = board.position();
    alert("Stalemate");
    closeBoard(board, currentPosition);
    isGameEnd = true;
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
