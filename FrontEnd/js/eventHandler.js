$(document).ready(function () {
  // Initialize the chessboard
  let board = ChessBoard("chessBoard", {
    draggable: false,
    position: "start",
    orientation: "white",
    onDrop: handleMove,
  });

  // Connect to the socket server
  const socket = io.connect("http://localhost:8000/");

  let userId;
  let gameId;
  let playerName = document.getElementById("playerName");
  let joinGame = document.getElementById("joinGame");
  let abortOrResign = document.getElementById("abortResignGame");
  let draw = document.getElementById("drawGame");
  const modal = document.getElementById("drawModal");
  const acceptButton = document.getElementById("acceptDraw");
  const rejectButton = document.getElementById("rejectDraw");
  const closeButton = document.getElementsByClassName("close")[0];
  const drawMessage = document.getElementById("drawMessage");

  let playerColor;
  let isPlayerTurn = false;
  let isGameEnd = false;

  // Handle socket connection
  socket.on("connect", () => {
    userId = socket.id;
    console.log("Your ID:", userId);
  });

  // Handle a new player joining the game
  socket.on("player_joined_game", (name) => {
    console.log(name, "joined the game");
  });

  // Enable/disable the join game button based on player name input
  playerName.addEventListener("input", () => {
    ply_name = playerName.value;
    joinGame.disabled = ply_name === "";
  });

  // Handle join game button click
  joinGame.addEventListener("click", () => {
    if (!socket.disconnected) {
      // Check if socket is connected
      playerName.disabled = true;
      joinGame.disabled = true;
      joinGame.style.backgroundColor = "lightgray";
      socket.emit("joinGame", { userID: userId, Name: playerName.value });
    } else {
      console.log("Socket is not connected. Cannot join game.");
    }
  });

  abortOrResign.addEventListener("click", () => {
    if (!socket.disconnected) {
      if (abortOrResign.innerText === "Abort Game") {
        socket.emit("gameAborted", {
          abortUserID: userId,
          abortPlayerName: playerName.value,
          gameId: gameId,
          color: playerColor,
        });
      } else if (abortOrResign.innerText === "Resign") {
        socket.emit("playerResigned", {
          resignUserID: userId,
          resignPlayerName: playerName.value,
          gameId: gameId,
          color: playerColor,
        });
      }
    } else {
      console.log("Socket is not connected.");
    }
  });

  draw.addEventListener("click", () => {
    if (!socket.disconnected) {
      abortOrResign.disabled = true;
      draw.disabled = true;

      socket.emit("offerDraw", {
        drawUserID: userId,
        drawPlayerName: playerName.value,
        gameId: gameId,
        color: playerColor,
      });
    } else {
      console.log("Socket is not connected. Cannot offer draw.");
    }
  });

  function disableButtons() {
    abortOrResign.disabled = true;
    draw.disabled = true;
  }

  function updateButtons() {
    abortOrResign.innerText = "Resign";
    draw.style.display = "block";
  }

  function showDrawModal(message, onAccept, onReject) {
    drawMessage.textContent = message;
    modal.style.display = "block";

    acceptButton.onclick = function () {
      modal.style.display = "none";
      if (onAccept) onAccept();
    };

    rejectButton.onclick = function () {
      modal.style.display = "none";
      if (onReject) onReject();
    };

    closeButton.onclick = function () {
      modal.style.display = "none";
      if (onReject) onReject();
    };

    // Click outside the modal to close
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
        if (onReject) onReject();
      }
    };
  }

  // Handle moves on the chessboard
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
      /* Disable Player turn to prevent any accidental moves till any piece for promotion is selected */
      isPlayerTurn = false;
      showPromotionModal(socket, piece, target, gameId, moveData);

      // Prevent displaying the pawn on the promotional square
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
    const { movemade, gameid, move, totalMoves } = data;
    makeMove(board, move.source, move.target);
    updateMovesDisplay(movemade);

    if (totalMoves >= 2) {
      updateButtons();
    }

    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
      board.draggable = true; // Enable dragging when it's player's turn
    }
  });

  // Handle castling moves
  socket.on("castlingMove", (data) => {
    const { movemade, side, color, move, totalMoves } = data;
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
    updateMovesDisplay(movemade);

    if (totalMoves >= 2) {
      updateButtons();
    }
    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
    }
  });

  // Handle en passant moves
  socket.on("enPassant", (data) => {
    const { movemade, color, captureSquare, move, totalMoves } = data;

    makeMove(board, move.source, move.target);
    updateMovesDisplay(movemade);

    if (totalMoves >= 2) {
      updateButtons();
    }

    const currentPosition = board.position(); // Get the current position as an object

    // Remove the captured pawn from its square
    delete currentPosition[captureSquare];

    // Set the updated position back to the board
    board.position(currentPosition);

    // Enable player's turn after the opponent makes a move
    if (
      (playerColor === "white" && move.piece[0] === "b") ||
      (playerColor === "black" && move.piece[0] === "w")
    ) {
      isPlayerTurn = true;
    }
  });

  // Handle promotion moves
  socket.on("promotion", (data) => {
    const {
      movemade,
      color,
      promotionSquare,
      promotionPiece,
      move,
      totalMoves,
    } = data;
    let promPc = promotionPiece.toUpperCase();

    if (color === "white") {
      promPc = "w" + promPc;
    } else {
      promPc = "b" + promPc;
    }

    makeMove(board, move.source, move.target);
    updateMovesDisplay(movemade);

    if (totalMoves >= 2) {
      updateButtons();
    }

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

  // Handle checkmate
  socket.on("checkmate", (data) => {
    disableButtons();

    const { won, lost, gameid, move } = data;
    const currentPosition = board.position();
    let winner = won === "1" ? "white" : "black";
    winner = winner.toUpperCase();

    alert(`${winner} won by Checkmate`);
    closeBoard(ChessBoard, currentPosition, playerColor);

    isGameEnd = true;
  });

  // Handle stalemate
  socket.on("stalemate", (data) => {
    disableButtons();

    const { move } = data;
    const currentPosition = board.position();

    closeBoard(ChessBoard, currentPosition, playerColor);
    alert("Stalemate");

    isGameEnd = true;
  });

  // Handle game abortion
  socket.on("Game_Aborted", () => {
    disableButtons();

    const currentPosition = board.position();

    alert("The game was Aborted");
    closeBoard(ChessBoard, currentPosition, playerColor);

    isGameEnd = true;
  });

  // Handle player resignation
  socket.on("Resignation", (data) => {
    disableButtons();

    const { color } = data;
    loser = color.toUpperCase();

    const currentPosition = board.position();
    let winner = loser === "WHITE" ? "BLACK" : "WHITE"; // color who lost by resignation

    alert(`${loser} Resigned! ${winner} Won`);
    closeBoard(ChessBoard, currentPosition, playerColor);

    isGameEnd = true;
  });

  socket.on("drawOffer", (data) => {
    const { drawPlayerName, gameId } = data;
    showDrawModal(
      `${drawPlayerName} has offered a draw. Do you accept?`,
      () => {
        socket.emit("drawResponse", { accepted: true, gameId: gameId });
        disableButtons();
        closeBoard(ChessBoard, currentPosition, playerColor);
      },
      () => {
        socket.emit("drawResponse", { accepted: false, gameId: gameId });
      }
    );
  });

  socket.on("drawAccepted", (data) => {
    console.log("Draw accepted : ", data);
    const currentPosition = board.position();

    alert(data.message);
    closeBoard(ChessBoard, currentPosition, playerColor);

    isGameEnd = true;
  });

  socket.on("drawRejected", (data) => {
    console.log("Draw rejected : ", data);

    alert(data.message); 
    abortOrResign.disabled = false;
    draw.disabled = false; 
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

    abortOrResign.style.display = "block";

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
