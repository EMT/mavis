
//audio sources
// gong: http://soundbible.com/2062-Metal-Gong-1.html
// party horn http://soundbible.com/1817-Party-Horn.html
// http://soundbible.com/1830-Sad-Trombone.html
// http://soundbible.com/2040-Rooster-Crowing-2.html



function BufferLoader(audioContext, urlList, callback) {
  this.audioContext = audioContext;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.audioContext.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}




window.onload = init;
var audioContext;
var bufferLoader;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();

  bufferLoader = new BufferLoader(
    audioContext,
    [
      '/audio/synth_lead.m4a',
      '/audio/major-thirds.m4a',
      '/audio/bass.m4a',
      '/audio/brass.mp3',
      // '/audio/gong.mp3',
      // '/audio/party_horn.mp3',
      // '/audio/sad_trombone.mp3',
      // '/audio/rooster.mp3'
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  // var gainNode = audioContext.createGain();
  // gainNode.gain.value = 0.5;
  // var source1 = audioContext.createBufferSource();
  // var source2 = audioContext.createBufferSource();
  // source1.buffer = bufferList[0];
  // // source2.buffer = bufferList[1];

  // source1.connect(gainNode);

  // gainNode.connect(audioContext.destination)
  // // source2.connect(audioContext.destination);
  // source1.start(0);
  // // source2.start(0);
}

var source1;
var source2;
var gainNode1;
var gainNode2;
var currentSoundIndex = 0;

var sources = [];
var gainNodes = [];


// $(".js-key").mousedown(function(e){
//   source = audioContext.createBufferSource();

//   gainNode1 = audioContext.createGain();

//   gainNode1.gain.value = 0.5;

//   // source.buffer = bufferLoader.bufferList[$(this).index(".js-key")];
//   source.buffer = bufferLoader.bufferList[currentSoundIndex];

//   source.playbackRate.value = Math.pow(Math.pow(2, 1/12), $(this).index(".js-key") - 6 );

//   console.log(Math.pow(2, 1/12) * $(this).index(".js-key"));

//   source.connect(gainNode1);

//   gainNode1.connect(audioContext.destination)

//   source.start(0);

// })

// $("#js-sound-changer").change(function(){
//   currentSoundIndex = $(this).val();
//   console.log('change')
// })