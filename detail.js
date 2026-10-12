const params = new URLSearchParams(location.search);
const src = params.get('src');
const mediaType = params.get('type') === 'video' || /\.(mp4|webm|mov|m4v)(?:$|\?)/i.test(src || '') ? 'video' : 'image';
const title = params.get('title') || 'Meu meme';
const img = document.getElementById('mainImage');
const video = document.getElementById('mainVideo');
const titleNode = document.getElementById('imageTitle');
const dims = document.getElementById('imageDimensions');
const downloadDialog = document.getElementById('downloadDialog');
const paintDialog = document.getElementById('paintDialog');
const toast = document.getElementById('toast');
let originalLoaded = false;
let canvas, ctx, baseImage, strokes = [], currentStroke = null, drawing = false;
let toastTimer;

titleNode.textContent = title;
document.title = `${title} — MEME BOX`;
if (!src) {
  titleNode.textContent = 'Nenhuma imagem selecionada';
  img.alt = 'Nenhuma imagem selecionada';
} else if (mediaType === 'video') {
  img.hidden = true;
  video.hidden = false;
  video.src = src;
  video.controls = true;
  video.playsInline = true;
  document.getElementById('paintOpen').hidden = true;
  document.querySelector('.tip').textContent = 'Vídeos podem ser assistidos e baixados, mas não podem ser editados no PINTE!';
  document.querySelectorAll('[data-format=png], [data-format=jpeg]').forEach(b => b.hidden = true);
  video.addEventListener('loadedmetadata', () => { originalLoaded = true; dims.textContent = `${Math.round(video.videoWidth)} × ${Math.round(video.videoHeight)} • VÍDEO`; });
  video.addEventListener('error', () => { titleNode.textContent = 'Não foi possível carregar o vídeo'; notify('Confira o arquivo na pasta images.'); });
} else {
  video.hidden = true;
  img.src = src;
  img.addEventListener('load', () => { originalLoaded = true; dims.textContent = `${img.naturalWidth} × ${img.naturalHeight}`; });
  img.addEventListener('error', () => { titleNode.textContent = 'Não foi possível carregar a imagem'; notify('Confira o caminho da imagem em js/images.js.'); });
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
document.getElementById('downloadOpen').addEventListener('click', () => downloadDialog.showModal());
document.getElementById('paintOpen').addEventListener('click', () => {
  if (mediaType === 'video') return notify('Vídeos não podem ser pintados no PINTE!.');
  if (!originalLoaded) return notify('A imagem ainda não terminou de carregar.');
  paintDialog.showModal();
  setupCanvas();
});
document.getElementById('printButton').addEventListener('click', () => {
  if (!originalLoaded) return notify('Não há imagem para imprimir.');
  if (mediaType === 'video') return notify('Para salvar o vídeo, use Baixar arquivo original.');
  const win = window.open('', '_blank');
  if (!win) return notify('Permita pop-ups para abrir a página de impressão.');
  const safeTitle = title.replace(/[&<>"]/g, '');
  const printSrc = new URL(src, location.href).href;
  win.document.write(`<!doctype html><html><head><title>${safeTitle}</title><style>body{margin:0;padding:20px;text-align:center;font-family:Arial,sans-serif}img{max-width:100%;max-height:88vh;object-fit:contain}h2{font-size:16px;font-weight:normal}</style></head><body><h2>${safeTitle}</h2><img src="${printSrc}" onload="setTimeout(()=>window.print(),300)" onerror="document.body.insertAdjacentText('beforeend',' Não foi possível carregar a imagem para impressão.')"></body></html>`);
  win.document.close();
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', async () => {
  const format = button.dataset.format;
  if (format === 'original' || mediaType === 'video') {
    const a = document.createElement('a');
    a.href = src;
    a.download = fileBase(src);
    a.click();
    downloadDialog.close();
    notify('Download do arquivo original iniciado.');
    return;
  }
  try {
    const converted = await loadImageForCanvas(img.src);
    const c = document.createElement('canvas');
    c.width = converted.naturalWidth; c.height = converted.naturalHeight;
    const cctx = c.getContext('2d');
    if (format === 'jpeg') { cctx.fillStyle = '#fff'; cctx.fillRect(0, 0, c.width, c.height); }
    cctx.drawImage(converted, 0, 0);
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    c.toBlob(blob => {
      if (!blob) return notify('Não foi possível converter a imagem.');
      saveBlob(blob, `${fileBase(src).replace(/\.[^.]+$/, '')}.${format === 'png' ? 'png' : 'jpg'}`);
      downloadDialog.close();
      notify(`Imagem exportada como ${format.toUpperCase()}.`);
    }, mime, .94);
  } catch (e) {
    notify('Não foi possível converter. Confira se a imagem está na pasta images.');
  }
}));
function fileBase(path) {
  try { return decodeURIComponent(path.split('/').pop().split('?')[0]) || 'meme'; } catch { return 'meme'; }
}
function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function loadImageForCanvas(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

// --- Editor PINTE! ---
const paintCanvas = document.getElementById('paintCanvas');
function setupCanvas() {
  if (canvas === paintCanvas && baseImage) { redraw(); return; }
  canvas = paintCanvas;
  baseImage = new Image();
  baseImage.onload = () => {
    const maxWidth = Math.min(1300, window.innerWidth * .88);
    const scale = Math.min(1, maxWidth / baseImage.naturalWidth, 1800 / baseImage.naturalHeight);
    canvas.width = Math.max(1, Math.round(baseImage.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(baseImage.naturalHeight * scale));
    ctx = canvas.getContext('2d');
    redraw();
  };
  baseImage.src = img.src;
}
function redraw() {
  if (!ctx || !baseImage) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  for (const stroke of strokes) drawStroke(stroke);
  if (currentStroke) drawStroke(currentStroke);
}
function drawStroke(stroke) {
  if (!stroke.points.length) return;
  // Pincel e borracha usam a mesma ponta estilizada; o tamanho controla a forma inteira.
  if (stroke.tool === 'pen' || stroke.tool === 'eraser') {
    stroke.points.forEach(point => drawCartoonStamp(point.x, point.y, stroke.size, stroke.color, point.angle || 0, stroke.tool === 'eraser'));
    return;
  }
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = stroke.size;
  ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  if (stroke.points.length === 1) {
    ctx.beginPath(); ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    stroke.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }
  ctx.restore();
}
function drawCartoonStamp(x, y, size, color, angle = 0, erase = false) {
  // Carimbo humorístico e estilizado: silhueta simples, sem anatomia ou detalhes explícitos.
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const w = size * .78, h = size * 1.75;
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
  ctx.fillStyle = color;
  ctx.strokeStyle = erase ? color : '#171717';
  ctx.lineWidth = Math.max(1.2, size * .08);
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.ellipse(0, -h * .19, w * .42, h * .39, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(-w * .25, -h * .03, w * .5, h * .62, [w * .22, w * .22, w * .08, w * .08]);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, h * .55, w * .35, h * .13, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}
let activeTool = 'pen';
document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => {
  activeTool = button.dataset.tool;
  document.querySelectorAll('[data-tool]').forEach(tool => tool.classList.toggle('active', tool === button));
}));
function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
}
paintCanvas.addEventListener('pointerdown', event => {
  if (!ctx) return;
  drawing = true; paintCanvas.setPointerCapture(event.pointerId);
  const p = pointerPosition(event);
  currentStroke = { tool: activeTool, size: Number(document.getElementById('brushSize').value), color: document.getElementById('brushColor').value, points: [{...p, angle: 0}] };
  redraw();
});
paintCanvas.addEventListener('pointermove', event => {
  if (!drawing || !currentStroke) return;
  const p = pointerPosition(event);
  const previous = currentStroke.points[currentStroke.points.length - 1];
  const dx = p.x - previous.x, dy = p.y - previous.y;
  const distance = Math.hypot(dx, dy);
  // Espaçamento proporcional ao tamanho evita falhas e mantém o traço uniforme.
  if (distance > Math.max(2, currentStroke.size * .22)) {
    currentStroke.points.push({...p, angle: Math.atan2(dy, dx) + Math.PI / 2});
  }
  redraw();
});
function finishStroke() {
  if (!drawing) return;
  drawing = false;
  if (currentStroke) strokes.push(currentStroke);
  currentStroke = null;
  redraw();
}
paintCanvas.addEventListener('pointerup', finishStroke);
paintCanvas.addEventListener('pointercancel', finishStroke);
document.getElementById('undoButton').addEventListener('click', () => { strokes.pop(); redraw(); });
document.getElementById('clearButton').addEventListener('click', () => {
  if (strokes.length && confirm('Apagar todos os desenhos desta edição?')) { strokes = []; redraw(); }
});
document.getElementById('savePaint').addEventListener('click', () => {
  if (!ctx) return;
  // Exporta em PNG com fundo transparente onde a borracha apagou; a imagem-base cobre o fundo.
  canvas.toBlob(blob => {
    if (!blob) return notify('Não foi possível salvar o desenho.');
    saveBlob(blob, `${fileBase(src).replace(/\.[^.]+$/, '')}-pintado.png`);
    notify('Desenho baixado em PNG!');
  }, 'image/png');
});
