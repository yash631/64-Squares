function updateLM(color, king_pos, LEGALMOVES, blockedSquaresForKing) {
  let LegalMoves = LEGALMOVES["k"][color][`${king_pos[0]}${king_pos[1]}`];
  for (const bl_move of blockedSquaresForKing) {
    for (let i = 0; i < LegalMoves.length; i++) {
      function remove() {
        LegalMoves.splice(i, 1);
      }
      const single_move = LegalMoves[i];
      if (bl_move == "O-O" || bl_move == "O-O-O") {
        continue;
      }
      if (single_move == "O-O") {
        if (color == 1) {
          if (
            blockedSquaresForKing.includes("f1") ||
            blockedSquaresForKing.includes("g1")
          ) {
            remove();
            break;
          }
        } else {
          if (
            blockedSquaresForKing.includes("f8") ||
            blockedSquaresForKing.includes("g8")
          ) {
            remove();
            break;
          }
        }
      }
      if (single_move == "O-O-O") {
        if (color == 1) {
          if (
            blockedSquaresForKing.includes("d1") ||
            blockedSquaresForKing.includes("c1")
          ) {
            remove();
            break;
          }
        } else {
          if (
            blockedSquaresForKing.includes("d8") ||
            blockedSquaresForKing.includes("c8")
          ) {
            remove();
            break;
          }
        }
      }
      if (single_move.includes(bl_move)) {
        remove();
        break;
      }
    }
  }
}
module.exports = { updateLM };
