function decryptMove(moves_list, piece, color) {
    for (let i = 0; i < moves_list.length; i++) {
      const mv = moves_list[i];
      if (mv === "k" || mv === "K") {
        continue;
      }
      if (mv[1] === "x") {
        moves_list[i] = mv[2]+mv[3];
      } else {
        moves_list[i] = mv[1]+mv[2];
      }
    }
  }
  module.exports = { decryptMove };