
document.addEventListener('DOMContentLoaded', function() {
    let kickBtn = document.querySelector('#kickBtn');
    let playKickBtn = document.querySelector('#playKickBtn');
    let snareBtn = document.querySelector('#snareBtn');
    let playSnareBtn = document.querySelector('#playSnareBtn');
    let hhBtn = document.querySelector('#hhBtn');
    let playHhBtn = document.querySelector('#playHhBtn');
    let fsBtn = document.querySelector('#fsBtn');
    let playFsBtn = document.querySelector('#playFsBtn');

    var kick = new wsWrapper("#kick",kickBtn,playKickBtn);
    kick.name = 'kick';
    kickBtn.onclick = function() {
        kick.toogleButton(kickBtn);
    }
    playKickBtn.onclick = function(){
        kick.audio.play();
    }

    var snare = new wsWrapper("#snare",snareBtn,playSnareBtn);
    snare.name = 'snare';
    snareBtn.onclick = function() { 
        snare.toogleButton(snareBtn);
    }
    playSnareBtn.onclick = function(){
        snare.audio.play();
    }

    var hh = new wsWrapper("#hh",hhBtn,playHhBtn);
    hh.name = 'HiHat';
    hhBtn.onclick = function() {
        hh.toogleButton(hhBtn);
    }
    playHhBtn.onclick = function(){
        hh.audio.play();
    }

    var freestyle = new wsWrapper("#freestyle",fsBtn,playFsBtn);
    freestyle.name = 'freestyle';
    fsBtn.onclick = function() {
        freestyle.toogleButton(fsBtn);
    }
    playFsBtn.onclick = function(){
        freestyle.audio.play();
    }
    

    const form = document.getElementById('form');
    form.addEventListener('submit', function(e){
        submitForm(e,kick,snare,hh,freestyle);
    }, false);

});

function submitForm(e,kick,snare,hh,fs){
    let initials = document.getElementById('initials').value;
    if(kick){
        console.log(kick);
        let audios = [kick,snare,hh,fs];
        downloadZip(audios,initials)
    }
    e.preventDefault();

}

function downloadZip(audios,initials){
    var zip = new JSZip();
    var count = 0;
    var zipFilename = initials+"_beatbox.zip";

    audios.forEach(function(data){
        console.log("1");
        file = blobToFile(data.audioBlob, data.name);
    // loading a file and add it in a zip file
        zip.file(file.name,file)
        count++;
        if (count == audios.length) {
            zip.generateAsync({type:'blob'}).then(function(content) {
                saveAs(content, zipFilename);
            });
        }
    });
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName + '.wav';
    return theBlob;
}