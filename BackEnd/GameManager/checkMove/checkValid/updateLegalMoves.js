function updateLM(color, king_pos, LEGALMOVES, blockedSquaresForKing) {
  for (const bl_move of blockedSquaresForKing) {
    for (
      let i = 0;
      i < LEGALMOVES["k"][color][`${king_pos[0]}${king_pos[1]}`].length;
      i++
    ) {
      const single_move =
        LEGALMOVES["k"][color][`${king_pos[0]}${king_pos[1]}`][i];
      if (single_move.includes(bl_move)) {
        LEGALMOVES["k"][color][`${king_pos[0]}${king_pos[1]}`].splice(i, 1);
        break;
      }
    }
  }
}
module.exports = { updateLM };
