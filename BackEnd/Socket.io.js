const PORT = 8000;
const io = require("socket.io")(PORT, {
  cors: { origin: "http://127.0.0.1:5500" },
}); // Allow connections from origin
const uuid = require("uuid");
const express = require("express");
const app = express();
app.use(express.static("FrontEnd"));

const isCorrectMove = require("./GameManager/checkMove/readMove");
const not = require("./GameManager/checkMove/notations");

let players = {}; // Store all players
let T_Ply = 0; // Track the number of players
const Games = {}; // Store all games
let Total_games = Object.keys(Games).length;

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("joinGame", (data) => {
    let { Name, userID } = data;
    players[userID] = { id: userID, Name: Name };
    T_Ply++;
    console.log(
      `A user with ID: ${userID} and Name: ${Name} joined the server.`
    );
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
      Total_games++;
      console.log(`${Total_games} games are currently being played`);

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

      console.log(Games);
    }

    io.emit("player_count_update", T_Ply); // Update all clients with player count
  });

  // Handle moves from the client
  socket.on("new_move", async (data) => {
    const { move, gameid } = data;
    const piece_color = move.playerColor;
    console.log("color :- ", piece_color);
  
    try {
      const isValid = await isCorrectMove.checkValidity(move, piece_color); // Await the result
  
      if (isValid) {
        console.log(`${move.piece} from ${move.source} to ${move.target}`);
        Games[gameid].Moves.push(move);
        io.emit("move_made", { gameid, move }); // Notify all players of the valid move
      } else {
        console.log("Invalid move");
        socket.emit("invalid_move", { move }); // Notify the client that the move was invalid
      }
    } catch (error) {
      console.error("Error in move validation:", error);
    }
  });
  
  

  // Handle game abortion
  socket.on("gameAborted", (data) => {
    const { gameId } = data;
    io.emit("Game_Aborted");
    Reflect.deleteProperty(Games, gameId);
    Total_games--;
    T_Ply -= 2;
    console.log(`The game with id: ${gameId} was aborted.`);
    console.log(`Total Games in the server: ${Total_games}`);
  });

  // Handle player resignation
  socket.on("playerResigned", (data) => {
    const { userName, userID, gameId } = data;
    io.emit("Resignation", userName);
    Reflect.deleteProperty(Games, gameId);
    Total_games--;
    T_Ply -= 2;
    console.log(`Player "${userName}" with ID: ${userID} resigned.`);
    console.log(`Total Games in the server: ${Total_games}`);
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    // Remove player and decrement player count
    delete players[socket.id];
  });
});
