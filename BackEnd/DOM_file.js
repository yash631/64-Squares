const socket = io.connect("http://localhost:8000/"); // Connect to Socket.IO server
let makeMoveButton = document.getElementById("makeMoveButton");
let inputElement = document.getElementById("inp1");
let outputElement = document.getElementById("output");
let leaveGame = document.getElementById("leaveGame");
const formContainer = document.getElementById("formContainer");

let Players = 0;

let playGame = document.getElementById("playGame");
let playerName = document.getElementById("playerName");
let joinGame = document.getElementById("joinGame");
let cancelMatch = document.getElementById("cancelMatch");

let userId; // Store the user ID
let gmid; // Store the game ID

socket.on("connect", () => {
  console.log("Connected to server!");
  userId = socket.id; // Capture the emitted socket.id
  console.log("Your id :", userId);
});

socket.on("player_joined_game", (name) => {
  console.log(name, "joined the game");
});

socket.on("give_id", (id) => {
  gmid = id;
  console.log("gameid -> ", gmid);
});
socket.on("createGame", (Game) => {
  let { gameId, player1, player2 } = Game;
  console.log("game -> ", Game);
  console.log("Game id :", gameId);
});

socket.on("disable_move", () => {
  disableInput();
});
socket.on("enable_move", () => {
  makeMoveButton.innerText = "Set Move";
  enableInput();
});

socket.on("move_made", (gameState) => {
  console.log("Moves ==> ", gameState);
  if (gameState.length > 2) {
    leaveGame.innerText = "Resign";
  }
  outputElement.textContent = gameState;
});

socket.on("Game_Aborted", () => {
  alert("Game Aborted");
  playGame.disabled = false; // enable to start a game
  leaveGame.disabled = true; // disable abort button
  makeMoveButton.textContent = "Set Move";
  joinGame.innerText = "Join the game";
  disableInput();
  playGame.style.backgroundColor = "rgb(110, 212, 110)";
  console.log("Game aborted");
});

socket.on("Resignation", (ply_Name) => {
  alert(ply_Name + " Resigned");
  playGame.disabled = false; // enable to start a game
  leaveGame.disabled = true; // disbale resign button
  makeMoveButton.textContent = "Set Move";
  leaveGame.innerText = "Abort Game";
  joinGame.innerText = "Join the game";
  disableInput();
  playGame.style.backgroundColor = "rgb(110, 212, 110)";
  console.log("Game Ended");
});

socket.on("player_count_update", (playerCount) => {
  Players = playerCount;
  console.log("Players in the lobby : ", Players);
  if (Players % 2 == 0 && Players >= 2) {
    joinGame.innerText = "Match started";
    formContainer.style.display = "block";
    leaveGame.style.backgroundColor = "red";
  }
});

function enableInput() {
  inputElement.disabled = false;
  inputElement.style.backgroundColor = "white";
}
function disableInput() {
  inputElement.disabled = true;
  inputElement.style.backgroundColor = "lightgray";
}
function clearInput() {
  inputElement.value = "";
}

function makeText() {
  makeMoveButton.textContent = "Set Move";
}
function madeText() {
  makeMoveButton.textContent = "Move Made";
}

let move;
inputElement.addEventListener("input", () => {
  move = inputElement.value;
  if (move !== "") {
    makeMoveButton.disabled = false;
  } else {
    makeMoveButton.disabled = true;
  }
});

makeMoveButton.addEventListener("click", () => {
  // Emit the move to Server
  socket.emit("new_move", { gameid: gmid, move: move });
  madeText();
  clearInput();
  makeMoveButton.disabled = true;
});

function enableName() {
  formContainer.style.display = "none";
  playerName.disabled = false;
  playerName.style.backgroundColor = "white";
}
function disableName() {
  playerName.disabled = true;
  playerName.style.backgroundColor = "lightgray";
}
function disableNewGame() {
  playGame.disabled = true;
  playGame.style.backgroundColor = "lightgray";
}

playGame.addEventListener("click", () => {
  playerName.value = "";
  enableName();
});

playerName.addEventListener("input", () => {
  ply_name = playerName.value;
  if (ply_name !== "") {
    joinGame.disabled = false;
  } else {
    joinGame.disabled = true;
  }
});

joinGame.addEventListener("click", () => {
  enableInput();
  leaveGame.disabled = false; 
  console.log(playerName.value);
  socket.emit("join_game", { userID: userId, Name: playerName.value });
  playGame.disabled = true;
  playerName.disabled = true;
  joinGame.disabled = true;
  playGame.style.backgroundColor = "lightgray";
  playerName.style.backgroundColor = "lightgray";
  joinGame.style.backgroundColor = "lightgray";
});

leaveGame.addEventListener("click", () => {
  if (leaveGame.innerText == "Abort Game") {
    socket.emit("gameAborted",{ 
      gameId : gmid
    });
  } else if (leaveGame.innerText == "Resign") {
    socket.emit("playerResigned", {
      userName: playerName.value,
      userID: userId,
      gameId : gmid
    });
  }
});
