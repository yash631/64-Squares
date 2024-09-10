$(document).ready(function() {
  let board = ChessBoard("chessBoard", {
    draggable: false,
    position: "start",
    orientation: "white",
    onDrop: handleMove
  });

  const socket = io.connect("http://localhost:8000/");

  let userId;
  let gameId;
  let playerName = document.getElementById("playerName");
  let joinGame = document.getElementById("joinGame");
  let playerColor;

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

  function handleMove(source, target, piece, newPosition, oldPosition, orientation) {
    const isWhitePiece = piece[0] === "w";
    const isBlackPiece = piece[0] === "b";

    if ((playerColor === "white" && !isWhitePiece) || (playerColor === "black" && !isBlackPiece)) {
      return "snapback";
    }

    const moveData = { source, target, piece, userId, gameId };

    const isValid = validateMove(source, target, piece);

    if (!isValid) {
      return "snapback";
    }

    makeMove(source, target);

    socket.emit("new_move", { gameid: gameId, move: moveData });

    if (isCheckmate()) {
      alert("Checkmate!");
      board.position("start");
    } else if (isDraw()) {
      alert("Draw!");
      board.position("start");
    }
  }

  socket.on("move_made", (data) => {
    const { gameid, move } = data;
    board.move(move.source + "-" + move.target);
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

    board.destroy();
    board = ChessBoard("chessBoard", {
      draggable: true,
      position: "start",
      orientation: playerColor,
      onDrop: handleMove
    });
  });
});