function decryptMove(moves_list, piece, color) {
  for (let i = 0; i < moves_list.length; i++) {
    if (moves_list[i].includes("k") ||  moves_list[i].includes("K")){
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