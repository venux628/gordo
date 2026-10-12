const questionScreen = document.getElementById('questionScreen');
const reactionScreen = document.getElementById('reactionScreen');
const loadingScreen = document.getElementById('loadingScreen');
const firstAudio = document.getElementById('firstAudio');
const secondAudio = document.getElementById('secondAudio');
const progressBar = document.getElementById('progressBar');
const loadingNote = document.getElementById('loadingNote');

// Música de fundo da tela inicial.
const introBackgroundAudio = new Audio(new URL('audio/intro-video-audio.mp3', document.baseURI).href);
introBackgroundAudio.loop = true;
introBackgroundAudio.volume = 0.35;
introBackgroundAudio.preload = 'auto';
let introBackgroundStarted = false;
let introBackgroundAttemptPending = false;

async function startIntroBackground() {
  if (introBackgroundStarted || introBackgroundAttemptPending || questionScreen.hidden) return;
  introBackgroundAttemptPending = true;
  try {
    await introBackgroundAudio.play();
    introBackgroundStarted = true;
  } catch (error) {
    // Chrome/Edge/Safari podem bloquear áudio com som até existir interação do usuário.
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

// Tenta assim que o documento carrega e quando a aba volta a ficar visível.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startIntroBackground, { once: true });
} else {
  startIntroBackground();
}
window.addEventListener('pageshow', startIntroBackground);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) startIntroBackground();
});

// Se o navegador bloquear o autoplay, a primeira interação libera a reprodução.
const unlockIntroAudio = () => {
  if (!questionScreen.hidden) startIntroBackground();
};
document.addEventListener('pointerdown', unlockIntroAudio, { passive: true });
document.addEventListener('keydown', unlockIntroAudio);

function showScreen(screen) {
  questionScreen.hidden = screen !== questionScreen;
  reactionScreen.hidden = screen !== reactionScreen;
  loadingScreen.hidden = screen !== loadingScreen;
}
function goToLoading() {
  showScreen(loadingScreen);
  loadingNote.textContent = 'Carregando consequências...';
  progressBar.style.width = '0%';
  const update = () => {
    if (Number.isFinite(firstAudio.duration) && firstAudio.duration > 0) {
      progressBar.style.width = `${Math.min(100, firstAudio.currentTime / firstAudio.duration * 100)}%`;
    }
  };
  firstAudio.addEventListener('timeupdate', update);
  firstAudio.addEventListener('ended', () => {
    firstAudio.removeEventListener('timeupdate', update);
    progressBar.style.width = '100%';
    loadingNote.textContent = 'Entrada autorizada. Boa sorte.';
    window.setTimeout(() => { window.location.href = 'catalog.html'; }, 700);
  }, { once: true });
}
function playFirstAndLoad() {
  stopIntroBackground();
  showScreen(loadingScreen);
  progressBar.style.width = '0%';
  firstAudio.currentTime = 0;
  const playPromise = firstAudio.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      loadingNote.textContent = 'O navegador bloqueou o áudio. Clique para tentar novamente.';
      const retry = () => { firstAudio.play().then(goToLoading).catch(() => {}); };
      loadingScreen.addEventListener('click', retry, { once: true });
    });
  }
  goToLoading();
}
document.getElementById('yesButton').addEventListener('click', playFirstAndLoad);
document.getElementById('noButton').addEventListener('click', () => {
  stopIntroBackground();
  showScreen(reactionScreen);
  secondAudio.currentTime = 0;
  secondAudio.play().then(() => {
    secondAudio.addEventListener('ended', () => {
      playFirstAndLoad();
    }, { once: true });
  }).catch(() => {
    // Se o navegador bloquear o áudio, ainda mantém a brincadeira e segue para a sequência.
    window.setTimeout(playFirstAndLoad, 1600);
  });
});

// O vídeo já foi processado com transparência (WebM/VP9 alpha), então não precisa de chroma key no navegador.
const video = document.getElementById('mascotVideo');
video.addEventListener('canplay', () => video.play().catch(() => {}));
