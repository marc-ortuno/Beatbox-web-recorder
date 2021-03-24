
class wsWrapper{
    constructor(container,record,play){
        this.container = container;
        this.record = record;
        this.play = play;
        this.wavesurfer = undefined;
        this.wave = null;
        this.context = null;
        this.processor = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
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
            waveColor: '#d6cfcbff',
            interact: false,
            cursorWidth: 0,
            audioContext: this.context || null,
            audioScriptProcessor: this.processor || null,
            plugins: [
                WaveSurfer.microphone.create({
                    bufferSize: 8192,
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
            _self.mediaRecorder = new MediaRecorder(stream);
            _self.mediaRecorder.start();
            _self.mediaRecorder.addEventListener('dataavailable', event=>{
                _self.audioChunks.push(event.data);              
            })
        
            _self.mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(_self.audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                _self.audio = new Audio(audioUrl);
                _self.audioChunks = [];
                _self.wave = WaveSurfer.create({
                    container: _self.container,
                    waveColor: '#d6cfcbff',
                    progressColor: '#a6808cff',
                    backend: 'MediaElement',
                    interact: true,
                    cursorWidth: 1,
                    audioContext: _self.context || null,
                    audioScriptProcessor: _self.processor || null,
                });
                _self.wave.load(_self.audio);
                _self.wavesurfer.destroy();
                _self.wavesurfer = undefined;
            });
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
                button.style.color = '#d6cfcbff';
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
