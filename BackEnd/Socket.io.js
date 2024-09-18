const PORT = 8000;
const io = require("socket.io")(PORT, {
  cors: { origin: "http://127.0.0.1:5500" },
});
const uuid = require("uuid");
const express = require("express");
const app = express();
app.use(express.static("FrontEnd"));

const isCorrectMove = require("./GameManager/checkMove/readMove");
const getBoard = require("./GameManager/Board/createBoard");

let players = {}; // Store all players
let T_Ply = 0; // Track the number of players
const Games = {}; // Store all games

function showGame(gameId) {
  const board = getBoard.getCurrentBoard(gameId);
  console.log(`CURRENT BOARD STATE WITH ID: ${gameId}`);
  console.log("MOVES : ", getBoard.getGameState(gameId));
  getBoard.showBoard(board);
}

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

    players[userID].Color = T_Ply % 2 === 1 ? "white" : "black";

    /* start a new game if two players are idle or have joined */
    if (T_Ply % 2 === 0 && T_Ply >= 2) {
      const gameID = uuid.v4(); // Generate a new game ID

      const playerKeys = Object.keys(players);
      const player1 = players[playerKeys[playerKeys.length - 2]]; // The first player (white)
      const player2 = players[playerKeys[playerKeys.length - 1]]; // The second player (black)

      /* Initialize a new board for this game */
      const newBoard = getBoard.createNewGame(gameID).Board;

      /* Append a new game in Games Object */
      Games[gameID] = {
        Game_Players: {
          player1: player1,
          player2: player2,
        },
        Board: newBoard,
        TimeFormat: 10,
        Moves: [],
        Result: 0,
      };

      /* Emit the game ID and player information to both players */
      io.to(player1.id).emit("gameID", {
        gameId: gameID,
        playerColor: player1.Color,
      });

      io.to(player2.id).emit("gameID", {
        gameId: gameID,
        playerColor: player2.Color,
      });

      /* Join game room */
      io.sockets.sockets.get(player1.id).join(gameID);
      io.sockets.sockets.get(player2.id).join(gameID);

      console.log(Games);
    }

    io.emit("player_count_update", T_Ply);
  });

  socket.on("new_move", async (data) => {
    const { move, gameid, promotionPiece } = data;
    const pcsColor = move.playerColor;

    try {
      const isValid = await isCorrectMove.checkValidity(
        move,
        pcsColor,
        promotionPiece,
        gameid
      );

      /* Return game status if any accidental move is made after the game has ended */
      if (isValid.status === "gameEnd") {
        io.to(gameid).emit("Game Status", { message: isValid.message });
      }
      /* console.log("Move Validity Result : ", isValid); */

      if (isValid) {
        /* Update the board of each game in the Games object */
        Games[gameid].Board = getBoard.getCurrentBoard(gameid);

        /* Look current state of a game with gameid */
        showGame(gameid);

        /* Get current Game Object */
        const gameObj = getBoard.getSingleGameObject(gameid);
        /* console.log("Game Object with id :",gameid,"\n",gameObj); */

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
          });
        }

        /* Check if the game ends in a stalemate or checkmate  */
        if (result[0] == "1") {
          setTimeout(() => {
            /* Add a short delay before emitting checkmate or stalemate alert */
            if (result[1] == "/" && result[2] == "2") {
              /* Stalemate */
              io.to(gameid).emit("stalemate", { move: move });
            } else {
              /* Checkmate */
              io.to(gameid).emit("checkmate", {
                won: result[1],
                lost: result[2],
                gameid: gameid,
                move: move,
              });
            }
          }, 300); // 300ms
        }
      } else {
        socket.emit("invalid_move", { move });
        console.log("Invalid move");
      }
    } catch (error) {
      console.error("Error in move validation:", error);
    }
  });

  socket.on("gameAborted", (data) => {
    const { abortUserID, abortPlayerName, gameId, color } = data;

    io.to(gameId).emit("Game_Aborted");
    delete Games[gameId];
    console.log(
      `The game ID: ${gameId} was aborted by ${abortPlayerName} ID: ${abortUserID}.`
    );
    console.log(`Total Games in the server: ${Object.keys(Games).length}`);
  });

  socket.on("playerResigned", (data) => {
    const { resignUserID, resignPlayerName, gameId, color } = data;

    io.to(gameId).emit("Resignation", { color: color });
    delete Games[gameId];
    console.log(
      `Player ${resignPlayerName} ID: ${resignUserID} resigned the game ID: ${gameId}`
    );
    console.log(`Total Games in the server: ${Object.keys(Games).length}`);
  });

  socket.on("offerDraw", (data) => {
    const { drawUserID, drawPlayerName, gameId } = data;

    socket.broadcast.to(gameId).emit("drawOffer", {
      drawPlayerName: drawPlayerName,
      gameId: gameId,
    });
  });

  socket.on("drawResponse", (response) => {
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

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
  });
});
