'use strict';

var state = require('./models.js').data.state;

state.f1s = [];
state.f2s = [];

Array.prototype.simpleSMA=function(N) {
return this.map(
  function(el,index, _arr) { 
      return _arr.filter(
      function(x2,i2) { 
        return i2 <= index && i2 > index - N;
        })
      .reduce(
      function(current, last, index, arr){ 
        return (current + last); 
        })/index || 1;
      }); 
};

function recorderProcess(e) {
    console.log("sending data");
    var left = e.inputBuffer.getChannelData(0);
    ws.send(convertFloat32ToInt16(left));
}

function convertFloat32ToInt16(buffer) {
  var l = buffer.length;
  var buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l])*0x7FFF;
  }
  return buf.buffer;
}

const Spectrogram = (id) => {
  console.log("here")
  const self = {};

  self.canvas = document.getElementById(id);
  self.width  = self.canvas.width;
  self.height = self.canvas.height;
  self.ctx = self.canvas.getContext('2d');

  self.x = 0;
  self.bufferSize = 1024;
  self.dataBuffer = new Float32Array(self.height);
  self.uint8array = new Uint8Array(4);

  self.gotStream = function(stream) {
    console.log('creating stream')
    console.log(stream)
    self.context = global_audio_context;
    self.sampleRate = self.context.sampleRate;

    var input = self.context.createMediaStreamSource(stream);
    self.analyser = self.context.createAnalyser();
    self.analyser.fftSize = self.bufferSize;
    input.connect(self.analyser);

    // self.outputStream = self.context.createMediaStreamDestination();
    // self.recorder = new MediaRecorder(self.outputStream.stream);
    // input.connect(self.outputStream);

    // self.recorderChunks = [];
    // self.recorder.ondataavailable = function(evt) {
      // push each chunk (blobs) in an array
      // self.recorderChunks.push(evt.data);
    // };
    // self.recorder.onstop = function(evt) {
      // Make blob out of our blobs, and open it.
      // var blob = new Blob(self.recorderChunks, { 'type' : 'audio/ogg; codecs=opus' });
      
      // ws.send(blob);
      
      // var audioTag = document.createElement('audio');
      // document.querySelector("audio").src = URL.createObjectURL(blob);
    // };

    // self.interval = 50;
    // self.recorder.start();
    // setTimeout(self.startTimer, 1000/self.interval);

    var bufferSize = 4096;
    var recorder = self.context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess;
    // recorder.start();
    input.connect(recorder);
    recorder.connect(self.context.destination);

    self.animate();
  }

  self.getData = function() {
    var freqByteData = new Uint8Array(self.analyser.frequencyBinCount);
    self.analyser.getByteFrequencyData(freqByteData);

    // Reverse the direction, making lower frequencies on the bottom.
    for (var i = self.analyser.frequencyBinCount - 1; i >= 0; i--) {
      self.dataBuffer[i] = freqByteData[i] / 255.0;
    }

    return self.dataBuffer
  }

  self.logScale = function(index, total, opt_base) {
    var base = opt_base || 2;
    var logmax = self.logBase(total + 1, base);
    var exp = logmax * index / total;
    return Math.round(Math.pow(base, exp) - 1);
  }

  self.logBase = function(val, base) {
    return Math.log(val) / Math.log(base);
  }


  self.drawFrame = function(data) {
    var data = data || self.getData();

    self.ctx.clearRect(0, 0, self.width, self.height);

    var logIntensities = data.map(function (curr, i) {
      const logIndex = self.logScale(i, data.length);
      return data[logIndex];
    });
    var highlighted = data.map(function (intensity) {
      var highlighted = 0;
      if (intensity > 0.5) {
        highlighted = 1;
      }
      return highlighted;
    })
    var logHighlights = highlighted.map(function (curr, i) {
      const logIndex = self.logScale(i, data.length);
      return highlighted[logIndex];
    });

    const peaksWrapped = Array.from(logIntensities).map(function (curr, i) {
      return [i,logHighlights[i]];
    }).filter(function (curr) {
      return curr[1] == 1;
    })
    const peaks = peaksWrapped.map(function (curr) {
      return curr[0]
    });

    // var barWidth = (self.width / data.length);
    // for(var i = 0; i < data.length; i++) {
    //   const logIndex = self.logScale(i, data.length);
    //   const barHeight = data[logIndex]*self.height;

    //   //self.ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    //   self.ctx.fillStyle = 'rgb(' + highlighted[logIndex] * self.height + 100 + ',50,50)';
    //   self.ctx.fillRect(i * barWidth,self.height-barHeight - 20,barWidth,barHeight);
    // }

    var peakLocs = [];
    // if (peaks.length > 0) {
    //   const peakBreaks = [];
    //   peaksWrapped.map(function (curr, i) {
    //     if (i == 0) {
    //       peakBreaks.push(curr[0]);
    //     } else if (i - 1 >= 0 && peaksWrapped[i-1][0]+1 != curr[0]) {
    //       peakBreaks.push(peaksWrapped[i-1][0])
    //       peakBreaks.push(curr[0]);
    //     } else if (i == peaksWrapped.length - 1) {
    //       peakBreaks.push(curr[0]);
    //     }
    //   }).filter(function (curr) {
    //     return curr != null;
    //   });

    //   peakLocs = peakBreaks.map(function (curr, i) {
    //     if (i % 2 != 0) {
    //       return null;
    //     } else {
    //       return [peakBreaks[i],peakBreaks[i+1]];
    //     }
    //   }).filter(function (curr) {
    //     return curr != null;
    //   });
      

    //   // for (var i = 0; i < peakLocs.length; i++) {
    //     // self.ctx.fillStyle = 'rgb(0,0,0)';
    //     // self.ctx.fillRect(peakLocs[i][0],self.height-10,peakLocs[i][1]-peakLocs[i][0],10);
    //   // }

    // }

    self.ctx.fillRect(state.f2 / 2000 * self.width,state.f1 / 800 * self.height,10,10);
  }

  self.animate = function() {
    self.drawFrame();
    requestAnimationFrame(self.animate);
  }

  self.startTimer = function () {
    console.log("sending data")
    self.recorder.requestData();
    self.recorder.stop();

    self.recorder.start();
    setTimeout(self.startTimer, 1000/self.interval);
  }

  return self;
}

