const testCases = require("../../ExperimentalCode/TestCases"); 

function checkValidity(move,color){
    console.log(`${move.target} from ${move.source} is a valid move`);
    return true;
}

/* testCases.generateFullGame(); */
/* testCases.testCastling(); */
/* testCases.testPin(); */
/* testCases.testDiscoveredCheckByFreePieces(); */
/* testCases.testDiscoveredCheckByPinnedPawn(); */
/* testCases.testDiscoveredCheckByPinnedBishop(); */
/* testCases.testDiscoveredCheckByPinnedRook(); */
/* testCases.testBlockedSquaresFromKingByPinnedRook(); */
/* testCases.testBlockedSquaresFromKingByPinnedBishop(); */
/* testCases.testBlockedSquaresFromKingByPinnedKnight(); */
/* testCases.testBlockedSquaresFromAPieceGivingDiscoveredCheck(); */
/* testCases.testMoveAfterDoubleCheckByBishopAndRook(); */
/* testCases.testMoveAfterDoubleCheckByQueenAndKnight(); */

module.exports ={checkValidity};