const workerOptions = {
    OggOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@0.8.0/OggOpusEncoder.wasm',
    WebMOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@0.8.0/WebMOpusEncoder.wasm'
  };
  
  // Polyfill MediaRecorder
  window.MediaRecorder = OpusMediaRecorder;

class wsWrapper{
    constructor(container,record,play){
        this.container = container;
        this.record = record;
        this.play = play;
        this.name = ""
        this.wavesurfer = undefined;
        this.wave = null;
        this.context = null;
        this.processor = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioURL = "";
        this.audioBlob = null;
        this.audio = null;
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.init();
    }

    init(){
        if(this.wave){
            this.wave.destroy();
        }
        if (this.isSafari) {
            // Safari 11 or newer automatically suspends new AudioContext's that aren't
            // created in response to a user-gesture, like a click or tap, so create one
            // here (inc. the script processor)
            let AudioContext =
                window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.processor = this.context.createScriptProcessor(1024, 1, 1);
        }
        if(this.wavesurfer === undefined){

        // Init wavesurfer
        this.wavesurfer = WaveSurfer.create({
            container: this.container,
            waveColor: '#00FFF6',
            interact: false,
            cursorWidth: 0,
            audioContext: this.context || null,
            audioScriptProcessor: this.processor || null,
            plugins: [
                WaveSurfer.microphone.create({
                    bufferSize: 4096,
                    numberOfInputChannels: 1,
                    numberOfOutputChannels: 1,
                    constraints: {
                        video: false,
                        audio: true
                    }
                })
            ]
        });
        var _self = this;
        this.wavesurfer.microphone.on('deviceReady', function(stream) {
            //Media recorder doesnt support wav webm only!!
            const options = { mimeType: 'audio/wav' }

            _self.mediaRecorder = new MediaRecorder(stream,options, workerOptions);
            _self.mediaRecorder.onstart = _ => {
                _self.dataChunks = [];
            };

            _self.mediaRecorder.ondataavailable = (e)=>{
                _self.audioChunks.push(e.data);              
            }
            _self.mediaType = _self.mediaRecorder.mimeType;

            _self.mediaRecorder.onstop = (e)=> {
                _self.audioBlob = new Blob(_self.audioChunks,{ 'type' :  _self.mediaRecorder.mimeType });
                _self.audioUrl = URL.createObjectURL(_self.audioBlob);
                _self.audio = new Audio(_self.audioUrl);
                _self.audioChunks = [];
                _self.wave = WaveSurfer.create({
                    container: _self.container,
                    waveColor: '#00FFF6',
                    progressColor: '#0089ff',
                    backend: 'MediaElement',
                    interact: true,
                    cursorWidth: 1,
                    audioContext: _self.context || null,
                    audioScriptProcessor: _self.processor || null,
                });

                _self.wave.load(_self.audio);
                _self.wavesurfer.destroy();
                _self.wavesurfer = undefined;
            };
            _self.mediaRecorder.start();
        });

        this.wavesurfer.microphone.on('deviceError', function(code) {
            console.warn('Device error: ' + code);
        });
        this.wavesurfer.on('error', function(e) {
            console.warn(e);
        });

        }
    }
    toogleButton(button){
        if(this.wavesurfer != undefined){
            if (this.wavesurfer.microphone.active) {
                this.wavesurfer.microphone.stop();
                if(this.mediaRecorder){
                    this.mediaRecorder.stop();
                }
                button.style.color = '#00FFF6';
            } else {
                this.wavesurfer.microphone.start();

                button.style.color = 'red';
            }
        } else {
            this.init();
            this.wavesurfer.microphone.start();
            button.style.color = 'red';
        }  
    }
}
