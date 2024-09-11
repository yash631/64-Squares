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

    // Get current board state
    let currentBoardState = board.fen();
    console.log("Current Board State after move:", currentBoardState);
    const isValid = validateMove(source, target, piece, board);

    // Handle invalid move
    if (!isValid) {
      return "snapback";
    }

    // Assuming you have a reference to your chessboard instance, e.g., 'board'
    socket.on("invalid_move", (data) => {
      board.position(currentBoardState);
      isPlayerTurn = true;
    });

    // Emit the move to the server
    socket.emit("new_move", { gameid: gameId, move: moveData });

    // Switch turns after making a move
    isPlayerTurn = false;

    // Check for game end conditions
    /*if (isCheckmate()) {
      alert("Checkmate!");
      board.position("start");
    } else if (isDraw()) {
      alert("Draw!");
      board.position("start");
    }*/
  }

  // Listen for a move made by the opponent
  socket.on("move_made", (data) => {
    const { gameid, move } = data;

    // Make the move
    makeMove(board, move.source, move.target);

    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
    }
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
