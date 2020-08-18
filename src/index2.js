'use strict';
// step1. selectModel(modelName) == loadModel(modelName)&loadDictionary(modelName)

// step2. predictSingleAudio(audio) == loadAudio(filePath) -> processAudio(audioBuffer) -> predict(melSpectrogram)

// step3. listen()

const recognizer = new Recognizer();


let monicaButton = document.getElementById("monicaBtn");
let transformerButton = document.getElementById("transformerBtn");

monicaButton.onclick = () => {
  __selectModel('monica');
}
transformerButton.onclick = () =>{
  __selectModel('transformer');
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

stopButton.onclick = () => {
  if(recognizer.model === null){
    statusElem.innerHTML = 'Complete the loading model first!';
    return;
  }
  statusElem.innerHTML = 'Stop Listening';
  recognizer.stopListen();
}

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
  t1 = performance.now();
  console.log(`Predict: ${e.detail.result}`);
  if (e.detail.result !== ""){
    totalResult += " " + e.detail.result;
    resultElem.innerHTML = `Did you said "${totalResult} " ?`;
    document.getElementById('recogTime').innerHTML = `Latency: ${Math.round(t1-t0)}ms`;
  }
  onProcess = false;
  // TODO: Intend detection.
}

recognizer.onSilence = function() {
  totalResult = "";
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