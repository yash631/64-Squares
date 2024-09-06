const not = require("../notations");

function decryptMove(moves_list, piece, color) {
  if(!moves_list){
    return;
  }
  for (let i = 0; i < moves_list.length; i++) {
    if (moves_list[i].includes(not.KING[1-color])){
      continue;
    }
    for (let character = 0; character < moves_list[i].length; character++) {
      /* Regular Expression for finding numbers in string */
      if (/\d/.test(moves_list[i][character])) {
        moves_list[i] = `${moves_list[i][character - 1]}${moves_list[i][character]}`;
      }
    }
  }
}
module.exports = { decryptMove };