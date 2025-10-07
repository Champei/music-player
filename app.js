const playlist = [
  {
    title: "Sample Melody",
    artist: "SampleLib Free Track",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop"
  },
  {
    title: "Longer Melody",
    artist: "SoundHelix Free Track",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    img: "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?w=600&h=600&fit=crop"
  }
];

const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const artwork = document.getElementById('artwork');

const progress = document.getElementById('progress');
const progressFilled = document.getElementById('progressFilled');
const progressThumb = document.getElementById('progressThumb');
const timeCurrent = document.getElementById('timeCurrent');
const timeDuration = document.getElementById('timeDuration');

let currentIndex = 0;
let isPlaying = false;
let isSeeking = false;

function formatTime(seconds){
  if (!seconds || isNaN(seconds)) return '0:00';
  seconds = Math.floor(seconds);
  const m = Math.floor(seconds/60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function loadTrack(index){
  const item = playlist[index];
  audio.src = item.src;
  titleEl.textContent = item.title;
  artistEl.textContent = item.artist;
  artwork.style.backgroundImage = `url('${item.img}')`;
  progressFilled.style.width = '0%';
  progress.setAttribute('aria-valuenow', 0);
  timeCurrent.textContent = '0:00';
  timeDuration.textContent = '—:—';
  audio.load();
}

function togglePlay(){
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

playBtn.addEventListener('click', () => {
  togglePlay();
});

audio.addEventListener('play', () => {
  isPlaying = true;
  playBtn.classList.add('active');
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';
  playBtn.setAttribute('aria-pressed','true');
});
audio.addEventListener('pause', () => {
  isPlaying = false;
  playBtn.classList.remove('active');
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  playBtn.setAttribute('aria-pressed','false');
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentIndex);
  if (isPlaying) audio.play();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadTrack(currentIndex);
  if (isPlaying) audio.play();
});

audio.addEventListener('timeupdate', () => {
  if (isSeeking) return;
  const { currentTime, duration } = audio;
  if (duration > 0) {
    const pct = (currentTime / duration) * 100;
    progressFilled.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', Math.round(pct));
    progressThumb.style.left = pct + '%';
    timeCurrent.textContent = formatTime(currentTime);
  }
});

audio.addEventListener('loadedmetadata', () => {
  timeDuration.textContent = formatTime(audio.duration);
});

function seekFromEvent(e){
  const rect = progress.getBoundingClientRect();
  let clientX = (e.touches ? e.touches[0].clientX : e.clientX);
  let pct = (clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  if (audio.duration) {
    audio.currentTime = pct * audio.duration;
  }
}

let dragActive = false;

progress.addEventListener('mousedown', (e) => {
  dragActive = true;
  isSeeking = true;
  seekFromEvent(e);
});
window.addEventListener('mousemove', (e) => {
  if (!dragActive) return;
  seekFromEvent(e);
});
window.addEventListener('mouseup', () => {
  if (dragActive) {
    dragActive = false;
    isSeeking = false;
  }
});

progress.addEventListener('touchstart', (e) => {
  dragActive = true;
  isSeeking = true;
  seekFromEvent(e);
}, {passive:true});
window.addEventListener('touchmove', (e) => {
  if (!dragActive) return;
  seekFromEvent(e);
}, {passive:true});
window.addEventListener('touchend', () => {
  if (dragActive) {
    dragActive = false;
    isSeeking = false;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  } else if (e.key === 'ArrowRight') {
    // next 5s
    audio.currentTime = Math.min(audio.duration || 0, (audio.currentTime || 0) + 5);
  } else if (e.key === 'ArrowLeft') {
    audio.currentTime = Math.max(0, (audio.currentTime || 0) - 5);
  } else if (e.key.toLowerCase() === 'n') {
    nextBtn.click();
  } else if (e.key.toLowerCase() === 'p') {
    prevBtn.click();
  }
});

audio.addEventListener('ended', () => {
  nextBtn.click();
});

loadTrack(currentIndex);

