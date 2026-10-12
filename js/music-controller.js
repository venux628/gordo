/* MEMEBOX background music controller.
   Persists playback position across catalog/detail navigation and retries safely
   after a real user gesture when a browser blocks autoplay. */
(() => {
  const audio = document.getElementById('catalogMusic');
  if (!audio) return;

  const KEY_TIME = 'memebox.music.currentTime';
  const KEY_ENABLED = 'memebox.music.enabled';
  const safeGet = key => {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  };
  const safeSet = (key, value) => {
    try { sessionStorage.setItem(key, String(value)); } catch (_) {}
  };

  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.35;

  let enableButton = document.getElementById('musicEnableButton');
  if (!enableButton) {
    enableButton = document.createElement('button');
    enableButton.id = 'musicEnableButton';
    enableButton.type = 'button';
    enableButton.textContent = '♫ Ativar música';
    enableButton.setAttribute('aria-label', 'Ativar música de fundo');
    Object.assign(enableButton.style, {
      position: 'fixed', right: '16px', bottom: '16px', zIndex: '9999',
      display: 'none', padding: '10px 14px', borderRadius: '999px',
      border: '1px solid #c8ff35', background: '#c8ff35', color: '#151515',
      font: '600 13px system-ui, sans-serif', cursor: 'pointer',
      boxShadow: '0 4px 18px rgba(0,0,0,.25)'
    });
    document.body.appendChild(enableButton);
  }

  const savedTime = Number(safeGet(KEY_TIME));
  if (Number.isFinite(savedTime) && savedTime >= 0) {
    const restorePosition = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        try { audio.currentTime = savedTime % audio.duration; } catch (_) {}
      }
    };
    if (audio.readyState >= 1) restorePosition();
    else audio.addEventListener('loadedmetadata', restorePosition, { once: true });
  }

  let attemptPending = false;
  let gestureWaiting = false;

  function savePosition() {
    if (Number.isFinite(audio.currentTime)) safeSet(KEY_TIME, audio.currentTime);
  }

  function onPlaySuccess() {
    safeSet(KEY_ENABLED, '1');
    enableButton.style.display = 'none';
    savePosition();
  }

  function showFallback() {
    enableButton.style.display = 'inline-flex';
  }

  function tryPlay(fromGesture = false) {
    if (!audio.paused) {
      onPlaySuccess();
      return;
    }
    if (attemptPending) {
      // Do not lose the first click if the initial autoplay attempt is still settling.
      if (fromGesture) gestureWaiting = true;
      return;
    }

    attemptPending = true;
    let playback;
    try {
      playback = audio.play();
    } catch (_) {
      attemptPending = false;
      showFallback();
      retryIfGestureWasWaiting();
      return;
    }

    Promise.resolve(playback).then(() => {
      onPlaySuccess();
    }).catch(() => {
      showFallback();
    }).finally(() => {
      attemptPending = false;
      retryIfGestureWasWaiting();
    });
  }

  function retryIfGestureWasWaiting() {
    if (!gestureWaiting) return;
    gestureWaiting = false;
    if (audio.paused) tryPlay(true);
  }

  enableButton.addEventListener('click', () => tryPlay(true));
  audio.addEventListener('playing', onPlaySuccess);
  audio.addEventListener('error', showFallback);

  const gestureRetry = () => {
    if (audio.paused) tryPlay(true);
  };
  document.addEventListener('pointerdown', gestureRetry, { passive: true });
  document.addEventListener('keydown', gestureRetry);
  document.addEventListener('touchstart', gestureRetry, { passive: true });

  audio.addEventListener('timeupdate', savePosition);
  window.addEventListener('pagehide', savePosition);
  window.addEventListener('beforeunload', savePosition);
  window.addEventListener('pageshow', () => {
    if (audio.paused) tryPlay(false);
  });

  // Try on load; if autoplay is blocked, show a clear button instead of failing silently.
  tryPlay(false);
})();
