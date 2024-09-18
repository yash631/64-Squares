function rookDiscovery(Board, piece, inGamePcs, king, color, gameid) {
  if (piece == "r" && color) {
    piece = "R";
  } else if (piece == "q" && color) {
    piece = "Q";
  }
  for (const location of inGamePcs[piece]) {
    let rank = location[0],
      file = location[1];
    /* rank left*/
    while (--file >= 0) {
      if (Board[rank][file] == king) {
        return { piece, rank : location[0], file : location[1] };
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
    /* rank right */
    file = location[1];
    while (++file <= 7) {
      if (Board[rank][file] == king) {
        return { piece, rank : location[0], file : location[1] };
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
    /* file up */
    file = location[1];
    while (--rank >= 0) {
      if (Board[rank][file] == king) {
        return { piece, rank : location[0], file : location[1] };
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
    /* file down */
    rank = location[0];
    while (++rank <= 7) {
      if (Board[rank][file] == king) {
        return { piece, rank : location[0], file : location[1] };
      } else if (Board[rank][file] == " ") {
        continue;
      } else {
        break;
      }
    }
  }
  return 0;
}
module.exports = { rookDiscovery };
