const not = require("../../notations");

function findMovesAfterPin(
  piece_to_push,
  actual_piece,
  color,
  pinnedPcs,
  lm,
  board,
  inGamePcs,
  pinnedPiece_pos
) {
  const king_pos = inGamePcs[not.KING[color]][0];
  const pinningPiece_pos = pinnedPcs[color][actual_piece][3];

  if (
    /* Left Diagonal Left */
    king_pos[0] > pinnedPiece_pos[0] &&
    king_pos[1] > pinnedPiece_pos[1]
  ) {
    let row = pinnedPiece_pos[0],
      col = pinnedPiece_pos[1];
    while (--row > pinningPiece_pos[0] && --col > pinningPiece_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
    (row = pinnedPiece_pos[0]), (col = pinnedPiece_pos[1]);
    while (++row < king_pos[0] && ++col < king_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
  } else if (
    /* Left Diagonal Right */
    king_pos[0] < pinnedPiece_pos[0] &&
    king_pos[1] < pinnedPiece_pos[1]
  ) {
    let row = pinnedPiece_pos[0],
      col = pinnedPiece_pos[1];
    while (++row < pinningPiece_pos[0] && ++col < pinningPiece_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
    (row = pinnedPiece_pos[0]), (col = pinnedPiece_pos[1]);
    while (--row > king_pos[0] && --col > king_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
  } else if (
    /* Right Diagonal Left */
    king_pos[0] < pinnedPiece_pos[0] &&
    king_pos[1] > pinnedPiece_pos[1]
  ) {
    let row = pinnedPiece_pos[0],
      col = pinnedPiece_pos[1];
    while (++row < pinningPiece_pos[0] && --col > pinningPiece_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
    (row = pinnedPiece_pos[0]), (col = pinnedPiece_pos[1]);
    while (--row > king_pos[0] && ++col < king_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
  } else if (
    /* Right Diagonal Right */
    king_pos[0] > pinnedPiece_pos[0] &&
    king_pos[1] < pinnedPiece_pos[1]
  ) {
    let row = pinnedPiece_pos[0],
      col = pinnedPiece_pos[1];
    while (--row > pinningPiece_pos[0] && ++col < pinningPiece_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
    (row = pinnedPiece_pos)[0], (col = pinnedPiece_pos[1]);
    while (++row < king_pos[0] && --col > king_pos[1]) {
      lm[piece_to_push][color][`${pinnedPiece_pos[0]}${pinnedPiece_pos[1]}`].push(
        `${actual_piece}${not.FILE[col]}${not.RANK[row]}`
      );
    }
  }
}

module.exports = { findMovesAfterPin };
