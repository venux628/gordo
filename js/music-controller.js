/* MEMEBOX background music controller
   Shared by catalog.html and detail.html. Keeps the same track position across page navigation
   and asks for one explicit click only when the browser blocks autoplay. */
(() => {
  const audio = document.getElementById('catalogMusic');
  if (!audio) return;

  const KEY_TIME = 'memebox.music.currentTime';
  const KEY_ENABLED = 'memebox.music.enabled';
  const KEY_VOLUME = 'memebox.music.volume';
  const safeGet = (key) => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { sessionStorage.setItem(key, String(value)); } catch (_) {} };

  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.35;

  // Show a small fallback only if the browser blocks automatic playback.
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
  const wasEnabled = safeGet(KEY_ENABLED) === '1';
  if (Number.isFinite(savedTime) && savedTime >= 0) {
    const restorePosition = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = savedTime % audio.duration;
      }
    };
    if (audio.readyState >= 1) restorePosition();
    else audio.addEventListener('loadedmetadata', restorePosition, { once: true });
  }

  let retrying = false;
  function savePosition() {
    if (Number.isFinite(audio.currentTime)) safeSet(KEY_TIME, audio.currentTime);
  }
  function onPlaySuccess() {
    safeSet(KEY_ENABLED, '1');
    enableButton.style.display = 'none';
    savePosition();
  }
  function showFallback() {
    // Only show the button if the user has previously enabled music or playback was attempted.
    enableButton.style.display = 'inline-flex';
  }
  function tryPlay(fromGesture = false) {
    if (retrying || (!fromGesture && !wasEnabled && safeGet(KEY_ENABLED) !== '1')) {
      // Still make an initial attempt on the first page; if blocked, the first gesture will unlock it.
      if (!fromGesture && safeGet(KEY_ENABLED) !== '1') {
        // Initial autoplay attempt is useful on browsers that permit it.
      } else return;
    }
    retrying = true;
    const promise = audio.play();
    if (promise && typeof promise.then === 'function') {
      promise.then(() => {
        onPlaySuccess();
      }).catch(() => {
        showFallback();
      }).finally(() => { retrying = false; });
    } else {
      onPlaySuccess();
      retrying = false;
    }
  }

  enableButton.addEventListener('click', () => tryPlay(true));
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

  // Try on every page load; browsers that block it will expose the fallback button.
  tryPlay(false);
})();
