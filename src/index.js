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

let groundTruth =`61-70968-0000 HE BEGAN A CONFUSED COMPLAINT AGAINST THE WIZARD WHO HAD VANISHED BEHIND THE CURTAIN ON THE LEFT
61-70968-0001 GIVE NOT SO EARNEST A MIND TO THESE MUMMERIES CHILD
61-70968-0002 A GOLDEN FORTUNE AND A HAPPY LIFE
61-70968-0003 HE WAS LIKE UNTO MY FATHER IN A WAY AND YET WAS NOT MY FATHER
61-70968-0004 ALSO THERE WAS A STRIPLING PAGE WHO TURNED INTO A MAID
61-70968-0005 THIS WAS SO SWEET A LADY SIR AND IN SOME MANNER I DO THINK SHE DIED
61-70968-0006 BUT THEN THE PICTURE WAS GONE AS QUICKLY AS IT CAME
61-70968-0007 SISTER NELL DO YOU HEAR THESE MARVELS
61-70968-0008 TAKE YOUR PLACE AND LET US SEE WHAT THE CRYSTAL CAN SHOW TO YOU
61-70968-0009 LIKE AS NOT YOUNG MASTER THOUGH I AM AN OLD MAN
61-70968-0010 FORTHWITH ALL RAN TO THE OPENING OF THE TENT TO SEE WHAT MIGHT BE AMISS BUT MASTER WILL WHO PEEPED OUT FIRST NEEDED NO MORE THAN ONE GLANCE
61-70968-0011 HE GAVE WAY TO THE OTHERS VERY READILY AND RETREATED UNPERCEIVED BY THE SQUIRE AND MISTRESS FITZOOTH TO THE REAR OF THE TENT
61-70968-0012 CRIES OF A NOTTINGHAM A NOTTINGHAM
61-70968-0013 BEFORE THEM FLED THE STROLLER AND HIS THREE SONS CAPLESS AND TERRIFIED
61-70968-0014 WHAT IS THE TUMULT AND RIOTING CRIED OUT THE SQUIRE AUTHORITATIVELY AND HE BLEW TWICE ON A SILVER WHISTLE WHICH HUNG AT HIS BELT
61-70968-0015 NAY WE REFUSED THEIR REQUEST MOST POLITELY MOST NOBLE SAID THE LITTLE STROLLER
61-70968-0016 AND THEN THEY BECAME VEXED AND WOULD HAVE SNATCHED YOUR PURSE FROM US
61-70968-0017 I COULD NOT SEE MY BOY INJURED EXCELLENCE FOR BUT DOING HIS DUTY AS ONE OF CUMBERLAND'S SONS
61-70968-0018 SO I DID PUSH THIS FELLOW
61-70968-0019 IT IS ENOUGH SAID GEORGE GAMEWELL SHARPLY AND HE TURNED UPON THE CROWD
61-70968-0020 SHAME ON YOU CITIZENS CRIED HE I BLUSH FOR MY FELLOWS OF NOTTINGHAM
61-70968-0021 SURELY WE CAN SUBMIT WITH GOOD GRACE
61-70968-0022 TIS FINE FOR YOU TO TALK OLD MAN ANSWERED THE LEAN SULLEN APPRENTICE
61-70968-0023 BUT I WRESTLED WITH THIS FELLOW AND DO KNOW THAT HE PLAYED UNFAIRLY IN THE SECOND BOUT
61-70968-0024 SPOKE THE SQUIRE LOSING ALL PATIENCE AND IT WAS TO YOU THAT I GAVE ANOTHER PURSE IN CONSOLATION
61-70968-0025 COME TO ME MEN HERE HERE HE RAISED HIS VOICE STILL LOUDER
61-70968-0026 THE STROLLERS TOOK THEIR PART IN IT WITH HEARTY ZEST NOW THAT THEY HAD SOME CHANCE OF BEATING OFF THEIR FOES
61-70968-0027 ROBIN AND THE LITTLE TUMBLER BETWEEN THEM TRIED TO FORCE THE SQUIRE TO STAND BACK AND VERY VALIANTLY DID THESE TWO COMPORT THEMSELVES
61-70968-0028 THE HEAD AND CHIEF OF THE RIOT THE NOTTINGHAM APPRENTICE WITH CLENCHED FISTS THREATENED MONTFICHET
61-70968-0029 THE SQUIRE HELPED TO THRUST THEM ALL IN AND ENTERED SWIFTLY HIMSELF`;
groundTruth = groundTruth.split('\n').map((row)=>row.replace(" ", ",").split(","));
startButton.onclick = () => {
  /*
  if(recognizer.model === null){
    statusElem.innerHTML = 'Complete the loading model first!';
    return;
  }
  statusElem.innerHTML = 'Say Something...';
  recognizer.startListen();
  */

 let answerPromises=[];
 let totalResult = "";
 for (let i = 0; i<30; i++) {
   answerPromises.push(recognizer.predictAudioFile(`audio/${groundTruth[i][0]}.flac`));
 }
 Promise.all(answerPromises)
        .then((result) => {
          console.log(result);
          for (let j =0; j<30; j++){
            //totalResult+=`61-70968-000${j}\n\tGround Truth:\n\t\t${groundTruth[j]}\n\tHypo:\n\t\t${result[j]}\n`;
            totalResult+=result[j]+'\n';
          }
          console.log(totalResult);
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