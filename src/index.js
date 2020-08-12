'use strict';




// step1. selectModel(modelName) == loadModel(modelName)&loadDictionary(modelName)

// step2. predictSingleAudio(audio) == loadAudio(filePath) -> processAudio(audioBuffer) -> predict(melSpectrogram)

// step3. listen()

const recognizer = new Recognizer();
recognizer.selectModel('monica');


let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let statusElem = document.getElementById("status");
let resultElem = document.getElementById("result");

startButton.onclick = () => {
  statusElem.innerHTML = 'Say Something...';
  recognizer.startListen();
}

stopButton.onclick = () => {
  statusElem.innerHTML = 'Stop Listening';
  recognizer.stopListen();
}




recognizer.onResult = function(e) {
  console.log(`Predict: ${e.detail.result}`);
  if (e.detail.result !== ""){
    resultElem.innerHTML = `Did you said "${e.detail.result}" ?`;
  }
  // TODO: Intend detection.
}



/**
 * Intend detection using cosine similarity.
 * @param {String} inputStr Single command
 * @param {Array<String>} commandSet Set of command
 * @return {String} command to execute
 *
 */
function intendDetect(inputStr, commandSet) {
  // TODO: Implement
  // TODO: Calculate cosine similarity

}

function execCommand(commandStr) {

}