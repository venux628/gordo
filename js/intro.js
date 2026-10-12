const questionScreen = document.getElementById('questionScreen');
const reactionScreen = document.getElementById('reactionScreen');
const loadingScreen = document.getElementById('loadingScreen');
const firstAudio = document.getElementById('firstAudio');
const secondAudio = document.getElementById('secondAudio');
const progressBar = document.getElementById('progressBar');
const loadingNote = document.getElementById('loadingNote');
const video = document.getElementById('mascotVideo');

const introBackgroundAudio = new Audio(new URL('audio/intro-video-audio.mp3', document.baseURI).href);
introBackgroundAudio.loop = true;
introBackgroundAudio.volume = 0.35;
introBackgroundAudio.preload = 'auto';

let introBackgroundStarted = false;
let introBackgroundAttemptPending = false;
let introStartRequested = false;
let loadingSequenceStarted = false;
let navigationPending = false;
let firstTrackTimer = 0;
let firstTrackFallbackTimer = 0;

function stopIntroBackground() {
  introBackgroundAudio.pause();
  try { introBackgroundAudio.currentTime = 0; } catch (_) {}
  introBackgroundStarted = false;
}

async function startIntroBackground() {
  if (questionScreen.hidden || introBackgroundStarted) return;
  if (introBackgroundAttemptPending) {
    introStartRequested = true;
    return;
  }

  introStartRequested = false;
  introBackgroundAttemptPending = true;
  try {
    await introBackgroundAudio.play();
    if (questionScreen.hidden) {
      introBackgroundAudio.pause();
      return;
    }
    introBackgroundStarted = true;
  } catch (_) {
    // Se o navegador bloquear o som automático, uma interação tentará novamente.
    introBackgroundStarted = false;
  } finally {
    introBackgroundAttemptPending = false;
    if (introStartRequested && !questionScreen.hidden && !introBackgroundStarted) {
      introStartRequested = false;
      startIntroBackground();
    }
  }
}

function showScreen(screen) {
  questionScreen.hidden = screen !== questionScreen;
  reactionScreen.hidden = screen !== reactionScreen;
  loadingScreen.hidden = screen !== loadingScreen;
}

function clearFirstTrackTimers() {
  window.clearTimeout(firstTrackTimer);
  window.clearTimeout(firstTrackFallbackTimer);
  firstTrackTimer = 0;
  firstTrackFallbackTimer = 0;
}

function finishFirstTrack(message = 'Entrada autorizada. Boa sorte.') {
  if (navigationPending) return;
  navigationPending = true;
  clearFirstTrackTimers();
  firstAudio.removeEventListener('timeupdate', updateProgress);
  firstAudio.removeEventListener('ended', onFirstTrackEnded);
  firstAudio.removeEventListener('error', onFirstTrackError);
  firstAudio.removeEventListener('loadedmetadata', setFirstTrackSafetyTimer);
  firstAudio.removeEventListener('durationchange', setFirstTrackSafetyTimer);
  progressBar.style.width = '100%';
  loadingNote.textContent = message;
  firstAudio.pause();
  window.setTimeout(() => { window.location.href = 'catalog.html'; }, 650);
}

function updateProgress() {
  if (Number.isFinite(firstAudio.duration) && firstAudio.duration > 0) {
    const percent = Math.min(100, (firstAudio.currentTime / firstAudio.duration) * 100);
    progressBar.style.width = percent + '%';
  }
}

function onFirstTrackEnded() {
  finishFirstTrack();
}

function onFirstTrackError() {
  loadingNote.textContent = 'O áudio não carregou. Entrando no catálogo...';
  window.clearTimeout(firstTrackFallbackTimer);
  firstTrackFallbackTimer = window.setTimeout(() => {
    finishFirstTrack('Áudio indisponível. Entrada autorizada.');
  }, 900);
}

function setFirstTrackSafetyTimer() {
  if (!Number.isFinite(firstAudio.duration) || firstAudio.duration <= 0) return;
  window.clearTimeout(firstTrackTimer);
  const safetyMs = Math.min(120000, Math.max(8000, firstAudio.duration * 1000 + 6000));
  firstTrackTimer = window.setTimeout(() => {
    finishFirstTrack('Concluindo entrada...');
  }, safetyMs);
}

