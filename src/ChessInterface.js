// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
let isHighlighted = false;

const pieceCode = {
    "PAWN": "P",
    "KNIGHT": "N",
    "BISHOP": "B",
    "ROOK": "R",
    "QUEEN": "Q",
    "KING": "K",
}

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
    let coord = "";
    let isNum = false;
    for(let i = 0;i < cmdList.length; i++) {
        currChar = parser.cmdDict[cmdList[i]];
        if(isNum && nums.includes(currChar)) {
            coord += currChar;
            isNum = false;
        }
        else if(!isNum && alphabets.includes(currChar)) {
            coord += currChar;
            isNum = true;
        }
    }
    console.log(coord);
    if (coord.length >= 4) {
        let from = coord.slice(0,2);
        let to = coord.slice(2,4);
        movePiece(from.toLowerCase(), to.toLowerCase());

        return;
    }

    const pieces = "PAWN KNIGHT BISHOP ROOK QUEEN KING".split(" ");
    let isPiece = true;
    isNum = false;
    let san1 = "";
    let san2 = "";
    for(let i =0; i < cmdList.length; i++) {
        currChar = parser.cmdDict[cmdList[i]];
        if(isPiece && pieces.includes(currChar)) {
            san1 += pieceCode[currChar];
            san2 += pieceCode[currChar] + 'x';
            isPiece = false;
        }
        else if(!isPiece) {
            if (isNum && nums.includes(currChar)) {
                san1 += currChar;
                san2 += currChar;
                isNum = !isNum;
            }
            else if (!isNum && alphabets.includes(currChar)) {
                san1 += currChar.toLowerCase();
                san2 += currChar.toLowerCase();
                isNum = !isNum;
            }
        }

        if(san1.length >= 3) {
            break;
        }
    }

    if(san1.startsWith('P')) {
        san1 = san1.replace('P', '');
        san2 = san2.replace('P', '');
    }
    console.log(`san1: ${san1}`);
    console.log(`san2: ${san2}`);

    if(!game.move(san1)){
        if(!game.move(san2)){
            return;
        }
    }
    board.position(game.fen());
    window.setTimeout(makeRandomMove, 250);

}