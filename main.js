
document.addEventListener('DOMContentLoaded', function() {
    let step1 = document.querySelector("#step-1")
    let step2 = document.querySelector("#step-2")
    let step3 = document.querySelector("#step-3")
    let step4 = document.querySelector("#step-4")
    let next1 = document.querySelector('#next-1');
    let back2 = document.querySelector('#back-2'); 
    let next2 = document.querySelector('#next-2'); 
    let back3 = document.querySelector('#back-3'); 
    let next3 = document.querySelector('#next-3'); 
    let back4 = document.querySelector('#back-4'); 

    next1.onclick = function(){
        step1.style.display = "none";
        step2.style.display = "block";
    }
    back2.onclick = function(){
        step1.style.display = "block";
        step2.style.display = "none";
    }
    next2.onclick = function(){
        step2.style.display = "none";
        step3.style.display = "block";
    }
    back3.onclick = function(){
        step2.style.display = "block";
        step3.style.display = "none";
    }
    next3.onclick = function(){
        step3.style.display = "none";
        step4.style.display = "block";
    }
    back4.onclick = function(){
        step3.style.display = "block";
        step4.style.display = "none";
    }

    //Second page 
    let kickBtn = document.querySelector('#kickBtn');
    let playKickBtn = document.querySelector('#playKickBtn');
    let snareBtn = document.querySelector('#snareBtn');
    let playSnareBtn = document.querySelector('#playSnareBtn');
    let hhBtn = document.querySelector('#hhBtn');
    let playHhBtn = document.querySelector('#playHhBtn');
    let fsBtn = document.querySelector('#fsBtn');
    let playFsBtn = document.querySelector('#playFsBtn');

    var kick = new wsWrapper("#kick",kickBtn,playKickBtn);
    kick.name = 'Kick';
    window.kick = kick;
    kickBtn.onclick = function() {
        kick.toogleButton(kickBtn);
    }
    playKickBtn.onclick = function(){
        kick.audio.play();
    }

    var snare = new wsWrapper("#snare",snareBtn,playSnareBtn);
    snare.name = 'Snare';
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
    freestyle.name = 'Freestyle';
    fsBtn.onclick = function() {
        freestyle.toogleButton(fsBtn);
    }
    playFsBtn.onclick = function(){
        freestyle.audio.play();
    }
    
    //Third page
    const form = document.getElementById('form');
    form.addEventListener('submit', function(e){
        submitForm(e,kick,snare,hh,freestyle);
    }, false);

});

function submitForm(e,kick,snare,hh,fs){
    e.preventDefault();
    var initials = document.getElementById('initials').value;
    var age = document.getElementById('age').value;
    var micro = document.getElementById('microphone').value;
    var gender = "";

    var radios = document.getElementsByName('gender');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            gender = radios[i].value;
            break;
        }
    }
    if(kick.audioBlob && snare.audioBlob && hh.audioBlob && fs.audioBlob){
        let audios = [kick,snare,hh,fs];
        downloadZip(audios,initials,age,micro,gender)
    } else{
        alert("Some sounds are missing. Please check the previous page.")
    }
}

//https://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
function downloadZip(audios,initials,age,micro,gender){
    var zip = new JSZip();
    var count = 0;
    var zipFilename = initials+"_"+Date.now()+".zip";
    var log = "Initials: " + initials+"\n"+ 
                "Gender: " + gender+"\n"+ 
                "Age: " + age+"\n"+ 
                "Microphone: " + micro+"\n";

    audios.forEach(function(data){
        file = blobToFile(data.audioBlob, data.name,initials);
    // loading a file and add it in a zip file
        zip.file(file.name,file)
        count++;
        if (count == audios.length) {
            zip.file("log.txt",log)
            zip.generateAsync({type:'blob'}).then(function(content) {
               saveAs(content, zipFilename);
            });
        }
    });
}

function blobToFile(theBlob, fileName,initials){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    let type = theBlob.type;
    let extension = type.substr(type.lastIndexOf('/')+1);
    theBlob.name = fileName+"_"+initials+'.wav';
    return theBlob;
}