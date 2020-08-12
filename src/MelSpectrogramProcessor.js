let SR = 16000; // sampling rate

// Mel Spectrogrma
let melFilterindicesBuffer;


// LogMelSpectrogram
async function createMelSpectrogram(buffer){
  // zero padding to buffer // ckfft
  const fftSize = 512;                        // fft window size
  const nOverlap = 256;                // overlap size
  const channelOne = buffer; // buffer.getChannelData(0);  // use only the first channel // 0 padding
  const sampleRate = SR;
  const spectrogram = [];
  const float_spectrogram = [];

  const melCount = 80; // mel dimension

  // Create a fft object. Here we use default "Hanning" window function
  const fft = new FFT(fftSize, sampleRate);

  // Mel Filterbanks
  let melFilterbanks = createMelFilterbank(fftSize/2, melCount,
                                           lowHz=0, highHz=8000 , sr=sampleRate);

  // Segment
  let currentOffset = 0;
  let maxValue = 0.0;
  let fft_cnt = 1;
  while (currentOffset + fftSize < channelOne.length) {
    const segment = channelOne.slice(currentOffset, currentOffset + fftSize);

    fft.forward(segment);  // generate spectrum for this segment
    let spectrum = fft.spectrum;

    const melspec = applyFilterbank(spectrum, melFilterindicesBuffer, melFilterbanks, melCount);

    const array = new Uint8Array(melCount); // 0 - 254
    const float_array = new Float32Array(melCount);
    for (let j = 0; j < melCount; j++) {
      array[j] = Math.max(-255, Math.log10(melspec[j]) * 45);
      float_array[j] = melspec[j];
    }

    spectrogram.push(array);
    float_spectrogram.push(float_array);

    currentOffset += fftSize - nOverlap;
    fft_cnt+=1;
  }
  return float_spectrogram;
}


/////////////////////

function sum(array) {
  return array.reduce(function(a, b) { return a + b; });
}

// // Use a lower minimum value for energy.
// const MIN_VAL = -10;
// function logGtZero(val) {
//    // Ensure that the log argument is nonnegative.
//    const offset = Math.exp(MIN_VAL);
//    return Math.log(val + offset);
// }

/* dsp.js
function applyFilterbank(fftEnergies, filterbank)
{


  if (fftEnergies.length != filterbank[0].length) {
     console.error(`Each entry in filterbank should have dimensions matching
FFT. |FFT| = ${fftEnergies.length}, |filterbank[0]| = ${filterbank[0].length}.`);
     return;
  }

  // Apply each filter to the whole FFT signal to get one value.
  let out = new Float32Array(filterbank.length);
  for (let i = 0; i < filterbank.length; i++) {
     // To calculate filterbank energies we multiply each filterbank with the
     // power spectrum.
     const win = applyWindow(fftEnergies, filterbank[i]);
     // Then add up the coefficents, and average
     out[i] = sum(win) / fftEnergies.length;
     // out[i] = logGtZero(sum(win));
  }
  return out;
}
*/


// ckfft
function applyFilterbank(spectrogram, melFilterIndices, melWeight, melSize){
  let outBuffer = new Float32Array(melSize);
  let kLogOffset = 0.000001;
  for (i = 0; i < melSize; i++)
  {
    const weightBuffer = melWeight[i];

    let startIndex = melFilterIndices[i];
    let filterWidth = melFilterIndices[i + 2] - startIndex + 1;

    let filteredSum = 0.0;
    for (j = 0; j < filterWidth; j++)
    {
      filteredSum += weightBuffer[j]*spectrogram[startIndex + j];
    }
    //outBuffer[i] = filteredSum;
    outBuffer[i] = Math.log(filteredSum + kLogOffset);

  }
  return outBuffer;
}



function applyWindow(buffer, win) {
  if (buffer.length != win.length) {
     console.error(`Buffer length ${buffer.length} != window length
${win.length}.`);
     return;
  }

  let out = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
     out[i] = win[i] * buffer[i];
  }
  return out;
}

