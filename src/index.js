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
let recordBtn = document.getElementById('recordBtn');

let statusElem = document.getElementById('recogStatus');
let resultElem = document.getElementById('recogResult');
let latencyElem = document.getElementById('recogLatency');
let lengthElem = document.getElementById('inputAudioLength');

const textdic = {
    startBtn :{
        startRecord : "Record continuous",
        stopRecord : "Stop Recording"
    },
    recordBtn: {
        startRecord: "Record the 3 seconds",
        stopRecord: "Stop Recording",
    }   
}

recordBtn.innerHTML = textdic.recordBtn.startRecord;
startBtn.innerHTML = textdic.startBtn.startRecord

startBtn.onclick = function () {
    if(recognizer.model === null) {
        $('#gameStartFailAlert').show();
        return;
    }
    if(recordBtn.innerHTML === textdic.recordBtn.stopRecord) {
      recordBtn.innerHTML = textdic.recordBtn.startRecord;
      statusElem.innerHTML = "";
      recognizer.stopRecord();
    }
    $('#gameStartFailAlert').hide();
    if(startBtn.innerHTML === textdic.startBtn.startRecord){
        startBtn.innerHTML = textdic.startBtn.stopRecord;
        statusElem.innerHTML = "Initializing..."
        recognizer.isInitialized = false;
        recognizer.startListen();
        recordBtn.hidden = true;
    }
    else {
        startBtn.innerHTML = textdic.startBtn.startRecord;
        statusElem.innerHTML = "";
        recognizer.stopListen();
        recordBtn.hidden = false;
        startBtn.hidden = false;
    }
}


recognizer.recordTimeout = 3000 // ms

recordBtn.onclick = function () {
  if(recognizer.model === null) {
      $('#gameStartFailAlert').show();
      return;
  }
  if(startBtn.innerHTML === textdic.startBtn.stopRecord) {
      startBtn.innerHTML = textdic.startBtn.startRecord;
      statusElem.innerHTML = "";
      recognizer.stopListen();
  }
  $('#gameStartFailAlert').hide();
  if(recordBtn.innerHTML === textdic.recordBtn.startRecord){
      recordBtn.innerHTML = textdic.recordBtn.stopRecord;
      statusElem.innerHTML = "Initializing..."
      recognizer.isInitialized = false;
      recognizer.startRecord();
  }
  else {
      recordBtn.innerHTML = textdic.recordBtn.startRecord;
      statusElem.innerHTML = "";
      recognizer.stopRecord();
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
    if (recordBtn.innerHTML === textdic.recordBtn.stopRecord){
        recordBtn.innerHTML = textdic.recordBtn.startRecord;
        statusElem.innerHTML = "";
        recognizer.stopRecord();
    }
    if (e.detail.result === ""){
        resultElem.innerHTML = "Please Say Again!";
        return;
    }
    t1 = performance.now();
    console.log(e.detail.result);
    // resultElem.innerHTML = `${e.detail.result}`;
    // resultElem.innerHTML = `${e.detail.result}`;
    latencyElem.innerHTML = `${Math.round(t1-t0)}ms`;
    // TODO: Intend detection.
    const cmdList = parser.parse(e.detail.result);
    console.log(cmdList);
    recogInterface(cmdList);
    resultElem.innerHTML = `${cmdList.join(' ')}`;
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