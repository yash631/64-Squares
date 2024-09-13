/* Check for en passant */
    let epDirection = -1;
    let promotionDir = 1;
    const enPassantCaptureRank = targetSq[0] + epDirection;
    const enPassantCaptureFile = targetSq[1];
    enPassantPawnSquare = `${not.FILE[enPassantCaptureFile]}${not.RANK[enPassantCaptureRank]}`;
    let enPassantCapturePawn = "P";
    if (c) {
      epDirection = 1;
      promotionDir = -1;
      enPassantCapturePawn = "p";
    }

    /* Check for Pawn Promotion */
    if (
      (movePiece === "wP" && targetSq[0] === 7) || // White pawn reaches rank 7
      (movePiece === "bP" && targetSq[0] === 0) // Black pawn reaches rank 0
    ) {
      const promotedPiece = prompt("Promote to: Q, R, B, or N", "Q");
       
      // Update the board with the promoted piece
      finalMove = `${target}=${promotedPiece.toUpperCase()}`; // For example, e8=Q

      // Replace the pawn with the promoted piece on the board
      board[targetSq[0]][targetSq[1]] =
        movePiece === "wP"
          ? promotedPiece.toUpperCase()
          : promotedPiece.toLowerCase();
    } else {
      /* Capture Move */
      if (board[targetSq[0]][targetSq[1]] !== " ") {
        if (movePiece === "wP" || movePiece === "bP") {
          /* Pawn capture on a square */
          finalMove = `${source[0]}x${target}`;
        } else {
          /* Piece captures on a square */
          finalMove = `${piece}x${target}`;
        }
      } else if (board[targetSq[0]][targetSq[1]] === " ") {
        if (movePiece === "wP" || movePiece === "bP") {
          finalMove = target;
        } else {
          finalMove = `${piece}${target}`;
        }
      }
    }
    // Check if it's an en passant move
    if (
      (movePiece === "wP" || movePiece === "bP") &&
      source[0] !== target[0] &&
      board[targetSq[0]][targetSq[1]] === " " &&
      board[enPassantCaptureRank][enPassantCaptureFile] === enPassantCapturePawn
    ) {
      finalMove = `${source[0]}x${target}ep`; // En passant notation
    } else if (board[targetSq[0]][targetSq[1]] !== " ") {
      /* Capture Move */
      if (movePiece === "wP" || movePiece === "bP") {
        /* Pawn capture on a square */
        finalMove = `${source[0]}x${target}`;
      } else {
        /* Piece captures on a square */
        finalMove = `${piece}x${target}`;
      }
    } else if (board[targetSq[0]][targetSq[1]] === " ") {
      if (movePiece === "wP" || movePiece === "bP") {
        finalMove = target;
      } else {
        finalMove = `${piece}${target}`;
      }
    }