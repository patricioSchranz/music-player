// ----------------------
// DOM ELEMENTS

const
    audioPlayer = document.querySelector('audio'),
    playButton = document.querySelector('#play',)
    volumeRange = document.querySelector('.range-wrapper'),
    volumeThumb = document.querySelector('.volume .thumb'),
    currentAudioTimeDisplay = document.querySelector('.music-player_progress_current-time'),
    audioDurationDisplay = document.querySelector('.music-player_progress_duration'),
    progressBar = document.querySelector('.music-player_progress_progress-bar'),
    progressContainer = document.querySelector('.music-player_progress_container')


// ----------------------
// WORK VARIABLES

let 
    isMousePressed = false,
    isPlaying = false


const songs = [
    {
        songURL: 'audio/music_jacinto-1.mp3',
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
        imageURL : 'img/tiger.jpg'
    }
]



// ------------------------
// CALLBACKS

const changeBarState = (bar, event, thumb)=>{
    // => this is needed for a issue when the event.target on the beginning and the end of the event is different
    event.preventDefault();
    
    // event.stopPropagation();

    const 
        widthOfBar = bar.clientWidth,
        {offsetX : currentOffset } = event,
        percentOfOffset = Math.ceil((currentOffset * 100) / widthOfBar)

    // console.log('event target', event.target)
    // console.log(' range offsetX =>', currentOffset)
    // console.log('width of element', widthOfBar)
    // console.log('percent of offset', percentOfOffset)
    // console.log('event', event)

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

        console.log('minutes and seconds', minutes + ':' + restSeconds)
        return {minutes : minutes, seconds : restSeconds}
    }
    else if(seconds < 60){
        seconds = Math.floor(seconds)
        seconds = addLeadingZero(seconds)

        console.log('SECONDS', seconds)

        return seconds
    }

}



// ------------------------
// EVENTS

//
// DOCUMENT LOADED
//

window.addEventListener('load', ()=>{
    console.log(audioPlayer.duration)

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
    // console.log(event)

    let
        {duration, currentTime} = event.target,
        progressPercent = (currentTime * 100) / duration

    currentTime = getRightTimeFormat(currentTime)

    // console.log('the current time', currentTime)
    // console.log('the duration of the current track', duration)
    // console.log('the progress in percent', progressPercent)

    progressBar.style.width = `${progressPercent}%`

    console.log(typeof currentTime)

    if(typeof currentTime ===  'object') { currentAudioTimeDisplay.textContent = `${currentTime.minutes}:${currentTime.seconds}` }
    if(typeof currentTime !==  'object') { currentAudioTimeDisplay.textContent = `0:${currentTime}` }

})


//
// VOLUME BAR
//

volumeRange.addEventListener('mousedown', (event)=>{

    isMousePressed = true
    changeBarState(volumeRange, event, volumeThumb)

    // console.log('mousedown')
    // console.log('isMousePressed', isMousePressed)
})

volumeRange.addEventListener('mouseup', ()=>{
    isMousePressed = false

    // console.log('mousup')
    // console.log('isMousePressed', isMousePressed)
})

volumeRange.addEventListener('mouseleave', ()=>{
    isMousePressed = false
})

volumeRange.addEventListener('mousemove', (event)=>{

    isMousePressed && changeBarState(volumeRange, event, volumeThumb)
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

    // console.log('mousedown')
    // console.log('isMousePressed', isMousePressed)
})

progressContainer.addEventListener('mouseup', ()=>{
    isMousePressed = false

    // console.log('mousup')
    // console.log('isMousePressed', isMousePressed)
})

progressContainer.addEventListener('mouseleave', ()=>{
    isMousePressed = false
})

// progressContainer.addEventListener('mousemove', (event)=>{

//     isMousePressed && changeBarState(progressContainer, event, progressBar)

// })


