const getIndex = require("./checkValid/getBoardIndex");
const testCases = require("../../ExperimentalCode/TestCases"); 

const arrOfPieces = {
  q: "black queen",
  Q: "white queen",
  B: "white bishop",
  b: "black bishop",
  N: "white knight",
  n: "black knight",
  R: "white rook",
  r: "black rook",
};

const file = ["a", "b", "c", "d", "e", "f", "g", "h"],
  rank = ["1", "2", "3", "4", "5", "6", "7", "8"],
  pieces = ["q", "r", "n", "b", "Q", "R", "N", "B"];

/*
function pawnMove(initial_Sq, m, color) {
  if (rank.includes(m[1])) {
    if (m[2] == "=" && pieces.includes(m[3])) {
      if (m[4] == "+" && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(
          `${m[0]} moved to ${m[0]}${m[1]} and promoted to ${m[3]} with check`
        );
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else if (m[4] == "#" && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(
          `${m[0]} moved to ${m[0]}${m[1]} and promoted to ${m[3]} with checkmate`
        );
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else if (m[4] == undefined && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(`${m[0]} moved to ${m[0]}${m[1]} and promoted to ${m[3]}`);
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      }
    } else if (m[2] == "+" && getIndex.squareToIndex(initial_Sq, m, color)) {
      console.log(`${m[0]} moved to ${m[0]}${m[1]} with check`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else if (m[2] == "#" && getIndex.squareToIndex(initial_Sq, m, color)) {
      console.log(`${m[0]} moved to ${m[0]}${m[1]} and checkmate`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else if (m[2] == undefined && getIndex.squareToIndex(initial_Sq, m, color)) {
      console.log(`${m[0]} moved to ${m}`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else {
      console.log(`${m} is an illegal move`);
      console.log(`---------xxxxxx---------\n`);
    }
  } else if (m[1] == "x") {
    if (file.includes(m[2]) && rank.includes(m[3])) {
      if (m[4] == "=" && pieces.includes(m[5])) {
        if (m[6] == "+" && getIndex.squareToIndex(initial_Sq, m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} and promoted to ${m[5]} with check`
          );
          console.log(
            `----------xxxxxxxx-----Move Made----xxxxxxx----------\n`
          );
        } else if (m[6] == "#" && getIndex.squareToIndex(initial_Sq, m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} and promoted to ${m[5]} and checkmate`
          );
          console.log(
            `----------xxxxxxxx-----Move Made----xxxxxxx----------\n`
          );
        } else if (m[6] == undefined && getIndex.squareToIndex(initial_Sq, m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} and promoted to ${m[5]}`
          );
          console.log(
            `----------xxxxxxxx-----Move Made----xxxxxxx----------\n`
          );
        } else {
          console.log(`${m} is an illegal move`);
          console.log(`---------xxxxxx---------\n`);
        }
      } else if (m[4] == "e") {
        if (m[6] == "+" && getIndex.squareToIndex(initial_Sq, m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} en passant with check`
          );
          console.log(
            `----------xxxxxxxx-----Move Made----xxxxxxx----------\n`
          );
        } else if (m[6] == "#" && getIndex.squareToIndex(initial_Sq, m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} en passant and checkmate`
          );
          console.log(
            `----------xxxxxxxx-----Move Made----xxxxxxx----------\n`
          );
        } else if (m[6] == undefined && getIndex.squareToIndex(initial_Sq, m, color)) {
          console.log(`${m[0]} captured on ${m[2]}${m[3]} en passant`);
          console.log(
            `----------xxxxxxxx-----Move Made----xxxxxxx----------\n`
          );
        } else {
          console.log(`${m} is an illegal move`);
          console.log(`---------xxxxxx---------\n`);
        }
      } else if (m[4] == "+" && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(`${m[0]} captured on ${m[2]}${m[3]} with check`);
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else if (m[4] == "#" && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(`${m[0]} captured on ${m[2]}${m[3]} and checkmate`);
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else if (m[4] == undefined && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(`${m[0]} captured on ${m[2]}${m[3]}`);
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else {
        console.log(`${m} is an illegal move`);
        console.log(`---------xxxxxx---------\n`);
      }
    } else {
      console.log(`${m} is an illegal move`);
      console.log(`---------xxxxxx---------\n`);
    }
  } else if (m[0] == "b") {
    bishopMove(m);
  } else {
    console.log(`${m} is an illegal move`);
    console.log(`---------xxxxxx---------\n`);
  }
}

function kingMove(initial_Sq, m, color) {
  let rk, fl;
  if (m[1] == "x" && m[4] == undefined) {
    (fl = m[2]), (rk = m[3]);
    if (
      rank.includes(rk) &&
      file.includes(fl) &&
      getIndex.squareToIndex(initial_Sq, m, color)
    ) {
      console.log(`King captured on ${fl}${rk}`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else {
      console.log(`${m} is an illegal move`);
      console.log(`---------xxxxxx---------\n`);
    }
  } else if (m[3] == undefined) {
    (fl = m[1]), (rk = m[2]);
    if (
      rank.includes(rk) &&
      file.includes(fl) &&
      getIndex.squareToIndex(initial_Sq, m, color)
    ) {
      console.log(`King moved to ${fl}${rk}`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else {
      console.log(`${m} is an illegal move`);
      console.log(`---------xxxxxx---------\n`);
    }
  } else {
    console.log(`${m} is an illegal move`);
    console.log(`---------xxxxxx---------\n`);
  }
}

function pieceMove(initial_Sq, m, pc, color) {
  let rk, fl;
  if (m[1] == "x") {
    (fl = m[2]), (rk = m[3]);
    if (rank.includes(rk) && file.includes(fl)) {
      if (m[4] == "+" && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(`${arrOfPieces[pc]} captured on ${fl}${rk} with check`);
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else if (m[4] == "#" && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(`${arrOfPieces[pc]} captured on ${fl}${rk} and checkmate`);
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else if (m[4] == undefined && getIndex.squareToIndex(initial_Sq, m, color)) {
        console.log(`${arrOfPieces[pc]} captured on ${fl}${rk}`);
        console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
      } else {
        console.log(`${m} is an illegal move`);
        console.log(`---------xxxxxx---------\n`);
      }
    } else {
      console.log(`${m} is an illegal move`);
      console.log(`---------xxxxxx---------\n`);
    }
  } else if (file.includes(m[1]) && rank.includes(m[2])) {
    (fl = m[1]), (rk = m[2]);
    if (m[3] == "+" && getIndex.squareToIndex(initial_Sq, m, color)) {
      console.log(`${arrOfPieces[pc]} moved to ${fl}${rk} with check`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else if (m[3] == "#" && getIndex.squareToIndex(initial_Sq, m, color)) {
      console.log(`${arrOfPieces[pc]} moved to ${fl}${rk} and checkmate`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else if (m[3] == undefine+-d && getIndex.squareToIndex(initial_Sq, m, color)) {
      console.log(`${arrOfPieces[pc]} moved to ${fl}${rk}`);
      console.log(`----------xxxxxxxx-----Move Made----xxxxxxx----------\n`);
    } else {
      console.log(`${m} is an illegal move`);
      console.log(`---------xxxxxx---------\n`);
    }
  } else {
    console.log(`${m} is an illegal move`);
    console.log(`---------xxxxxx---------\n`);
  }
}
*/
function isCorrectMove(initial_Sq, move, color) {
  if (file.includes(move[0])) {
    pawnMove(initial_Sq, move, color);
  } else if (move[0] == "K" || move[0] == "k") {
    kingMove(initial_Sq, move, color);
  } else if (pieces.includes(move[0])) {
    pieceMove(initial_Sq, move, move[0], color);
  } else {
    console.log(`${move} is an invalid move\n`);
    console.log(`---------xxxxxx---------\n`);
  }
}


/* Generate a complete game */
testCases.generateFullGame();

module.exports = {isCorrectMove};
