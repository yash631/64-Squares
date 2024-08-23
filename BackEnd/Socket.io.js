const PORT = 8000;
const io = require("socket.io")(PORT, {
  cors: { origin: "http://127.0.0.1:5500" },
}); // Allow connections from origin
const uuid = require("uuid");
const app = require("./app");

const isCorrectMove = require("./GameManager/checkMove/readMove");

let players = {};
let T_Ply = 0;
const Games = {};
let Total_games = Object.keys(Games).length;

io.on("connection", (socket) => {
  socket.on("join_game", (data) => {
    let { Name, userID } = data;
    players[userID] = { id: userID, Name: Name };
    T_Ply++;
    console.log(
      `A user with ID : ${userID} and Name : ${Name} logged into server`
    );
    console.log("Total Players in the server :", T_Ply);
    // console.log("Games playing right Now : ", Total_games);
    console.log("\n");

    socket.broadcast.emit("player_joined_game", Name);

    if (T_Ply % 2) {
      players[userID].Color = "White";
    } else {
      players[userID].Color = "Black";
    }

    if (T_Ply % 2 == 0 && T_Ply >= 2) {
      Total_games++;
      console.log(`${Total_games} games are currently being played`);
      const gameID = uuid.v4();
      io.emit("give_id", gameID);
      Games[gameID] = {
        Game_Players: {
          player1: Object.entries(players)[0],
          player2: Object.entries(players)[1],
        },
        TimeFormat: 10,
        Moves: [],
        Result: 0,
      };
      /*                  
                       Result Analysis  -> Series of numbers
                                  WiN
                    1)   Black won -> Result : 1 
                         White won -> Result : 2
                    2)   TimeOut -> 1 for true and 0 for false
                         Resign -> 1 for true and 0 for false
                         Checkmate -> 1 for true and 0 for false

                                  OR

                        Draw -> 0
                        Stalemate : 1 or 0
                        ThreeFold rep : 1 or 0
      */
      io.emit("createGame", {
        gameId: gameID,
        player1: Games[gameID].Game_Players.player1[1].Name,
        player2: Games[gameID].Game_Players.player2[1].Name,
      });
      console.log(Games);
      socket.emit("disable_move");
    }
    io.emit("player_count_update", T_Ply);
  });

  socket.on("new_move", (data) => {
    socket.broadcast.emit("enable_move");
    socket.emit("disable_move");
    let { gameid, move } = data;
    isCorrectMove(move,piece_color);
    Games[gameid].Moves.push(move);
    console.log("MOVES : ", Games[gameid].Moves);
    io.emit("move_made", Games[gameid].Moves);
  });

  socket.on("gameAborted", (data) => {
    let { gameId } = data;
    io.emit("Game_Aborted");
    Reflect.deleteProperty(Games,gameId);
    Total_games--;
    T_Ply -= 2;
    console.log(`The Game with id : ${gameId} aborted`);
    console.log(`-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-\n`);
    console.log(`Total Games in the server :${Total_games}`);
    console.log(` Games => ${Games}`);
  });

  socket.on("playerResigned", (data) => {
    let { userName, userID, gameId } = data;
    io.emit("Resignation", userName);
    Reflect.deleteProperty(Games,gameId);
    Total_games--;
    T_Ply -= 2;
    console.log(`Player Name "${userName}" with ID : ${userID} resigned`);
    console.log(`-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-\n`);
    console.log(`Total Games in the server :${Total_games}`);
    console.log(` Games => ${Games}`);
  });
});