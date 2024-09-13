const dcrp = require("../../checkValid/decryptMove");
const not = require("../../notations");

function LOS_Squares(
  color,
  whichPieceGaveCheck,
  piece_pos,
  Moves,
  king,
  kingPos,
  squareArray
) {
  if(whichPieceGaveCheck == "n" || whichPieceGaveCheck == "p"){
    return;
  }
  dcrp.decryptMove(Moves, whichPieceGaveCheck, color);
  if(!Moves){
    return;
  }
  for (let i = 0; i < Moves.length; i++) {
    /* Check until our king is found */
    if (Moves[i][0] == king) {
      let isChecked = false;
      let kingPos = [not.RTI[Moves[i][2]], not.FTI[Moves[i][1]]];
      if (--i < 0) {
        return;
      }
      let sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]];

      /* left diag left */
      while (kingPos[0] - sqInd[0] == 1 && kingPos[1] - sqInd[1] == 1) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      /* left diagonal right */
      while (sqInd[0] - kingPos[0] == 1 && sqInd[1] - kingPos[1] == 1) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      /* Right diagonal right */
      while (kingPos[0] - sqInd[0] == 1 && sqInd[1] - kingPos[1] == 1) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      /* Right diagonal right */
      while (sqInd[0] - kingPos[0] == 1 && kingPos[1] - sqInd[1] == 1) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      /* File up */
      while (kingPos[0] - sqInd[0] == 1 && kingPos[1] == sqInd[1]) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      /* File down */
      while (sqInd[0] - kingPos[0] == 1 && kingPos[1] == sqInd[1]) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      /* Rank left */
      while (kingPos[0] == sqInd[0] && kingPos[1] - sqInd[1] == 1) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      /* Rank right */
      while (kingPos[0] == sqInd[0] && sqInd[1] - kingPos[1]) {
        isChecked = true;
        squareArray.push(Moves[i]);
        --i;
        if (i < 0) {
          return;
        }
        (kingPos = sqInd),
          (sqInd = [not.RTI[Moves[i][1]], not.FTI[Moves[i][0]]]);
      }
      if (isChecked) {
        return;
      }

      return;
    }
  }
}
module.exports = { LOS_Squares };
