const PORT = 8000;
const io = require("socket.io")(PORT, {
  cors: { origin: "http://127.0.0.1:5500" },
});
const uuid = require("uuid");
const express = require("express");
const app = express();
app.use(express.static("FrontEnd"));

const isCorrectMove = require("./GameManager/checkMove/readMove");

let players = {}; // Store all players
let T_Ply = 0; // Track the number of players
const Games = {}; // Store all games

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("joinGame", (data) => {
    let { Name, userID } = data;
    players[userID] = { id: userID, Name: Name };
    T_Ply++;
    /* console.log(
      `A user with ID: ${userID} and Name: ${Name} joined the server.`
    ); */
    console.log("Total Players in the server:", T_Ply);

    socket.broadcast.emit("player_joined_game", Name);

    // Assign color based on player number (odd: White, even: Black)
    if (T_Ply % 2 === 1) {
      players[userID].Color = "white"; // Odd player gets white
    } else {
      players[userID].Color = "black"; // Even player gets black
    }

    // If two players have joined, start a new game
    if (T_Ply % 2 === 0 && T_Ply >= 2) {
      const gameID = uuid.v4(); // Generate a new game ID

      // Get the last two players to start the game
      const playerKeys = Object.keys(players);
      const player1 = players[playerKeys[playerKeys.length - 2]]; // The first player (white)
      const player2 = players[playerKeys[playerKeys.length - 1]]; // The second player (black)

      // Create the new game
      Games[gameID] = {
        Game_Players: {
          player1: player1,
          player2: player2,
        },
        TimeFormat: 10,
        Moves: [],
        Result: 0,
      };

      // Emit the game ID and player information to both players
      io.to(player1.id).emit("gameID", {
        gameId: gameID,
        playerColor: player1.Color, // Send white to player1
      });

      io.to(player2.id).emit("gameID", {
        gameId: gameID,
        playerColor: player2.Color, // Send black to player2
      });

      // Join game room
      io.sockets.sockets.get(player1.id).join(gameID);
      io.sockets.sockets.get(player2.id).join(gameID);

      console.log(Games);
    }

    io.emit("player_count_update", T_Ply); // Update all clients with player count
  });

  // Handle moves from the client
  socket.on("new_move", async (data) => {
    const { move, gameid, promotionPiece } = data;
    const pcsColor = move.playerColor;

    try {
      const isValid = await isCorrectMove.checkValidity(
        move,
        pcsColor,
        promotionPiece
      );

      /* Return game status if any accidental move is made after the game has ended */
      if (isValid.status === "gameEnd") {
        io.to(gameid).emit("Game Status", { message: isValid.message });
      }
      /* console.log("Move Validity Result : ", isValid); */

      if (isValid) {
        const result = isValid.result;
        const finalMove = isValid.finalMove;
        Games[gameid].Moves.push(move);
        let totalMoves = Games[gameid].Moves.length;

        if (finalMove === "O-O" || finalMove === "O-O+") {
          io.to(gameid).emit("castlingMove", {
            movemade: finalMove,
            side: "king-side",
            color: pcsColor,
            move: move,
            totalMoves: totalMoves,
          });
        } else if (finalMove === "O-O-O" || finalMove === "O-O-O+") {
          io.to(gameid).emit("castlingMove", {
            movemade: finalMove,
            side: "queen-side",
            color: pcsColor,
            move: move,
            totalMoves: totalMoves,
          });
        } else if (finalMove.includes("ep")) {
          const enPawn = isValid.enPassantCapturePawn;
          /* console.log("enPassantPawnSquare : ", enPawn); */
          io.to(gameid).emit("enPassant", {
            movemade: finalMove,
            color: pcsColor,
            captureSquare: enPawn,
            move: move,
            totalMoves: totalMoves,
          });
        } else if (finalMove.includes("=")) {
          const promSq = isValid.promotionSquare;
          const promPc = isValid.promotionPiece;
          /* console.log("Promotion Square & Promotion Piece : ", promSq, promPc); */
          io.to(gameid).emit("promotion", {
            movemade: finalMove,
            color: pcsColor,
            promotionSquare: promSq,
            promotionPiece: promPc,
            move: move,
            totalMoves: totalMoves,
          });
        } else {
          io.to(gameid).emit("move_made", {
            movemade: finalMove,
            gameid: gameid,
            move: move,
            totalMoves: totalMoves,
          }); // Notify all players of the valid move
        }

        /* Check if the game ends in a stalemate or checkmate  */
        if (result[0] == "1") {
          setTimeout(() => {
            // Add a short delay before emitting checkmate or stalemate alert
            if (result[1] == "/" && result[2] == "2") {
              // Stalemate
              io.to(gameid).emit("stalemate", { move: move });
            } else {
              // Checkmate
              io.to(gameid).emit("checkmate", {
                won: result[1],
                lost: result[2],
                gameid: gameid,
                move: move,
              });
            }
          }, 300); // Delay for 500ms (you can adjust this value)
        }
      } else {
        socket.emit("invalid_move", { move }); // Notify the client that the move was invalid
        console.log("Invalid move");
      }
    } catch (error) {
      console.error("Error in move validation:", error);
    }
  });

  // Handle game abortion
  socket.on("gameAborted", (data) => {
    const { abortUserID, abortPlayerName, gameId, color } = data;

    io.to(gameId).emit("Game_Aborted");
    delete Games[gameId];
    console.log(
      `The game ID: ${gameId} was aborted by ${abortPlayerName} ID: ${abortUserID}.`
    );
    console.log(`Total Games in the server: ${Object.keys(Games).length}`);
  });

  // Handle player resignation
  socket.on("playerResigned", (data) => {
    const { resignUserID, resignPlayerName, gameId, color } = data;

    io.to(gameId).emit("Resignation", { color: color });
    delete Games[gameId];
    console.log(
      `Player "${resignPlayerName}" ID: ${resignUserID} resigned the game ID: ${gameId}`
    );
    console.log(`Total Games in the server: ${Object.keys(Games).length}`);
  });

  // Handle Draw offer
  socket.on("offerDraw", (data) => {
    const { drawUserID, drawPlayerName, gameId } = data;
    /* console.log("Offered Draw:", data); */

    socket.broadcast.to(gameId).emit("drawOffer", {
      drawPlayerName: drawPlayerName,
      gameId: gameId,
    });
  });

  // Handle Draw response
  socket.on("drawResponse", (response) => {
    /* console.log("Draw Response : ", response); */

    if (response.accepted) {
      io.to(response.gameId).emit("drawAccepted", {
        message: "Draw by Agreement",
      });
    } else {
      socket.broadcast.to(response.gameId).emit("drawRejected", {
        message: "Draw offer was rejected",
      });
    }
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    // Remove player and decrement player count
    delete players[socket.id];
  });
});