function hzToMel(hz) {
  return 1127 * Math.log(1 + hz/700);
}

function melToHz(mel) {
  return 700 * (Math.exp(mel/1127) - 1);
}

function freqToBin(freq, fftSize, sr=SR) {
  //return Math.floor((fftSize+1) * freq / (sr/2)); // dsp.js
  return Math.floor((fftSize+1) * freq / sr); // ckfft
}

function linearSpace(start, end, count) {
  //const delta = (end - start) / (count + 1); // dsp.js
  const delta = (end - start) / (count - 1); // ckfft
  let out = [];
  /* dsp.js
  for (let i = 0; i < count; i++) {
     out[i] = start + delta * i;
  }
  */

  // ckfft
  out.push(start);
  for (let i = 0; i < count-2; ++i) {
     out.push(start + delta * (i+1)); // ckfft
  }
  out.push(end);

  return out;
}

function triangleWindow(length, startIndex, peakIndex, endIndex) {
  //const win = new Float32Array(length); // dsp.js
  const win = new Float32Array(endIndex - startIndex + 1); // ckfft

  const deltaUp = 1.0 / (peakIndex - startIndex);
  for (let i = startIndex; i < peakIndex; i++) {
     // Linear ramp up between start and peak index (values from 0 to 1).
     win[i] = (i - startIndex) * deltaUp;
  }
  const deltaDown = 1.0 / (endIndex - peakIndex);
  for (let i = peakIndex; i < endIndex; i++) {
     // Linear ramp down between peak and end index (values from 1 to 0).
     win[i] = 1 - (i - peakIndex) * deltaDown;
  }
  return win;
}


function createMelFilterbank(fftSize, melCount=80, lowHz=0, highHz=8000, sr=SR) {
  const lowMel = hzToMel(lowHz);
  const highMel = hzToMel(highHz);

  // fftFrequencies in ckfft
  const fftFrequencies = [];
  for (i = 0; i <= fftSize; i++) {
    fftFrequencies.push(i*sr/(fftSize*2));
  }

  // Construct linearly spaced array of melCount intervals, between lowMel and
  // highMel.
  const mels = linearSpace(lowMel, highMel, melCount + 2);
  // Convert from mels to hz.
  const hzs = mels.map(mel => melToHz(mel)); // == filterFrequencies in ckfft
  // Go from hz to the corresponding bin in the FFT.
  const bins = hzs.map(hz => freqToBin(hz, fftSize*2, sr)); // == melFilterindicesBuffer in ckfft , fftSize*2 is ckfft, dsp.js is just fftSize

  melFilterindicesBuffer = bins.slice();

  // Now that we have the start and end frequencies, create each triangular
  // window (each value in [0, 1]) that we will apply to an FFT later. These
  // are mostly sparse, except for the values of the triangle

  /* dsp.js
  const length = bins.length - 2;
  const filters = [];
  for (let i = 0; i < length; i++) {
     // Now generate the triangles themselves.
     filters[i] = triangleWindow(fftSize, bins[i], bins[i+1], bins[i+2]);
  }
  */


  // ckfft
  const filters = [];
  for (i = 0; i < melCount; i++) {
    let startIndex = bins[i];
    let finishIndex = bins[i+2];
    let filterLength = finishIndex - startIndex + 1;

    filters[i] = new Float32Array(filterLength);

    let preRampWidth = (hzs[i+1] - hzs[i]);
    let postRampWidth = (hzs[i+2] - hzs[i+1]);

    for (j = startIndex; j <= finishIndex; j++) {
      if ((fftFrequencies[j] <= hzs[i]) || (fftFrequencies[j] >= hzs[i+2])){
        filters[i][j-startIndex] = 0.0;
      }
      else{
        filters[i][j-startIndex] = Math.min(
          (fftFrequencies[j] - hzs[i]) / preRampWidth,
          (hzs[i+2] - fftFrequencies[j]) / postRampWidth);
      }
    }

  }
  return filters;
}
