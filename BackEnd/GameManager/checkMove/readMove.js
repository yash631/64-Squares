const fxM = require("./checkValid/fixMoveString");

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

function pawnMove(m, color) {
  if (rank.includes(m[1])) {
    if (m[2] == "=" && pieces.includes(m[3])) {
      if (m[4] == "+" && fxM.fixMove(m, color)) {
        console.log(
          `${m[0]} moved to ${m[0]}${m[1]} and promoted to ${m[3]} with check`
        );
      } else if (m[4] == "#" && fxM.fixMove(m, color)) {
        console.log(
          `${m[0]} moved to ${m[0]}${m[1]} and promoted to ${m[3]} with checkmate`
        );
      } else if (m[4] == undefined && fxM.fixMove(m, color)) {
        console.log(`${m[0]} moved to ${m[0]}${m[1]} and promoted to ${m[3]}`);
      }
    } else if (m[2] == "+" && fxM.fixMove(m, color)) {
      console.log(`${m[0]} moved to ${m[0]}${m[1]} with check`);
    } else if (m[2] == "#" && fxM.fixMove(m, color)) {
      console.log(`${m[0]} moved to ${m[0]}${m[1]} and checkmate`);
    } else if (m[2] == undefined && fxM.fixMove(m, color)) {
      console.log(`${m[0]} moved to ${m}`);
    } else {
      console.log(`${m} is an illegal move`);
    }
  } else if (m[1] == "x") {
    if (file.includes(m[2]) && rank.includes(m[3])) {
      if (m[4] == "=" && pieces.includes(m[5])) {
        if (m[6] == "+" && fxM.fixMove(m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} and promoted to ${m[5]} with check`
          );
        } else if (m[6] == "#" && fxM.fixMove(m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} and promoted to ${m[5]} and checkmate`
          );
        } else if (m[6] == undefined && fxM.fixMove(m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} and promoted to ${m[5]}`
          );
        } else {
          console.log(`${m} is an illegal move`);
        }
      } else if (m[4] == "e") {
        if (m[6] == "+" && fxM.fixMove(m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} en passant with check`
          );
        } else if (m[6] == "#" && fxM.fixMove(m, color)) {
          console.log(
            `${m[0]} captured on ${m[2]}${m[3]} en passant and checkmate`
          );
        } else if (m[6] == undefined && fxM.fixMove(m, color)) {
          console.log(`${m[0]} captured on ${m[2]}${m[3]} en passant`);
        } else {
          console.log(`${m} is an illegal move`);
        }
      } else if (m[4] == "+" && fxM.fixMove(m, color)) {
        console.log(`${m[0]} captured on ${m[2]}${m[3]} with check`);
      } else if (m[4] == "#" && fxM.fixMove(m, color)) {
        console.log(`${m[0]} captured on ${m[2]}${m[3]} and checkmate`);
      } else if (m[4] == undefined && fxM.fixMove(m, color)) {
        console.log(`${m[0]} captured on ${m[2]}${m[3]}`);
      } else {
        console.log(`${m} is an illegal move`);
      }
    } else {
      console.log(`${m} is an illegal move`);
    }
  } else if (m[0] == "b") {
    bishopMove(m);
  } else {
    console.log(`${m} is an illegal move`);
  }
}

function kingMove(m, color) {
  let rk, fl;
  if (m[1] == "x" && m[4] == undefined) {
    (fl = m[2]), (rk = m[3]);
    if (rank.includes(rk) && file.includes(fl) && fxM.fixMove(m, color)) {
      console.log(`King captured on ${fl}${rk}`);
    } else {
      console.log(`${m} is an illegal move`);
    }
  } else if (m[3] == undefined) {
    (fl = m[1]), (rk = m[2]);
    if (rank.includes(rk) && file.includes(fl) && fxM.fixMove(m, color)) {
      console.log(`King moved to ${fl}${rk}`);
    } else {
      console.log(`${m} is an illegal move`);
    }
  } else {
    console.log(`${m} is an illegal move`);
  }
}

function pieceMove(m, pc, color) {
  let rk, fl;
  if (m[1] == "x") {
    (fl = m[2]), (rk = m[3]);
    if (rank.includes(rk) && file.includes(fl)) {
      if (m[4] == "+" && fxM.fixMove(m, color)) {
        console.log(`${arrOfPieces[pc]} captured on ${fl}${rk} with check`);
      } else if (m[4] == "#" && fxM.fixMove(m, color)) {
        console.log(`${arrOfPieces[pc]} captured on ${fl}${rk} and checkmate`);
      } else if (m[4] == undefined && fxM.fixMove(m, color)) {
        console.log(`${arrOfPieces[pc]} captured on ${fl}${rk}`);
      } else {
        console.log(`${m} is an illegal move`);
      }
    } else {
      console.log(`${m} is an illegal move`);
    }
  } else if (file.includes(m[1]) && rank.includes(m[2])) {
    (fl = m[1]), (rk = m[2]);
    if (m[3] == "+" && fxM.fixMove(m, color)) {
      console.log(`${arrOfPieces[pc]} moved to ${fl}${rk} with check`);
    } else if (m[3] == "#" && fxM.fixMove(m, color)) {
      console.log(`${arrOfPieces[pc]} moved to ${fl}${rk} and checkmate`);
    } else if (m[3] == undefined && fxM.fixMove(m, color)) {
      console.log(`${arrOfPieces[pc]} moved to ${fl}${rk}`);
    } else {
      console.log(`${m} is an illegal move`);
    }
  } else {
    console.log(`${m} is an illegal move`);
  }
}

function isCorrectMove(move, color) {
  if (file.includes(move[0])) {
    pawnMove(move, color);
  } else if (move[0] == "K" || move[0] == "k") {
    kingMove(move, color);
  } else if (pieces.includes(move[0])) {
    pieceMove(move, move[0], color);
  } else {
    console.log(`${move} is an invalid move`);
  }
}

// isCorrectMove("e3",1);
// isCorrectMove("e4",1);
module.exports = isCorrectMove;
