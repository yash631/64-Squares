const  getBoard = require("../../../../Board/createBoard");

function rightDiag(square, king) {
  /* Right Diagonal up-right */
  let rank = square[0],
    file = square[1];
  while (--rank >= 0 && ++file <= 7) {
    if(getBoard.Board[rank][file] == king){
      return 1;
    }
    else if(getBoard.Board[rank][file] != " "){
      break;
    }
  }
  /* Right Diagonal down-left */
  (rank = square[0]), (file = square[1]);
  while (++rank <= 7 && --file >= 0) {
    if(getBoard.Board[rank][file] == king){
      return 1;
    }
    else if(getBoard.Board[rank][file] != " "){
      break;
    }    
  }
  return 0;
}
module.exports = { rightDiag };
