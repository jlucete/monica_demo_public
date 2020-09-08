'use strict';

class Parser {
    constructor() {
        this.cmdVecs = [];
        this.cmdLabels = [];
        this.cmdDict = {};
        this.cosineThreshold = -0.8;
        this.__init()
    }

    __init() {
        this.cmdLabels = `A BE SEA D E F G EIGHTCH ONE TO THREE FOUR FIVE SIX SEVEN EIGHT PAWN KNIGHT BISHOP ROOK QUEEN KING CAPTURE MOVE UNDO MY LAST START NEW GAME LOAD THE MONICA TRANSFORMER MODEL CASTLE KINGSIDE QUEENSIDE SEE WON TWO ACH`.split(" ");
        const groundTruth = "A B C D E F G H 1 2 3 4 5 6 7 8 PAWN KNIGHT BISHOP ROOK QUEEN KING CAPTURE MOVE UNDO MY LAST START NEW GAME LOAD THE MONICA TRANSFORMER MODEL CASTLE KINGSIDE QUEENSIDE C 1 2 H".split(" ");
        for(let i = 0; i < this.cmdLabels.length; i++) {
            this.cmdVecs.push(this.word2vec(this.cmdLabels[i]));
            this.cmdDict[this.cmdLabels[i]] = groundTruth[i];
        }
    }

    word2vec(word) {
        const vector = new Array(26).fill(0);
        for(let i = 0; i < word.length; i++) {
            vector[word[i].charCodeAt()-65]++;
        }
        return vector;
    }

    intentDetection(inputVector) {
        let minCosine = 1.0;
        let intent = "";
        for(let i=0; i < this.cmdVecs.length; i++) {
            const currCosine = tf.metrics.cosineProximity(tf.tensor(this.cmdVecs[i]), tf.tensor(inputVector)).dataSync()[0];
            if(currCosine < minCosine && currCosine < this.cosineThreshold){
                minCosine = currCosine;
                intent = this.cmdLabels[i];
            }
        }
        return intent;
    }

    parse(sentence) {
        const wordList = sentence.toUpperCase().split(" ");
        const parseResult = [];
        for(let i=0; i < wordList.length; i++) {
            if(wordList[i] === "") {
                continue;
            }
            const inputVector = this.word2vec(wordList[i]);
            const currResult = this.intentDetection(inputVector);
            if(currResult) {
                parseResult.push(currResult);
            }
        }

        return this.rule_base_parsing(parseResult);
        // return parseResult;
    }

    rule_base_parsing(parseResult){
        let comm = parseResult.join(" ");
        
        comm = comm.replace("KING EIGHT", "KINGSIDE");
        comm = comm.replace("KING SIGHT", "KINGSIDE");

        return comm.split(" ");
    }

}