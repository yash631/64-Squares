const  getBoard  = require("../../../../Board/createBoard");

function rank(square, king) {
  /* Left Rank */
  let rank = square[0],file = square[1];
  while (--file >= 0) {
    if(getBoard.Board[rank][file] == king){
      return 1;
    }
    else if(getBoard.Board[rank][file] != " "){
      break;
    }
  }
  /* Right Rank */
  file = square[1];
  while (++file <= 7) {
    if(getBoard.Board[rank][file] == king){
      return 1;
    }
    else if(getBoard.Board[rank][file] != " "){
      break;
    }
  }
  return 0;
}
module.exports = { rank };
