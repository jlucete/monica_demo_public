'use strict';

const recognizer = new Recognizer();
const parser = new Parser();


/**
 * Select Model
 */
let monicaBtn = document.getElementById('monica');
let transformerBtn = document.getElementById('transformer');
monicaBtn.onclick = function () {
    __selectModel('monica');
}
transformerBtn.onclick = function () {
    __selectModel('transformer');
}

function __selectModel(modelName) {
    $('#loadModelSuccessAlert').hide();
    $('.progress').show();
    $('#loadModelProgressBar').css("width",`0%`);
    recognizer.selectModel(modelName);
}

recognizer.onProgress = function (e) {
    $('#loadModelProgressBar').css("width",`${e*100}%`);

    if(e === 1) {
        //$('.progress').hide();
        Promise.all([recognizer.dictionary, recognizer.model])
        .then((result)=>{
            $('.progress').hide();
            $('#loadModelSize').html(`${Math.round(result[1].artifacts.weightData.byteLength/(10**4))/100}MB`);
            $('#loadModelSuccessAlert').show();
        })
        return;
    }
}

/**
 * Game Start
 */
let startBtn = document.getElementById('gameStart');

let statusElem = document.getElementById('recogStatus');
let resultElem = document.getElementById('recogResult');
let latencyElem = document.getElementById('recogLatency');
let lengthElem = document.getElementById('inputAudioLength');


startBtn.onclick = function () {
    if(recognizer.model === null) {
        $('#gameStartFailAlert').show();
        return;
    }
    $('#gameStartFailAlert').hide();
    if(startBtn.innerHTML === "Game Start"){
        startBtn.innerHTML = "Game Stop";
        statusElem.innerHTML = "Initializing..."
        recognizer.isInitialized = false;
        recognizer.startListen();
    }
    else {
        startBtn.innerHTML = "Game Start";
        statusElem.innerHTML = "";
        recognizer.stopListen();
    }
}

/**
 * Recognize
 */

let onProcess = false;
let t0, t1;

recognizer.onStartPrediction = function(e) {
  console.log('START RECOG');
  statusElem.innerHTML = `Recognizing...`;
  lengthElem.innerHTML = `${Math.round(e.detail.audioLength*1000)}ms`;
  onProcess = true;
  t0 = performance.now();
}

recognizer.onResult = function(e) {
    onProcess = false;
    if (e.detail.result === ""){
        return;
    }
    t1 = performance.now();
    resultElem.innerHTML = `${e.detail.result}`;
    latencyElem.innerHTML = `${Math.round(t1-t0)}ms`;
    // TODO: Intend detection.
    const cmdList = parser.parse(e.detail.result);
    console.log(cmdList);
    recogInterface(cmdList);
}

recognizer.onSilence = ()=> {
    statusElem.innerHTML = "Say Something...";
}

recognizer.onListen = () => {
    if(!onProcess) {
        statusElem.innerHTML = "Listening...";
    }
}





/**
 * Recog interface
 */

function recogInterface(cmdList) {
    if(!cmdList) {
        return;
    }

    switch(cmdList[0]) {
    case 'LOAD':
        // Load the monical model
        // Load the transformer model
        __LoadTheModel(cmdList);
        break;
    case 'START':
        // Start a new game
        __StartANewGame();
        break;
    case 'UNDO':
        // Undo my last move
        __UndoMyLastMove();
        break;
    case 'CASTLE':
        // Castle kingside
        // Castle Queenside
        __Castling(cmdList);
        break;
    default:
        // A1 to A2
        // move A1 to A2
        // A1 capture A2
        __MovePiece(cmdList);
    }
}

function __LoadTheModel(cmdList) {
    if(cmdList.includes("MONICA")) {
        __selectModel("monica");
    }
    else if(cmdList.includes("TRANSFORMER")) {
        __selectModel("transformer");
    }
}


/**
 * Download App
 */

let downloadBtn = document.getElementById('downloadBtn');
downloadBtn.onclick = function () {
    window.location.assign('download/DemoApplication.apk');
}