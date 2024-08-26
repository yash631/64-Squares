function findKing(col, lm, ALLPCS, iGP, rk, fl, board) {
  let king = "k";
  if(col){
    king = "K"
  }
  const totalMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  function normalMove(rank,file){
    lm.k[col][`${iGP[king][0][0]}${iGP[king][0][1]}`].push(`${king}${fl[file]}${rk[rank]}`);
  }
  function captureMove(rank,file){
    lm.k[col][`${iGP[king][0][0]}${iGP[king][0][1]}`].push(`${king}x${fl[file]}${rk[rank]}`);
  }
    if(!lm.k[col][`${iGP[king][0][0]}${iGP[king][0][1]}`]){
      lm.k[col][`${iGP[king][0][0]}${iGP[king][0][1]}`] = [];
    }
    for (const move of totalMoves) {
      let rank = iGP[king][0][0] + move[0],
        file = iGP[king][0][1] + move[1]; 
      if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
        if (ALLPCS[1-col].includes(board[rank][file])) {
          captureMove(rank,file);
          continue;
        }
        else if (board[rank][file] != " "){
          continue;
        }
        normalMove(rank,file);
      }
    }
}
module.exports = { findKing };
