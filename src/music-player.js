// ----------------------
// DOM ELEMENTS

const
    audioPlayer = document.querySelector('audio'),
    playButton = document.querySelector('#play'),
    nextButton = document.querySelector('#next'),
    previousButton = document.querySelector('#prev'),
    volumeRange = document.querySelector('.range-wrapper'),
    volumeThumb = document.querySelector('.volume .thumb'),
    volumeIcon = document.querySelector('.volume i'),
    songNameDisplay = document.querySelector('.music-player_header_song-title'),
    componistDisplay = document.querySelector('.music-player_header_componist'),
    imageDisplay = document.querySelector('.music-player_header_img'),
    currentAudioTimeDisplay = document.querySelector('.music-player_progress_current-time'),
    audioDurationDisplay = document.querySelector('.music-player_progress_duration'),
    progressBar = document.querySelector('.music-player_progress_progress-bar'),
    progressContainer = document.querySelector('.music-player_progress_container')


// ----------------------
// WORK VARIABLES

let 
    isMousePressed = false,
    isPlaying = false,
    currentSongIndex = 0,
    isMuted = false,
    volumeSnapshot = undefined


const songs = [
    {
        songURL: './audio/music_jacinto-1.mp3',
        artist: 'Jacinto Design',
        displayName : 'Electric Chill Machine',
        imageURL : 'img/eagle.jpg'
    },
    {
        songURL: 'audio/music_jacinto-2.mp3',
        artist: 'Jacinto Design',
        displayName : 'Seven Nation Army (Remix)',
        imageURL : 'img/drops.jpg'
    },
    {
        songURL: 'audio/jacinto-3.mp3',
        artist: 'Jacinto Design',
        displayName : 'Goodnight, Disco Queen',
        imageURL : 'img/tiger.jpg'
    },
    {
        songURL: 'audio/metric-1.mp3',
        artist: 'Metric/Jacinto Design',
        displayName : 'Front Row (Remix)',
        imageURL : 'img/hands.jpg'
    }
]



// ------------------------
// CALLBACKS

const changeBarState = (bar, event, thumb)=>{
    // => this is needed for a issue when the event.target on the beginning and the end of the event is different
    event.preventDefault();

    const 
        widthOfBar = bar.clientWidth,
        {offsetX : currentOffset } = event,
        percentOfOffset = Math.ceil((currentOffset * 100) / widthOfBar)

    thumb.style.width = `${percentOfOffset}%`
}

const addLeadingZero = (time)=>{
    return time.toString().padStart(2, '0')
}

const getRightTimeFormat = (seconds)=>{

    if(seconds >= 60){
        let
            minutes = seconds/60,
            restSeconds = seconds % 60
            
        minutes = Math.floor(minutes)
        restSeconds = addLeadingZero(Math.floor(restSeconds))

        return {minutes : minutes, seconds : restSeconds}
    }
    else if(seconds < 60){
        seconds = Math.floor(seconds)
        seconds = addLeadingZero(seconds)

        return seconds
    }

}

const setTrack = (index)=>{
    const 
        {songURL, artist, displayName, imageURL} = songs[index]

    audioPlayer.src = songURL
    songNameDisplay.textContent = displayName
    componistDisplay.textContent = artist
    imageDisplay.src = imageURL
}

const setVolume = ()=>{
    const selectedVolume = parseInt(volumeThumb.style.width.replace('%', '')) / 100

    audioPlayer.volume = selectedVolume

    if(selectedVolume === 0){
        isMuted = true
        volumeIcon.classList.replace('fa-volume-high', 'fa-volume-xmark')
    }
    else{
        isMuted = false
        volumeIcon.classList.replace('fa-volume-xmark', 'fa-volume-high')
    }
}



// ------------------------
// EVENTS

//
// DOCUMENT LOADED
//

window.addEventListener('load', ()=>{

    setTrack(currentSongIndex)

    volumeThumb.style.width = '70%'
    
    setVolume()
})


