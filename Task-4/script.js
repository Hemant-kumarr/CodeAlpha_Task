const songs = [
    { title: "First Song", artist: "Artist A", src: "song1.mp3" },
    { title: "Second Song", artist: "Artist B", src: "song2.mp3" }
];

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current');
const totalTime = document.getElementById('total');
const title = document.getElementById('song-title');
const artist = document.getElementById('artist');
const volume = document.getElementById('volume');

let songIndex = 0;
let isPlaying = false;

function loadSong(song) {
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
}

function playSong() {
    audio.play();
    playBtn.textContent = 'Pause';
    isPlaying = true;
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = 'Play';
    isPlaying = false;
}

function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
}

function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
}

playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

audio.addEventListener('timeupdate', () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTime.textContent = formatTime(audio.currentTime);
    totalTime.textContent = formatTime(audio.duration);
});

progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener('input', () => {
    audio.volume = volume.value;
});

// Initial load
loadSong(songs[songIndex]);
volume.value = 0.5;
audio.volume = 0.5;

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}
