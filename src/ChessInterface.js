// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
let isHighlighted = false;

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

var config = {
  draggable: false,
  position: 'start',
}

board = Chessboard('myBoard', config)

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function makeRandomMove () {
    var possibleMoves = game.moves();

    // game over
    if (possibleMoves.length === 0) return;

    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
}



/**
 *
 * Chess Interface
 *
 */

function movePiece(from, to){
    if(isHighlighted) {
        removeGreySquares();
    }
    // see if the move is legal
    let move = game.move({
        from: from,
        to: to,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) {
        let moves = game.moves({
            square: from,
            verbose: true
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) return;

        // highlight the square they moused over
        greySquare(from);

        // highlight the possible squares for this piece
        for (let i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }
        isHighlighted = true;
        return;
    }
    isHighlighted = false;
    board.position(game.fen());
    window.setTimeout(makeRandomMove, 250);
}

function __StartANewGame() {
    game = new Chess();
    board.start();
}

function __UndoMyLastMove() {
    game.undo();
    game.undo();
    board.position(game.fen());
}

function __Castling(cmdList) {
    if(cmdList.includes("KINGSIDE")) {
        game.move('O-O');
        board.position(game.fen());
    }
    else if (cmdList.includes("QUEENSIDE")) {
        game.move('O-O-O');
        board.position(game.fen());
    }
}


function __MovePiece(cmdList) {
    const alphabets = "A B C D E F G H".split(" ");
    const nums = "1 2 3 4 5 6 7 8".split(" ");
    let from = "";
    while(!alphabets.includes(parser.cmdDict[cmdList[0]])) {
        cmdList.shift();
    }
    from += parser.cmdDict[cmdList.shift()];
    while(!nums.includes(parser.cmdDict[cmdList[0]])) {
        cmdList.shift();
    }
    from += parser.cmdDict[cmdList.shift()];
    let to = "";
    while(!alphabets.includes(parser.cmdDict[cmdList[0]])) {
        cmdList.shift();
    }
    to += parser.cmdDict[cmdList.shift()];
    while(!nums.includes(parser.cmdDict[cmdList[0]])) {
        cmdList.shift();
    }
    to += parser.cmdDict[cmdList.shift()];

    if (from && to) {
        movePiece(from.toLowerCase(), to.toLowerCase());
    }
}