//
// AUDIO LOADED
//

audioPlayer.addEventListener('canplay', ()=>{
    let {duration} = audioPlayer

    duration = getRightTimeFormat(duration)

    if(typeof duration === 'object'){ audioDurationDisplay.textContent = `${duration.minutes}:${duration.seconds}` }
    if(typeof duration !== 'object'){ audioDurationDisplay.textContent = `00:${duration}` }
    
})


//
// PLAY
//

playButton.addEventListener('click', ()=>{
    if(!isPlaying){

        audioPlayer.play()
        isPlaying = true
      
        playButton.classList.replace('fa-play', 'fa-pause')
        playButton.setAttribute('title', 'pause')
    }
    else if(isPlaying){

        audioPlayer.pause()
        isPlaying = false

        playButton.classList.replace('fa-pause', 'fa-play')
        playButton.setAttribute('title', 'play')
    }
})

audioPlayer.addEventListener('timeupdate', (event)=>{
    let
        {duration, currentTime} = event.target,
        progressPercent = (currentTime * 100) / duration

    currentTime = getRightTimeFormat(currentTime)

    progressBar.style.width = `${progressPercent}%`

    if(typeof currentTime ===  'object') { currentAudioTimeDisplay.textContent = `${currentTime.minutes}:${currentTime.seconds}` }
    if(typeof currentTime !==  'object') { currentAudioTimeDisplay.textContent = `0:${currentTime}` }

})


//
// VOLUME BAR
//

volumeRange.addEventListener('mousedown', (event)=>{

    isMousePressed = true
    changeBarState(volumeRange, event, volumeThumb)
    setVolume()

})

volumeRange.addEventListener('mouseup', ()=>{
    isMousePressed = false
})

volumeRange.addEventListener('mouseleave', ()=>{
    isMousePressed = false
})

volumeRange.addEventListener('mousemove', (event)=>{
    if(isMousePressed) {
        changeBarState(volumeRange, event, volumeThumb)
        setVolume()
    } 
})



//
// VOLUME ICON
//

volumeIcon.addEventListener('click', ()=>{
    isMuted = !isMuted

    // console.log('snapshot', volumeSnapshot)

    if(isMuted){
        volumeSnapshot = volumeThumb.style.width
        volumeIcon.classList.replace('fa-volume-high', 'fa-volume-xmark')
        volumeThumb.style.width = '0%'
        setVolume()
    }
    else{
        volumeIcon.classList.replace('fa-volume-xmark', 'fa-volume-high')
        volumeThumb.style.width = volumeSnapshot ?? '70%'
        setVolume()
    }
     
})

//
// PROGRESS BAR
//

progressContainer.addEventListener('mousedown', (event)=>{

    isMousePressed = true
    changeBarState(progressContainer, event, progressBar)

    const 
        currentAudioPlayPercent = parseFloat(progressBar.style.width.replace('%', ''))
        clickedAudioTime = (currentAudioPlayPercent / 100) * audioPlayer.duration
    
    audioPlayer.currentTime = clickedAudioTime
})

progressContainer.addEventListener('mouseup', ()=>{
    isMousePressed = false
})

progressContainer.addEventListener('mouseleave', ()=>{
    isMousePressed = false
})


//
// CHANGE TRACK
//

nextButton.addEventListener('click', ()=>{
    

    if(currentSongIndex < songs.length -1){
        currentSongIndex++
    }
    else{
        currentSongIndex = 0
    }

    setTrack(currentSongIndex)
    if(isPlaying) {audioPlayer.play()}
})

previousButton.addEventListener('click', ()=>{

    if(currentSongIndex >= 1){
        currentSongIndex--
    }
    else{
        currentSongIndex = songs.length -1
    }

    setTrack(currentSongIndex)
    if(isPlaying) {audioPlayer.play()}
})



