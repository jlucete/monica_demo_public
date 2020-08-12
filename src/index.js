'use strict';




// step1. selectModel(modelName) == loadModel(modelName)&loadDictionary(modelName)

// step2. predictSingleAudio(audio) == loadAudio(filePath) -> processAudio(audioBuffer) -> predict(melSpectrogram)

// step3. listen()

const recognizer = new Recognizer();


let monicaButton = document.getElementById("monicaBtn");
let transformerButton = document.getElementById("transformerBtn");
let vggbLSTMButton = document.getElementById("vggbLSTMBtn");

monicaButton.onclick = () => {
  __selectModel('monica');
}
transformerButton.onclick = () =>{
  __selectModel('transformer');
}
vggbLSTMButton.onclick = () => {
  __selectModel('vggbLSTM');
}

function __selectModel(modelName) {
  document.getElementById('selectModelStatus').innerHTML = `Loading ${modelName}...`;
  recognizer.selectModel(modelName)
    .then(() => {
    document.getElementById('selectModelStatus').innerHTML = `Loading complete!`
    })
    .catch(()=>{
    document.getElementById('selectModelStatus').innerHTML = `Loading failed`
  });

}

let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let statusElem = document.getElementById("recogStatus");
let resultElem = document.getElementById("recogResult");

startButton.onclick = () => {
  statusElem.innerHTML = 'Say Something...';
  recognizer.startListen();
}

stopButton.onclick = () => {
  statusElem.innerHTML = 'Stop Listening';
  recognizer.stopListen();
}

let onProcess = false;

recognizer.onStartPrediction = function() {
  console.log('START RECOG');
  statusElem.innerHTML = `Recognizing...`;
  onProcess = true;
}

recognizer.onResult = function(e) {
  console.log(`Predict: ${e.detail.result}`);
  if (e.detail.result !== ""){
    resultElem.innerHTML = `Did you said "${e.detail.result}" ?`;
  }
  onProcess = false;
  // TODO: Intend detection.
}

recognizer.onListen = function() {
  if (!onProcess){
    statusElem.innerHTML = `Listening...`;
  }
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