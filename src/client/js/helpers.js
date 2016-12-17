'use strict';

var kMeans = require('./kmeans.js');

const Spectrogram = (id) => {
  console.log("here")
  const self = {};

  self.canvas = document.getElementById(id);
  self.width  = self.canvas.width;
  self.height = self.canvas.height;
  self.ctx = self.canvas.getContext('2d');
  self.imageData = self.ctx.getImageData(0, 0, self.width, self.height);

  self.data = self.imageData.data;

  self.buf = new ArrayBuffer(self.imageData.data.length);
  self.buf8 = new Uint8ClampedArray(self.buf);
  self.data32 = new Uint32Array(self.buf);

  self.x = 0;
  self.bufferSize = 1024;
  self.dataBuffer = new Float32Array(self.height);
  self.uint8array = new Uint8Array(4);
  // self.colorData = new Uint8Array(4 * self.bufferSize / 2);
  self.colorData = new Uint8Array(4 * 800);

  self.gotStream = function(stream) {
    console.log('creating stream')
    console.log(stream)
    self.context = new AudioContext();
    self.sampleRate = self.context.sampleRate;

    var input = self.context.createMediaStreamSource(stream);
    self.analyser = self.context.createAnalyser();
    self.analyser.fftSize = self.bufferSize;
    input.connect(self.analyser);
    self.animate();
  }

  self.setPixel = function(x, y, red, green, blue, alpha) {
    self.data32[y * self.width + x] =
    (alpha << 24) |    // alpha
    (blue << 16) |      // blue
    (green <<  8) |     // green
    red;                // red
  }

  self.getPixel = function(x, y) {
    var value = self.data32[y * self.width + x];
    var channels = self.uint32Touint8(value)
    return channels;
  }

  self.uint32Touint8 = function(uint32) {
    self.uint8array[3] = uint32 >> 24 & 0xff;
    self.uint8array[2] = uint32 >> 16 & 0xff;
    self.uint8array[1] = uint32 >> 8 & 0xff;
    self.uint8array[0] = uint32 & 0xff;
    return data
  }

  self.drawColumn = function() {
    var value = 0;
    for (var y = 0; y < self.height; y++) {
      var x = col;
      self.setPixel(x, y, value, value, value, 255)
    }
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

  self.color = function(value) {
    var rgb = {R: 0, G: 0, B: 0};

    if (0 <= value && value <= 1 / 8) {
      rgb.R = 0;
      rgb.G = 0;
        rgb.B = 4 * value + .5; // .5 - 1 // b = 1/2
      } else if (1 / 8 < value && value <= 3 / 8) {
        rgb.R = 0;
        rgb.G = 4 * value - .5; // 0 - 1 // b = - 1/2
        rgb.B = 0;
      } else if (3 / 8 < value && value <= 5 / 8) {
        rgb.R = 4*value - 1.5; // 0 - 1 // b = - 3/2
        rgb.G = 1;
        rgb.B = -4 * value + 2.5; // 1 - 0 // b = 5/2
      } else if (5 / 8 < value && value <= 7 / 8) {
        rgb.R = 1;
        rgb.G = -4 * value + 3.5; // 1 - 0 // b = 7/2
        rgb.B = 0;
      } else if (7 / 8 < value && value <= 1) {
        rgb.R = -4*value + 4.5; // 1 - .5 // b = 9/2
        rgb.G = 0;
        rgb.B = 0;
    } else {    // should never happen - value > 1
      rgb.R = .5;
      rgb.G = 0;
      rgb.B = 0;
    }

    return [rgb.R, rgb.G, rgb.B, 1].map(function(d) { return parseInt(d * 255, 10)})
  }

  self.colorizeData = function(data) {
    var d;
    for(var i = 0, n = data.length; i < n; i++) {
      d = self.color(data[i]);
      self.colorData.set(d, i * 4);
    }
    return self.colorData;
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


  self.addColumn = function(colorizeData) {
    for (var y = 0; y < self.height; y++) {
      self.setPixel(self.x, y, colorizeData[4 * y + 0], colorizeData[4 * y + 1], colorizeData[4 * y + 2], colorizeData[4 * y + 3]);
    }
    self.x++;
    self.x %= self.width;
  }

  self.drawFrame = function(data) {
    var data = data || self.getData();
    var colorData = self.colorizeData(data)

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

    const k = 4;

    var km = new kMeans({
      K: k
    });

    const peaksWrapped = Array.from(logIntensities).map(function (curr, i) {
      return [i,logHighlights[i]];
    }).filter(function (curr) {
      return curr[1] == 1;
    })
    const peaks = peaksWrapped.map(function (curr) {
      return curr[0]
    });

    var barWidth = (self.width / data.length);
    for(var i = 0; i < data.length; i++) {
      const logIndex = self.logScale(i, data.length);
      const barHeight = data[logIndex]*self.height;

      //self.ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      self.ctx.fillStyle = 'rgb(' + highlighted[logIndex] * self.height + 100 + ',50,50)';
      self.ctx.fillRect(i * barWidth,self.height-barHeight - 20,barWidth,barHeight);
    }

    var peakLocs = [];
    try {
      if (peaks.length > 0) {
        const peakBreaks = [];
        peaksWrapped.map(function (curr, i) {
          if (i == 0) {
            peakBreaks.push(curr[0]);
          } else if (i - 1 >= 0 && peaksWrapped[i-1][0]+1 != curr[0]) {
            peakBreaks.push(peaksWrapped[i-1][0])
            peakBreaks.push(curr[0]);
          } else if (i == peaksWrapped.length - 1) {
            peakBreaks.push(curr[0]);
          }
        }).filter(function (curr) {
          return curr != null;
        });

        peakLocs = peakBreaks.map(function (curr, i) {
          if (i % 2 != 0) {
            return null;
          } else {
            return [peakBreaks[i],peakBreaks[i+1]];
          }
        }).filter(function (curr) {
          return curr != null;
        });
        console.log(peakLocs)
        

        for (var i = 0; i < peakLocs.length; i++) {
          self.ctx.fillStyle = 'rgb(0,0,0)';
          self.ctx.fillRect(peakLocs[i][0],self.height-10,peakLocs[i][1]-peakLocs[i][0],10);
        }

        // km.cluster(peaks);

        // while (km.step()) {
        //   km.findClosestCentroids();
        //   km.moveCentroids();

        //   if(km.hasConverged()) break;
        // }

        // for (var i = 0; i < km.centroids.length; i++) {
        //   self.ctx.fillStyle = 'rgb(0,0,0)';
        //   self.ctx.fillRect(km.centroids[i][0],400,10,10);
        // }
      }
    } catch (e) {
      console.log(e);
    }

    console.log('drawing')

    // self.imageData.data.set(self.buf8);
    // self.ctx.putImageData(self.imageData, 0, 0);
  }

  self.animate = function() {
    self.drawFrame();
    requestAnimationFrame(self.animate);
  }
  console.log(self)
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
  navigator.webkitGetUserMedia({audio:true}, callback, err);
}

