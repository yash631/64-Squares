const getBoard = require("../Board/createBoard");

const not = require("./notations");
const getIndex = require("../checkMove/checkValid/getBoardIndex");

function readThisMove(move, color) {
  const c = not.COLOR[color];
  const pcsSymbol = not.SYMBOLS[move.piece];
  const source = move.source;
  const target = move.target;
  let finalMove = "";
  let piece = not.COLORPCS[move.piece];
  //   console.log(c,move.piece,piece,finalMove,source,target);
  if (move.piece === "wP" || move.piece === "bP") {
    finalMove = target;
  } else {
    finalMove = `${piece}${target}`;
  }
  //   console.log(`Color : ${c}, Piece : ${piece}, Source : ${source}, Move : ${finalMove}`);

  return [c, pcsSymbol, source, finalMove];
}

async function checkValidity(move, color) {
  return new Promise((resolve, reject) => {
    try {
      const [c, pcsSymb, src, fnlmove] = readThisMove(move, color);
      console.log(c, pcsSymb, src, fnlmove);
      if (getIndex.squareToIndex(c, pcsSymb, src, fnlmove)) {
        resolve(true); // Resolves with true if the move is valid
      } else {
        resolve(false); // Resolves with false if the move is invalid
      }
    } catch (error) {
      console.error("Error in checkValidity:", error);
      reject(error); // Rejects if there's an error during validation
    }
  });
}

module.exports = { checkValidity };
