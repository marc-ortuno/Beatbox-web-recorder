
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
    kickBtn.onclick = function() {
        kick.toogleButton(kickBtn);
    }
    playKickBtn.onclick = function(){
        kick.audio.play();
    }

    var snare = new wsWrapper("#snare",snareBtn,playSnareBtn);
    snareBtn.onclick = function() { 
        snare.toogleButton(snareBtn);
    }
    playSnareBtn.onclick = function(){
        snare.audio.play();
    }

    var hh = new wsWrapper("#hh",hhBtn,playHhBtn);
    hhBtn.onclick = function() {
        hh.toogleButton(hhBtn);
    }
    playHhBtn.onclick = function(){
        hh.audio.play();
    }

    var freestyle = new wsWrapper("#freestyle",fsBtn,playFsBtn);
    fsBtn.onclick = function() {
        freestyle.toogleButton(fsBtn);
    }
    playFsBtn.onclick = function(){
        freestyle.audio.play();
    }
    


    
});