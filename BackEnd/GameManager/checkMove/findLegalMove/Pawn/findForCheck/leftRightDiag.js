const getBoard = require("../../../../Board/createBoard");

function leftRight(col, sqaure, king) {
  let trgtSqLeft, trgtSqRight;
  if (col) {
    trgtSqLeft = [sqaure[0] - 1, sqaure[1] - 1];
    trgtSqRight = [sqaure[0] - 1, sqaure[1] + 1];
  } else {
    trgtSqLeft = [sqaure[0] + 1, sqaure[1] - 1];
    trgtSqRight = [sqaure[0] + 1, sqaure[1] + 1];
  }
  if (
    trgtSqLeft[1] >= 0 &&
    getBoard.Board[trgtSqLeft[0]][trgtSqLeft[1]] == king
  ) {
    return 1;
  }
  if (
    trgtSqRight[1] <= 7 &&
    getBoard.Board[trgtSqRight[0]][trgtSqRight[1]] == king
  ) {
    return 1;
  }
  return 0;
}
module.exports = { leftRight };
