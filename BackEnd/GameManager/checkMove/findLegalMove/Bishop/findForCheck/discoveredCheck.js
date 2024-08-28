function bishopDiscovery(Board,piece, inGamePcs, king, color) {
  if (piece == "b" && color) {
    piece = "B";
  } else if( piece == "q" && color){
    piece = "Q";
  }
  for (const location of inGamePcs[piece]) {
    let rank = location[0],
      file = location[1];
    /* left diagonal left */
    while (--rank >= 0 && --file >= 0) {
      if (Board[rank][file] == king) {
        return 1;
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
    /* left diagonal right */
    (rank = location[0]), (file = location[1]);
    while (++rank <= 7 && ++file <= 7) {
      if (Board[rank][file] == king) {
        return 1;
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
    /* right diagonal left */
    (rank = location[0]), (file = location[1]);
    while (++rank <= 7 && --file >= 0) {
      if (Board[rank][file] == king) {
        return 1;
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
    /* right diagonal right */
    (rank = location[0]), (file = location[1]);
    while (--rank >= 0 && ++file <= 7) {
      if (Board[rank][file] == king) {
        return 1;
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
  }
  return 0;
}
module.exports = { bishopDiscovery };
