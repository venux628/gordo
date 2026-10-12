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
let loadingSequenceStarted = false;

async function startIntroBackground() {
  if (introBackgroundStarted || introBackgroundAttemptPending || questionScreen.hidden) return;
  introBackgroundAttemptPending = true;
  try {
    await introBackgroundAudio.play();
    introBackgroundStarted = true;
  } catch (_) {
    // Navegadores podem bloquear autoplay com som até haver interação.
    introBackgroundStarted = false;
  } finally {
    introBackgroundAttemptPending = false;
  }
}

function stopIntroBackground() {
  introBackgroundAudio.pause();
  introBackgroundAudio.currentTime = 0;
  introBackgroundStarted = false;
}

function showScreen(screen) {
  questionScreen.hidden = screen !== questionScreen;
  reactionScreen.hidden = screen !== reactionScreen;
  loadingScreen.hidden = screen !== loadingScreen;
}

function goToLoading() {
  showScreen(loadingScreen);
  loadingNote.textContent = 'Carregando consequências...';
  progressBar.style.width = '0%';

  const updateProgress = () => {
    if (Number.isFinite(firstAudio.duration) && firstAudio.duration > 0) {
      const percent = Math.min(100, (firstAudio.currentTime / firstAudio.duration) * 100);
      progressBar.style.width = percent + '%';
    }
  };

  const finish = () => {
    firstAudio.removeEventListener('timeupdate', updateProgress);
    firstAudio.removeEventListener('ended', finish);
    progressBar.style.width = '100%';
    loadingNote.textContent = 'Entrada autorizada. Boa sorte.';
    window.setTimeout(() => {
      window.location.href = 'catalog.html';
    }, 700);
  };

  firstAudio.addEventListener('timeupdate', updateProgress);
  firstAudio.addEventListener('ended', finish, { once: true });
  updateProgress();
}

async function playFirstAndLoad() {
  if (loadingSequenceStarted) return;
  loadingSequenceStarted = true;
  stopIntroBackground();
  showScreen(loadingScreen);
  loadingNote.textContent = 'Preparando o áudio...';
  progressBar.style.width = '0%';
  firstAudio.pause();
  firstAudio.currentTime = 0;

  try {
    await firstAudio.play();
    goToLoading();
  } catch (_) {
    loadingSequenceStarted = false;
    loadingNote.textContent = 'O navegador bloqueou o áudio. Clique aqui para tentar novamente.';
    loadingScreen.addEventListener('click', playFirstAndLoad, { once: true });
  }
}

document.getElementById('yesButton').addEventListener('click', playFirstAndLoad);

document.getElementById('noButton').addEventListener('click', async () => {
  if (loadingSequenceStarted) return;
  stopIntroBackground();
  showScreen(reactionScreen);
  secondAudio.pause();
  secondAudio.currentTime = 0;

  const continueToHymn = () => playFirstAndLoad();
  secondAudio.addEventListener('ended', continueToHymn, { once: true });

  try {
    await secondAudio.play();
  } catch (_) {
    secondAudio.removeEventListener('ended', continueToHymn);
    // Mesmo se o navegador bloquear o áudio, a sequência não fica travada.
    window.setTimeout(continueToHymn, 1600);
  }
}

// O MP4 é reproduzido sem som; a trilha da entrada é controlada separadamente.
if (video) {
  video.addEventListener('canplay', () => {
    video.play().catch(() => {});
  });
}

const unlockIntroAudio = () => {
  if (!questionScreen.hidden) startIntroBackground();
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
  document.addEventListener('DOMContentLoaded', startIntroBackground, { once: true });
} else {
  startIntroBackground();
}