function playFirstAndLoad() {
  if (loadingSequenceStarted || navigationPending) return;
  loadingSequenceStarted = true;
  stopIntroBackground();
  showScreen(loadingScreen);
  loadingNote.textContent = 'Preparando o áudio...';
  progressBar.style.width = '0%';
  firstAudio.pause();
  try { firstAudio.currentTime = 0; } catch (_) {}
  clearFirstTrackTimers();

  firstAudio.addEventListener('timeupdate', updateProgress);
  firstAudio.addEventListener('ended', onFirstTrackEnded, { once: true });
  firstAudio.addEventListener('error', onFirstTrackError, { once: true });
  firstAudio.addEventListener('loadedmetadata', setFirstTrackSafetyTimer);
  firstAudio.addEventListener('durationchange', setFirstTrackSafetyTimer);
  // Safety net: a broken or stalled audio file can never trap the user on this screen.
  firstTrackTimer = window.setTimeout(() => {
    finishFirstTrack('O áudio demorou demais. Entrando no catálogo...');
  }, 20000);

  try {
    const playback = firstAudio.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(() => {
        loadingNote.textContent = 'Não foi possível tocar o áudio. Entrando no catálogo...';
        window.clearTimeout(firstTrackFallbackTimer);
        firstTrackFallbackTimer = window.setTimeout(() => {
          finishFirstTrack('Áudio indisponível. Entrada autorizada.');
        }, 1200);
      });
    }
  } catch (_) {
    onFirstTrackError();
  }
}

function continueAfterReaction() {
  if (navigationPending) return;
  loadingSequenceStarted = false;
  playFirstAndLoad();
}

function playReactionAndContinue() {
  if (loadingSequenceStarted || navigationPending) return;
  loadingSequenceStarted = true;
  stopIntroBackground();
  showScreen(reactionScreen);
  secondAudio.pause();
  try { secondAudio.currentTime = 0; } catch (_) {}

  let settled = false;
  let safetyTimer = 0;
  let fallbackTimer = 0;
  const cleanup = () => {
    secondAudio.removeEventListener('ended', onReactionEnded);
    secondAudio.removeEventListener('error', onReactionError);
    secondAudio.removeEventListener('loadedmetadata', resetReactionSafetyTimer);
    window.clearTimeout(safetyTimer);
    window.clearTimeout(fallbackTimer);
  };
  const finishReaction = () => {
    if (settled) return;
    settled = true;
    cleanup();
    continueAfterReaction();
  };
  const onReactionEnded = () => finishReaction();
  const onReactionError = () => {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = window.setTimeout(finishReaction, 700);
  };
  const resetReactionSafetyTimer = () => {
    if (!Number.isFinite(secondAudio.duration) || secondAudio.duration <= 0) return;
    window.clearTimeout(safetyTimer);
    safetyTimer = window.setTimeout(finishReaction, Math.min(90000, secondAudio.duration * 1000 + 4500));
  };

  secondAudio.addEventListener('ended', onReactionEnded);
  secondAudio.addEventListener('error', onReactionError, { once: true });
  secondAudio.addEventListener('loadedmetadata', resetReactionSafetyTimer);
  safetyTimer = window.setTimeout(finishReaction, 15000);

  try {
    const playback = secondAudio.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(() => {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = window.setTimeout(finishReaction, 800);
      });
    }
  } catch (_) {
    fallbackTimer = window.setTimeout(finishReaction, 800);
  }
}

document.getElementById('yesButton').addEventListener('click', playFirstAndLoad);
document.getElementById('noButton').addEventListener('click', playReactionAndContinue);

// The mascot video is decorative, so a playback restriction must not affect the buttons.
if (video) {
  const playMascot = () => {
    const result = video.play();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  };
  video.addEventListener('canplay', playMascot, { once: true });
  if (video.readyState >= 2) playMascot();
}

const unlockIntroAudio = () => {
  if (!questionScreen.hidden) {
    introStartRequested = true;
    startIntroBackground();
  }
};
document.addEventListener('pointerdown', unlockIntroAudio, { passive: true });
document.addEventListener('keydown', unlockIntroAudio);
window.addEventListener('pageshow', () => {
  if (!document.hidden) startIntroBackground();
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) startIntroBackground();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => startIntroBackground(), { once: true });
} else {
  startIntroBackground();
}
