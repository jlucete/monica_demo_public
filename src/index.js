'use strict';

const recognizer = new Recognizer();


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


startBtn.onclick = function () {
    if(recognizer.model === null) {
        $('#gameStartFailAlert').show();
        return;
    }
    $('#gameStartFailAlert').hide();
    if(startBtn.innerHTML === "Game Start"){
        startBtn.innerHTML = "Game Stop";
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

recognizer.onStartPrediction = function() {
  console.log('START RECOG');
  statusElem.innerHTML = `Recognizing...`;
  onProcess = true;
  t0 = performance.now();
}


let totalResult = "";

recognizer.onResult = function(e) {
    onProcess = false;
    if (e.detail.result === ""){
        return;
    }
    t1 = performance.now();
    totalResult += " " + e.detail.result;
    resultElem.innerHTML = `${totalResult}`;
    latencyElem.innerHTML = `${Math.round(t1-t0)}ms`;
    // TODO: Intend detection.
}

recognizer.onSilence = ()=> {
    statusElem.innerHTML = "Say Something...";
}

recognizer.onListen = () => {
    if(!onProcess) {
        statusElem.innerHTML = "Listening...";
    }
}