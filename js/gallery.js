const gallery = document.getElementById('gallery');
const empty = document.getElementById('empty');
const search = document.getElementById('search');
const count = document.getElementById('count');
const items = Array.isArray(window.MEME_IMAGES) ? window.MEME_IMAGES : [];
const isVideoItem = item => item.type === 'video' || /\.(mp4|webm|mov|m4v)(?:$|\?)/i.test(item.src || '');
function renderGallery() {
  const query = search.value.trim().toLocaleLowerCase('pt-BR');
  const visible = items.filter(item => (item.title || item.src.split('/').pop()).toLocaleLowerCase('pt-BR').includes(query));
  gallery.innerHTML = '';
  count.textContent = items.length;
  empty.hidden = items.length > 0;
  gallery.hidden = visible.length === 0;
  visible.forEach(item => {
    const title = item.title || decodeURIComponent(item.src.split('/').pop()).replace(/\.[^.]+$/, '');
    const video = isVideoItem(item);
    const card = document.createElement('article');
    card.className = 'meme-card';
    const open = document.createElement('a');
    open.className = 'meme-open';
    open.href = `detail.html?src=${encodeURIComponent(item.src)}&title=${encodeURIComponent(title)}&type=${video ? 'video' : 'image'}`;
    let media;
    if (video) {
      media = document.createElement('video');
      media.src = item.src;
      media.muted = true;
      media.loop = true;
      media.autoplay = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.setAttribute('aria-label', title);
    } else {
      media = document.createElement('img');
      media.src = item.src;
      media.alt = title;
      media.loading = 'lazy';
    }
    media.addEventListener('error', () => { card.remove(); });
    open.append(media);
    const caption = document.createElement('div');
    caption.className = 'meme-caption';
    const label = document.createElement('b');
    label.textContent = title;
    const tag = document.createElement('span');
    tag.textContent = video ? 'ASSISTIR ▶' : 'ABRIR ↗';
    caption.append(label, tag);
    card.append(open, caption);
    gallery.append(card);
  });
}
search.addEventListener('input', renderGallery);
renderGallery();
