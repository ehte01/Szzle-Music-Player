const musicPlayer = document.querySelector('.music-player');
const musicImg =  document.querySelector('.img-area img');
const musicName =  document.querySelector('.song-details .name');
const musicArtist =  document.querySelector('.song-details .artist');
const mainAudio = document.querySelector('#main-audio');
const playPauseBtn = document.querySelector('.play-pause .fa-play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const progressBar = document.querySelector('.progress-bar');
const progressArea = document.querySelector('.progress-area');
const current = document.querySelector('.current');
const totalDur = document.querySelector('.total-duration');


let musicIndex = 1;
//load music function

window.addEventListener("load",()=>{   //calling loadMusic function once window loaded
    loadMusic(musicIndex);
    playingNow();
});
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb-1].name;
    musicArtist.innerText = allMusic[indexNumb-1].artist;
    musicImg.src = `images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb-1].src}.mp3`;
}

//play music function

function playMusic(){
    let setTitle = document.querySelector('#setP');
    playPauseBtn.classList.add('fa-pause');
    setTitle.setAttribute("title","Pause");
    mainAudio.play();
    playPauseBtn.classList.remove('fa-play');
}

//pause music function

function pauseMusic(){
    let setTitle = document.querySelector('#setP');
    playPauseBtn.classList.add('fa-play');
    mainAudio.pause();
    setTitle.setAttribute("title","Play");
    playPauseBtn.classList.remove('fa-pause');

}

playPauseBtn.addEventListener('click',()=>{
    const isMusicPause = playPauseBtn.classList.contains('fa-pause');

    //if isMusicPause is true then call pauseMusic else call play music

    isMusicPause ? pauseMusic() : playMusic();

    playingNow();
});

function nextMusic(){
    musicIndex++;

    if(musicIndex > allMusic.length){
        musicIndex = 1;
    }
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic(){
    musicIndex--;
    if(musicIndex < 1){
        musicIndex = allMusic.length;
    }

    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//for previous music
prevBtn.addEventListener('click',()=>{
    prevMusic();
});

//for next music
nextBtn.addEventListener('click',()=>{
    nextMusic();
});


//update progressBar based on the current time of music

mainAudio.addEventListener('timeupdate',(e)=>{
    let currTime = e.target.currentTime
    let totalDuration = e.target.duration; // get total duration of song
    let progressWidth = (currTime/totalDuration)*100;
    progressBar.style.width = `${progressWidth}%`;   // % to increase the width based on the progressWidth

    mainAudio.addEventListener('loadeddata',()=>{
        //update currentTime and total duration

        let audioDuation = mainAudio.duration;
        let totalMin = Math.floor(audioDuation/60);
        let totalSec = Math.floor(audioDuation%60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        totalDur.innerText = `${totalMin}:${totalSec}`;
    });
        let currT = mainAudio.currentTime;
        let currentMin = Math.floor(currT/60);
        let currentSec = Math.floor(currT%60);

        if(currentSec<10){
            currentSec = `0${currentSec}`;
        }

        current.innerText = `${currentMin}:${currentSec}`;
});

//let's update the currentTime based on the change in progress bar

progressArea.addEventListener('click',(e)=>{
    let progressWidthVal = progressArea.clientWidth;  // current width of the progress bar
    let clickOffset = e.offsetX;   //getting X offset value
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickOffset/progressWidthVal)*songDuration;
    playMusic();  // if music is paused it will automatically play music
});

// work on repeat Btn

const repeatBtn = document.querySelector('#repeat-plist');

repeatBtn.addEventListener('click', ()=>{

    if(repeatBtn.classList.contains('fa-repeat')){
        repeatBtn.classList.add('fa-arrows-turn-to-dots');
        repeatBtn.classList.remove('fa-repeat');
        repeatBtn.setAttribute("title","Song Looped");
       
    }

    //as repeat-1 font was not free so we have used fa-arrows-turn-to-dots
    else if(repeatBtn.classList.contains('fa-arrows-turn-to-dots')){
        repeatBtn.classList.add('fa-shuffle');
        repeatBtn.classList.remove('fa-arrows-turn-to-dots');
        repeatBtn.setAttribute("title","Playlist Shuffled");
    }
    else if(repeatBtn.classList.contains('fa-shuffle')){
        repeatBtn.classList.add('fa-repeat');
        repeatBtn.classList.remove('fa-shuffle');
        repeatBtn.setAttribute("title","Playlist Looped");
    }
});

//above we only change repeatBtn icon but now we see what to do when current song ended

mainAudio.addEventListener('ended',()=>{
    //we need to change according to icon of repeatBtn

    if(repeatBtn.classList.contains('fa-repeat')){  //if repeat icon is there then play next song
        nextMusic(); 
    }

    //if fa-arrows-turn-to-dots then change currentTime to 0 and start playing from 1st song in playlist
    else if(repeatBtn.classList.contains('fa-arrows-turn-to-dots')){
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
    }

    //if shuffle icon then shuffle then give random numbers and play song based on this number
    else if(repeatBtn.classList.contains('fa-shuffle')){
        let randomIndex = Math.floor((Math.random()*allMusic.length)+1); 

        //if you currently playing a song and again that song comes so you don't want to play it again you want some other song
        do{
            randomIndex = Math.floor((Math.random()*allMusic.length)+1);
        }while(musicIndex == randomIndex);
        musicIndex = randomIndex;
        loadMusic(musicIndex);
        playMusic();
        playingNow();
    }

});

//open playlist

const openPlaylistBtn = document.querySelector('#more-music');
const hideBtn = document.querySelector('#close');
let musicList = document.querySelector('.music-list');

openPlaylistBtn.addEventListener('click',()=>{
    musicList.classList.add("show");     // or musicList.classList.toggle("show");
});

hideBtn.addEventListener('click',()=>{
    musicList.classList.remove("show");
});


const ulTags = document.querySelector('ul');

//lets create li based on array length

for(let i=0; i < allMusic.length;i++){
    
    //as i=0 so in li-index i+1 otherwise it will not detect 1st song
    let liTag = `<li li-index="${i+1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio src="songs/${allMusic[i].src}.mp3" class="${allMusic[i].src}"></audio>
            <span class="audio-duration" id="${allMusic[i].src}">3:40</span>
        </li>`;

    ulTags.insertAdjacentHTML("beforeend",liTag);

    //change audio duration ulTags

    let liAudioTag = ulTags.querySelector(`.${allMusic[i].src}`);
    let liAudioDuration = ulTags.querySelector(`#${allMusic[i].src}`);

    liAudioTag.addEventListener('loadeddata',()=>{
        let audioDuation = liAudioTag.duration;
        let totalMin = Math.floor(audioDuation/60);
        let totalSec = Math.floor(audioDuation%60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }

        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    });
}


//let work on play particular song on clicking the list

const allLiTags = ulTags.querySelectorAll('li');

function playingNow(){
    for(let j=0;j<allLiTags.length;j++){

        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains('playing')){
            allLiTags[j].classList.remove('playing');

            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if(allLiTags[j].getAttribute("li-index")==musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        //adding onclick attribute in all li tags
        allLiTags[j].setAttribute('onclick',"clicked(this)");
    }
}


//lets play list songs

function clicked(element){
    let getListIndex = element.getAttribute('li-index');
    musicIndex = getListIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}