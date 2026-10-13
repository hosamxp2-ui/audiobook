const audioPlayer = document.getElementById('audio-player');
const chapterTitle = document.getElementById('chapter-title');
const statusBadge = document.getElementById('status-badge');
const trackList = document.getElementById('track-list');
const speedSelect = document.getElementById('speed-select');
const timerSelect = document.getElementById('timer-select');
const timerStatus = document.getElementById('timer-status');

const fileInput = document.getElementById('file-input');
const folderInput = document.getElementById('folder-input');
const btnClearProgress = document.getElementById('btn-clear-progress');

const btnRewind = document.getElementById('btn-rewind');
const btnForward = document.getElementById('btn-forward');

let playlist = [];
let currentTrackIndex = 0;
let sleepTimerInterval = null;
let stopAtChapterEnd = false;

fileInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
folderInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));

function handleFiles(files) {
    const audioFiles = files
        .filter(f => f.type.startsWith('audio/') || f.name.match(/\.(mp3|m4a|aac|ogg|wav)$/i))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    if (audioFiles.length === 0) return;

    playlist = audioFiles.map(file => ({
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file),
        file: file
    }));

    currentTrackIndex = 0;
    renderPlaylist();
    playTrack(0);
}

function getTrackProgress(title) {
    const savedTime = parseFloat(localStorage.getItem(`audio_pos_${title}`) || "0");
    const isCompleted = localStorage.getItem(`audio_done_${title}`) === "true";
    return { savedTime, isCompleted };
}

function renderPlaylist() {
    trackList.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        const { savedTime, isCompleted } = getTrackProgress(track.title);

        if (index === currentTrackIndex) li.classList.add('active');

        const nameSpan = document.createElement('span');
        nameSpan.className = 'track-name';
        nameSpan.textContent = track.title;

        const statusSpan = document.createElement('span');
        statusSpan.className = 'track-status';

        if (isCompleted) {
            statusSpan.textContent = '✔ مكتمل';
            statusSpan.style.color = '#10b981';
        } else if (savedTime > 5) {
            const mins = Math.floor(savedTime / 60);
            statusSpan.textContent = `⏸ عند ${mins} د`;
            statusSpan.style.color = '#f59e0b';
        } else {
            statusSpan.textContent = 'جديد';
            statusSpan.style.color = '#9ca3af';
        }

        li.appendChild(nameSpan);
        li.appendChild(statusSpan);
        li.addEventListener('click', () => playTrack(index));
        trackList.appendChild(li);
    });
}

function playTrack(index) {
    if (playlist.length === 0) return;
    
    currentTrackIndex = index;
    const track = playlist[index];
    chapterTitle.textContent = track.title;
    audioPlayer.src = track.url;

    const { savedTime, isCompleted } = getTrackProgress(track.title);

    if (savedTime && !isCompleted) {
        audioPlayer.currentTime = savedTime;
    } else if (isCompleted) {
        audioPlayer.currentTime = 0;
    }

    updateBadge(isCompleted, savedTime);
    audioPlayer.play();
    renderPlaylist();
    updateMediaSession(track.title);
}

function updateBadge(isCompleted, currentTime) {
    if (isCompleted) {
        statusBadge.textContent = "✔ مكتمل";
        statusBadge.className = "badge completed";
    } else if (currentTime > 5) {
        statusBadge.textContent = "🎧 جاري الاستماع";
        statusBadge.className = "badge playing";
    } else {
        statusBadge.textContent = "جديد";
        statusBadge.className = "badge";
    }
}

audioPlayer.addEventListener('timeupdate', () => {
    if (!playlist[currentTrackIndex]) return;
    const title = playlist[currentTrackIndex].title;
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    if (currentTime > 0) {
        localStorage.setItem(`audio_pos_${title}`, currentTime);
        
        if (duration > 0 && (currentTime / duration) >= 0.95) {
            localStorage.setItem(`audio_done_${title}`, "true");
            updateBadge(true, currentTime);
        } else {
            updateBadge(false, currentTime);
        }
    }
});

audioPlayer.addEventListener('ended', () => {
    if (playlist[currentTrackIndex]) {
        const title = playlist[currentTrackIndex].title;
        localStorage.setItem(`audio_done_${title}`, "true");
    }

    renderPlaylist();

    if (stopAtChapterEnd) {
        clearSleepTimer();
        timerStatus.textContent = "توقف المشغل بنهاية الفصل.";
        return;
    }

    if (currentTrackIndex < playlist.length - 1) {
        playTrack(currentTrackIndex + 1);
    }
});

btnClearProgress.addEventListener('click', () => {
    if (confirm("هل تريد إعادة ضبط حالة الاستماع والتوقف لجميع الفصول؟")) {
        playlist.forEach(track => {
            localStorage.removeItem(`audio_pos_${track.title}`);
            localStorage.removeItem(`audio_done_${track.title}`);
        });
        renderPlaylist();
        if (playlist[currentTrackIndex]) {
            updateBadge(false, 0);
        }
    }
});

btnRewind.addEventListener('click', () => audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10));
btnForward.addEventListener('click', () => audioPlayer.currentTime = Math.min(audioPlayer.duration || 0, audioPlayer.currentTime + 10));
speedSelect.addEventListener('change', (e) => audioPlayer.playbackRate = parseFloat(e.target.value));

timerSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    clearSleepTimer();

    if (value === "end") {
        stopAtChapterEnd = true;
        timerStatus.textContent = "سيتم الإيقاف عند نهاية الفصل الحالي.";
    } else if (parseInt(value) > 0) {
        stopAtChapterEnd = false;
        let totalSeconds = parseInt(value) * 60;

        sleepTimerInterval = setInterval(() => {
            totalSeconds--;
            const mins = Math.floor(totalSeconds / 60);
            const secs = totalSeconds % 60;
            timerStatus.textContent = `سيتم الإيقاف خلال: ${mins}:${secs < 10 ? '0' : ''}${secs}`;

            if (totalSeconds <= 0) {
                clearSleepTimer();
                audioPlayer.pause();
                timerStatus.textContent = "تم إيقاف التشغيل بواسطة المؤقت.";
            }
        }, 1000);
    }
});

function clearSleepTimer() {
    clearInterval(sleepTimerInterval);
    stopAtChapterEnd = false;
    timerStatus.textContent = "";
}

function updateMediaSession(title) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            album: 'كتاب صوتي',
            artist: 'مشغل PWA'
        });

        navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
        navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
        navigator.mediaSession.setActionHandler('seekbackward', () => audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10));
        navigator.mediaSession.setActionHandler('seekforward', () => audioPlayer.currentTime = Math.min(audioPlayer.duration || 0, audioPlayer.currentTime + 10));
        navigator.mediaSession.setActionHandler('previoustrack', () => { if (currentTrackIndex > 0) playTrack(currentTrackIndex - 1); });
        navigator.mediaSession.setActionHandler('nexttrack', () => { if (currentTrackIndex < playlist.length - 1) playTrack(currentTrackIndex + 1); });
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW failed: ', err));
    });
}