const getBoard = require("../../../../Board/createBoard");
const LD = require("../../Bishop/findForCheck/leftDiagonal");
const RD = require("../../Bishop/findForCheck/rightDiagonal");
const FL = require("../../Rook/findForCheck/file");
const RNK = require("../../Rook/findForCheck/rank");
const DIR = require("../../Knight/findForCheck/allDirections");
const Bishop = require("../../Bishop/findForCheck/discoveredCheck");
const Rook = require("../../Rook/findForCheck/discoveredCheck");

function prom(piece, square, king, color, pawn, gameid) {
  let board = getBoard.getCurrentBoard(gameid);

  if (piece === "q" || piece === "Q") {
    return (
      LD.leftDiag(square, king, color, piece, gameid) ||
      RD.rightDiag(square, king, color, piece, gameid) ||
      RNK.rank(square, king, color, piece, gameid) ||
      FL.file(square, king, piece, gameid)
    );
  } else if (piece === "r" || piece === "R") {
    return RNK.rank(square, king, color, piece) || FL.file(square, king, color, piece, gameid);
  } else if (piece === "n" || piece === "N") {
    return DIR.movesArray(
      square,
      [
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
        [-1, -2],
        [-2, -1],
        [1, -2],
        [2, -1],
      ],
      king,
      color,
      gameid
    );
  } else if (piece === "b" || piece === "B") {
    return LD.leftDiag(square, king, color, piece) || RD.rightDiag(square, king, color, piece, gameid);
  } else {
    /* Discovered checks */
    const inGamePcs = getBoard.createInGamePcs(board);
    /* Check for Discovered check from Bishop */
    const b = Bishop.bishopDiscovery(
      getBoard.Board,
      "b",
      inGamePcs,
      king,
      color,
      gameid,
    );
    if (b) {
      return b;
    }
    /* Check for Discovered check from Rook */
    const r = Rook.rookDiscovery(getBoard.Board, "r", inGamePcs, king, color, gameid);
    if (r) {
      return r;
    }
    /* Check for Discovered check from Queen */
    const q =
      Bishop.bishopDiscovery(getBoard.Board, "q", inGamePcs, king, color, gameid) ||
      Rook.rookDiscovery(getBoard.Board, "q", inGamePcs, king, color, gameid);
    if (q) {
      return q;
    }
  }

  return 0;
}

module.exports = { prom };
