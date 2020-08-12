let game = new Chess();
let chessBoard = Chessboard('chessboard', 'start')


///////////////// General Game Control
function startGame() {
    // TODO: Start the new Game
}

function resetGame() {
    // TODO: Reset the game
}

function undoMove() {
    // TODO: Undo move

}

function autoStart() {
    // TODO: Automatic play with Math.random()
}

function autoStop() {
    // TODO: Stop automatic play.
}



/**
 * Example1. Move A1 to A3
 * Example2. A1, Move to A3
 * Example3. A1 to A3
 * Example4. Move queen to A3.
 * ...
 *
 *
 */

///////////////// In Game Control
let CHESS = {
    KING: 0,
    QUEEN: 1,
    ROOK: 2,
    BISHOP: 3,
    KNIGHT: 4,
    PAWN: 5,
}

let selectedSquares;
let targetSquares;

// Triggerd by "Coordinate" (i.e. A3) or "Name" (i.e. queen)
// If there are multiple target, choose one of them by coordinate.
function selectPiece(target) {
    // TODO: Select target to move
    // TODO: Selected target should be highlighted
    // TODO: Possible movement should be shown
    currentTarget = target;

    // get squares from piece
    // do selectSquare() for each square.

}

function selectSquare(square) {
    // display all possible moves
}


// Triggerd by "Move" or "Take"
function movePiece(from, to){
    game.move({from: from, to: to});
    board.position(game.fen());
}
