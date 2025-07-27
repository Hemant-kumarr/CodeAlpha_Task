const songs = [
    { title: "Chill Vibes", artist: "Relaxing Sounds", src: "#", duration: "3:45" },
    { title: "Summer Breeze", artist: "Nature Beats", src: "#", duration: "4:12" },
    { title: "City Lights", artist: "Urban Mix", src: "#", duration: "3:28" },
    { title: "Ocean Waves", artist: "Ambient Flow", src: "#", duration: "5:03" },
    { title: "Mountain Echo", artist: "Acoustic Dreams", src: "#", duration: "4:35" }
];

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current');
const totalTime = document.getElementById('total');
const title = document.getElementById('song-title');
const artist = document.getElementById('artist');
const volume = document.getElementById('volume');
const albumCover = document.getElementById('album-cover');
const playlistContainer = document.getElementById('playlist');

let songIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let shuffledIndices = [];
let currentShuffleIndex = 0;

function initializePlayer() {
    createPlaylist();
    loadSong(songs[songIndex]);
    volume.value = 0.5;
    audio.volume = 0.5;
    updatePlaylistHighlight();
}

function createPlaylist() {
    playlistContainer.innerHTML = '';
    songs.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.innerHTML = `
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;
        playlistItem.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
            updatePlaylistHighlight();
        });
        playlistContainer.appendChild(playlistItem);
    });
}

function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === songIndex);
    });
}

function loadSong(song) {
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
    updatePlaylistHighlight();
    
    // Simulate loading for demo (since we don't have actual audio files)
    if (song.src === '#') {
        // Create a silent audio for demo purposes
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.height = 1;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        
        // Simulate duration for demo
        const [minutes, seconds] = song.duration.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        simulateAudioProgress(totalSeconds);
    }
}

function simulateAudioProgress(duration) {
    let currentTimeValue = 0;
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        currentTimeValue += 1;
        const progressPercent = (currentTimeValue / duration) * 100;
        progress.value = progressPercent;
        currentTime.textContent = formatTime(currentTimeValue);
        totalTime.textContent = formatTime(duration);
        
        if (currentTimeValue >= duration) {
            clearInterval(interval);
            handleSongEnd();
        }
    }, 1000);
}

function playSong() {
    if (audio.src && audio.src !== window.location.href + '#') {
        audio.play().catch(() => {
            // Handle play error gracefully
            console.log('Audio play failed, using demo mode');
        });
    }
    
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
    albumCover.classList.add('spinning');
    
    // Start simulation for demo songs
    if (songs[songIndex].src === '#') {
        const [minutes, seconds] = songs[songIndex].duration.split(':').map(Number);
        simulateAudioProgress(minutes * 60 + seconds);
    }
}

function pauseSong() {
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    albumCover.classList.remove('spinning');
}

function nextSong() {
    if (isShuffled) {
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
        songIndex = shuffledIndices[currentShuffleIndex];
    } else {
        songIndex = (songIndex + 1) % songs.length;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

function prevSong() {
    if (isShuffled) {
        currentShuffleIndex = (currentShuffleIndex - 1 + shuffledIndices.length) % shuffledIndices.length;
        songIndex = shuffledIndices[currentShuffleIndex];
    } else {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
    
    if (isShuffled) {
        shuffledIndices = [...Array(songs.length).keys()];
        for (let i = shuffledIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
        }
        currentShuffleIndex = shuffledIndices.indexOf(songIndex);
    }
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    const repeatIcons = ['fa-redo', 'fa-redo', 'fa-redo-alt'];
    const repeatIcon = repeatBtn.querySelector('i');
    
    repeatIcon.className = `fas ${repeatIcons[repeatMode]}`;
    repeatBtn.classList.toggle('active', repeatMode > 0);
    
    if (repeatMode === 2) {
        repeatBtn.style.color = '#ff6b6b';
    } else {
        repeatBtn.style.color = '';
    }
}

function handleSongEnd() {
    if (repeatMode === 2) {
        loadSong(songs[songIndex]);
        playSong();
    } else if (repeatMode === 1 || songIndex < songs.length - 1) {
        nextSong();
    } else {
        pauseSong();
        progress.value = 0;
        currentTime.textContent = '0:00';
    }
}

// Event Listeners
playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTime.textContent = formatTime(audio.currentTime);
        totalTime.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener('ended', handleSongEnd);

progress.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

volume.addEventListener('input', () => {
    audio.volume = volume.value;
    const volumeIcon = document.querySelector('.volume-container i:first-child');
    if (volume.value == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume.value < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            isPlaying ? pauseSong() : playSong();
            break;
        case 'ArrowRight':
            nextSong();
            break;
        case 'ArrowLeft':
            prevSong();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volume.value = Math.min(1, parseFloat(volume.value) + 0.1);
            audio.volume = volume.value;
            break;
        case 'ArrowDown':
            e.preventDefault();
            volume.value = Math.max(0, parseFloat(volume.value) - 0.1);
            audio.volume = volume.value;
            break;
    }
});

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Initialize the player
initializePlayer();