function callback(stream) {
  var context = new AudioContext();
  var mediaStreamSource = context.createMediaStreamSource(stream);
  console.log('opened mic')
  const sg = Spectrogram('spectrogram');
  sg.gotStream(stream);
}

function err() {
  console.log('failed to open mic')
}

module.exports = function initAudio () {
  console.log("init")
  
}

var ws = new WebSocket('ws://ec2-52-32-126-151.us-west-2.compute.amazonaws.com:5000/audio');

ws.onmessage = function (e) {
  const payload=JSON.parse(e.data);
  state.f1s.push(payload[0]);
  state.f2s.push(payload[1]);
  // state.f1 = state.f1s.simpleSMA(10)[state.f1s.length-1];
  state.f1 = payload[0]
  state.f2 = payload[1]
  state.vowel = mapFormantToVowel(state.f1,state.f2)
};

function mapFormantToVowel (f1,f2) {
  if (f1 < 500 && f2 < 1500) {
    return 'u';
  } else if (f1 > 500 && f2 < 1500) {
    return 'a';
  } else if (f1 < 500 && f2 > 1500) {
    return 'i';
  } else {
    return '_';
  }
}

ws.onopen = function(evt) {
  console.log('Connected to websocket.');

  // First message: send the sample rate
  global_audio_context = new AudioContext();
  const sampleRate = global_audio_context.sampleRate;
  ws.send("sample rate:" + sampleRate);

  navigator.webkitGetUserMedia({audio:true}, callback, err);
}

var global_audio_context;