// ─── MAPAS ────────────────────────────────────────────────────────────────────
const MAPS = [
  // ── ELIMINAÇÃO ──
  { name: 'Block Dash',             bg: 'bg_12' },
  { name: 'Block Dash Legendary',   bg: 'bg_36' },
  { name: 'Laser Tracer',           bg: 'bg_07' },
  { name: 'Laser Dash',             bg: 'bg_37' },
  { name: 'Rush Hour',              bg: 'bg_18' },
  { name: 'Honey Drop',             bg: 'bg_27' },
  { name: 'Sharkmuda',              bg: 'bg_38' },
  { name: 'The Other Side',         bg: 'bg_39' },
  { name: 'Lava Land',              bg: 'bg_14' },
  { name: 'Bot Bash',               bg: 'bg_16' },
  { name: 'Bombardment',            bg: 'bg_03' },

  // ── CORRIDA / SOBREVIVÊNCIA ──
  { name: 'Stumble Soccer',         bg: 'bg_01' },
  { name: 'Lava Rush',              bg: 'bg_02' },
  { name: 'Space Race',             bg: 'bg_04' },
  { name: 'Tile Fall',              bg: 'bg_05' },
  { name: 'Super Slide',            bg: 'bg_06' },
  { name: 'Lost Temple',            bg: 'bg_08' },
  { name: 'Rocket Rumble',          bg: 'bg_09' },
  { name: 'Ice Heights',            bg: 'bg_10' },
  { name: 'Jungle Roll',            bg: 'bg_11' },
  { name: 'Paint Splash',           bg: 'bg_13' },
  { name: 'Nerf Arena',             bg: 'bg_15' },
  { name: 'Hot Wheels',             bg: 'bg_17' },
  { name: 'Treasure Hunt',          bg: 'bg_19' },
  { name: 'Humble Stumble',         bg: 'bg_20' },
  { name: 'Abduction Avenue',       bg: 'bg_23' },
  { name: 'Pivot Push',             bg: 'bg_25' },
  { name: 'Stumble Cove',           bg: 'bg_26' },
  { name: 'Floor Flip',             bg: 'bg_28' },
  { name: 'Spin Go Round',          bg: 'bg_29' },
  { name: 'Cannon Climb',           bg: 'bg_30' },
  { name: 'Over Under',             bg: 'bg_33' },
];

// ─── STATE ────────────────────────────────────────────────────────────────────
const S = {
  name: '',
  mapIdx: -1,
  format: '1v1',
  discord: '',
  photo: null,
  colorMode: 'solid',
  color1: '#ffffff',
  color2: '#ffff00',
  emotes: [],
  bgs: [],
  bgId: -1,
  bgBlur: 6,
};

const bgImages = {}; // key -> Image
let bgIdCtr = 0, emoteIdCtr = 0;

// ─── CANVAS ──────────────────────────────────────────────────────────────────
const cv  = document.getElementById('cv');
const ctx = cv.getContext('2d');
cv.width  = 400;
cv.height = 400;

// ─── FONTE ──────────────────────────────────────────────────────────────────
// Carrega Lilita One via FontFace API para o canvas
const lilitaFont = new FontFace('Lilita One', "url('https://fonts.gstatic.com/s/lilitaone/v15/i7dPIFZ9Zz-WBtRtedDbUEZ2RFq7AwU.woff2')");
lilitaFont.load().then(f => { document.fonts.add(f); render(); }).catch(() => {});

// ícone de modo (na frente de modo.webp)
let modeIconImg = null;
(function loadModeIcon() {
  const img = new Image();
  img.onload = () => { modeIconImg = img; render(); };
  img.crossOrigin = 'anonymous';
  img.src = 'public/emotes/na%20frente%20de%20modo.webp';
})();

// ícone do Discord
let discordIconImg = null;
(function loadDiscordIcon() {
  const img = new Image();
  img.onload = () => { discordIconImg = img; render(); };
  img.crossOrigin = 'anonymous';
  img.src = 'public/discord.webp';
})();

// ─── TABS ────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('tab-' + t.dataset.tab).classList.add('active');
  });
});

// ─── NOME / DISCORD ──────────────────────────────────────────────────────────
document.getElementById('inp-name').addEventListener('input', e => { S.name = e.target.value; render(); });
document.getElementById('inp-discord').addEventListener('input', e => { S.discord = e.target.value; render(); });

// ─── BLUR ────────────────────────────────────────────────────────────────────
document.getElementById('blur-slider').addEventListener('input', e => {
  S.bgBlur = parseInt(e.target.value);
  document.getElementById('blur-val').textContent = S.bgBlur + 'px';
  render();
});

// ─── COR ─────────────────────────────────────────────────────────────────────
document.getElementById('btn-solid').addEventListener('click', () => {
  S.colorMode = 'solid';
  document.getElementById('btn-solid').classList.add('active');
  document.getElementById('btn-grad').classList.remove('active');
  document.getElementById('color2').classList.add('hidden');
  render();
});
document.getElementById('btn-grad').addEventListener('click', () => {
  S.colorMode = 'gradient';
  document.getElementById('btn-grad').classList.add('active');
  document.getElementById('btn-solid').classList.remove('active');
  document.getElementById('color2').classList.remove('hidden');
  render();
});
document.getElementById('color1').addEventListener('input', e => { S.color1 = e.target.value; render(); });
document.getElementById('color2').addEventListener('input', e => { S.color2 = e.target.value; render(); });

// ─── FORMAT PILLS ────────────────────────────────────────────────────────────
document.querySelectorAll('.pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    S.format = p.dataset.v;
    render();
  });
});

// ─── MAPA — GRADE DE ÍCONES ──────────────────────────────────────────────────
const mapIconsGrid = document.getElementById('map-icons-grid');

function buildMapGrid() {
  MAPS.forEach((map, idx) => {
    const btn = document.createElement('button');
    btn.className = 'map-ic-btn';
    btn.dataset.idx = idx;

    const sq = document.createElement('div');
    sq.className = 'map-ic-sq';

    const im = document.createElement('img');
    im.crossOrigin = 'anonymous';
    im.src = `public/backgrounds/${map.bg}.jpg`;
    im.alt = map.name;

    const nm = document.createElement('span');
    nm.className = 'map-ic-name';
    nm.textContent = map.name;

    sq.appendChild(im);
    btn.appendChild(sq);
    btn.appendChild(nm);

    btn.addEventListener('click', () => {
      // Deseleciona todos, seleciona este
      document.querySelectorAll('.map-ic-btn').forEach(b => b.classList.remove('sel'));

      if (S.mapIdx === idx) {
        // Clique duplo = deseleciona
        S.mapIdx = -1;
      } else {
        S.mapIdx = idx;
        btn.classList.add('sel');
        // NÃO troca o background — mapa é só visual na capa
      }
      render();
    });

    mapIconsGrid.appendChild(btn);
  });
}

// ─── FOTO ─────────────────────────────────────────────────────────────────────
const photoArea = document.getElementById('photo-area');
const photoInp  = document.getElementById('photo-inp');
const photoThumb = document.getElementById('photo-thumb');
const photoFname = document.getElementById('photo-fname');
const photoPh   = document.getElementById('photo-ph');
const rmPhoto   = document.getElementById('rm-photo');

photoArea.addEventListener('click', () => photoInp.click());
photoInp.addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f);
  const img = new Image();
  img.onload = () => { S.photo = img; render(); };
  img.src = url;
  photoThumb.src = url;
  photoThumb.classList.remove('hidden');
  photoFname.textContent = f.name; photoFname.classList.remove('hidden');
  photoPh.classList.add('hidden'); rmPhoto.classList.remove('hidden');
});
rmPhoto.addEventListener('click', e => {
  e.stopPropagation();
  S.photo = null;
  photoThumb.classList.add('hidden'); photoFname.classList.add('hidden');
  photoPh.classList.remove('hidden'); rmPhoto.classList.add('hidden');
  photoInp.value = ''; render();
});

// ─── EMOTES PRÉ-DEFINIDOS ────────────────────────────────────────────────────
const EMOTE_GROUPS = [
  { files: ['soco normal.webp',    'soco de fogo.webp'      ] },
  { files: ['rasteira normal.webp','rasteira de agua.webp'  ] },
  { files: ['coracao.webp',        'coracao de agua.webp'   ] },
  { files: ['banana normal.webp',  'banana dourada.webp'    ] },
  { files: ['bola.webp',           'bola de neve.webp'      ] },
  { divider: true, files: ['cuspe.webp','espatula.webp','invisivel.webp','karate.webp','maleta.webp','raio.webp','tetris.webp'] },
  { divider: true, files: ['sem emotes.webp'] },
];

const EMOTE_LABELS = {
  'soco normal.webp':      'Soco',
  'soco de fogo.webp':     'Soco Fogo',
  'rasteira normal.webp':  'Rasteira',
  'rasteira de agua.webp': 'Rasteira Água',
  'coracao.webp':          'Coração',
  'coracao de agua.webp':  'Coração Água',
  'banana normal.webp':    'Banana',
  'banana dourada.webp':   'Banana Dourada',
  'bola.webp':             'Bola',
  'bola de neve.webp':     'Bola de Neve',
  'cuspe.webp':            'Cuspe',
  'espatula.webp':         'Espátula',
  'invisivel.webp':        'Invisível',
  'karate.webp':           'Karatê',
  'maleta.webp':           'Maleta',
  'raio.webp':             'Raio',
  'tetris.webp':           'Tetris',
  'sem emotes.webp':       'Sem Emotes',
};

// ─── EMOTES — estado ────────────────────────────────────────────────────────
// S.emotes = [{ file, img, id }]
// activePresets = Set de file names que estão na capa

const activePresets = new Set();
const presetImages  = {};   // file -> HTMLImageElement (cache)

function loadPresetImg(file) {
  if (presetImages[file]) return Promise.resolve(presetImages[file]);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => { presetImages[file] = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.crossOrigin = 'anonymous';
    img.src = `public/emotes/${encodeURIComponent(file)}`;
  });
}

function buildEmoteGroups() {
  const container = document.getElementById('emote-groups');
  container.innerHTML = '';

  EMOTE_GROUPS.forEach((group) => {
    if (group.divider) {
      const div = document.createElement('div');
      div.className = 'emote-group-divider';
      container.appendChild(div);
    }

    const row = document.createElement('div');
    row.className = 'emote-group';

    group.files.forEach(file => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.dataset.file = file;

      const sq = document.createElement('div');
      sq.className = 'preset-sq';

      const im = document.createElement('img');
      im.crossOrigin = 'anonymous';
      im.src = `public/emotes/${encodeURIComponent(file)}`;
      im.alt = EMOTE_LABELS[file] || file;

      const lbl = document.createElement('span');
      lbl.className = 'preset-lbl';
      lbl.textContent = EMOTE_LABELS[file] || file.replace('.webp','');

      sq.appendChild(im);
      btn.appendChild(sq);
      btn.appendChild(lbl);

      btn.addEventListener('click', () => togglePresetEmote(file, btn));
      row.appendChild(btn);
    });

    container.appendChild(row);
  });
}

function addEmoteThumb(img, id, url, file) {
  const emotesGrid = document.getElementById('emotes-grid');
  const item = document.createElement('div');
  item.className = 'emote-item';
  if (file) item.dataset.file = file;

  const bg  = document.createElement('div'); bg.className = 'emote-bg-sq';
  const im  = document.createElement('img'); im.src = url;
  const btn = document.createElement('button'); btn.className = 'emote-rm'; btn.textContent = '✕';

  btn.addEventListener('click', () => {
    S.emotes = S.emotes.filter(x => x.id !== id);
    item.remove();
    // Desmarca o botão preset se for preset
    if (file) {
      activePresets.delete(file);
      const pb = document.querySelector(`.preset-btn[data-file="${CSS.escape(file)}"]`);
      if (pb) pb.classList.remove('active');
    }
    render();
  });

  item.appendChild(bg); item.appendChild(im); item.appendChild(btn);
  emotesGrid.appendChild(item);
}

function togglePresetEmote(file, btn) {
  if (activePresets.has(file)) {
    // Remove
    activePresets.delete(file);
    btn.classList.remove('active');
    S.emotes = S.emotes.filter(e => e.file !== file);
    const item = document.querySelector(`.emote-item[data-file="${CSS.escape(file)}"]`);
    if (item) item.remove();
    render();
  } else {
    // Adiciona
    activePresets.add(file);
    btn.classList.add('active');
    loadPresetImg(file).then(img => {
      if (!img) return;
      const id = emoteIdCtr++;
      S.emotes.push({ file, img, id });
      addEmoteThumb(img, id, `public/emotes/${encodeURIComponent(file)}`, file);
      render();
    });
  }
}


// ─── BACKGROUNDS ─────────────────────────────────────────────────────────────
const bgGrid = document.getElementById('bg-grid');

function selectBg(id) {
  S.bgId = id;
  document.querySelectorAll('.bg-item').forEach(el => {
    el.classList.toggle('sel', parseInt(el.dataset.id) === id);
  });
  render();
}

function addBgThumb(bgObj) {
  const item = document.createElement('div');
  item.className = 'bg-item' + (S.bgId === bgObj.id ? ' sel' : '');
  item.dataset.id = bgObj.id;
  const im = document.createElement('img'); im.crossOrigin = 'anonymous'; im.src = bgObj.url; im.alt = '';
  const lb = document.createElement('div'); lb.className = 'bg-lbl'; lb.textContent = bgObj.name;
  item.appendChild(im); item.appendChild(lb);
  item.addEventListener('click', () => selectBg(bgObj.id));
  bgGrid.appendChild(item);
}

// Pré-carrega os backgrounds
(function preload() {
  MAPS.forEach((map) => {
    const key = map.bg;
    const url = `public/backgrounds/${key}.jpg`;
    const img = new Image();
    const id  = bgIdCtr++;
    const obj = { img, id, url, name: map.name, key };
    img.onload = () => {
      bgImages[key] = img;
      S.bgs.push(obj);
      if (S.bgId === -1) selectBg(id);
      addBgThumb(obj);
      initDefaults(); // tenta aplicar defaults toda vez que um bg carrega
      render();
    };
    img.onerror = () => { S.bgs.push(obj); addBgThumb(obj); };
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
})();

// Constrói a grade de ícones de mapa (precisa do DOM pronto)
buildMapGrid();

// Constrói os grupos de emotes
buildEmoteGroups();
// ─── HELPERS ─────────────────────────────────────────────────────────────────
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function drawCover(img, x, y, w, h) {
  if (!img || !img.naturalWidth) return;
  const ir = img.naturalWidth / img.naturalHeight, br = w / h;
  let sw,sh,sx,sy;
  if (ir>br){sh=img.naturalHeight;sw=sh*br;sx=(img.naturalWidth-sw)/2;sy=0;}
  else      {sw=img.naturalWidth;sh=sw/br;sx=0;sy=(img.naturalHeight-sh)/2;}
  ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}

function drawContain(img, x, y, w, h) {
  if (!img || !img.naturalWidth) return;
  const ir = img.naturalWidth / img.naturalHeight, br = w / h;
  let dw,dh,dx,dy;
  if (ir>br){dw=w;dh=w/ir;dx=x;dy=y+(h-dh)/2;}
  else      {dh=h;dw=h*ir;dy=y;dx=x+(w-dw)/2;}
  ctx.drawImage(img,dx,dy,dw,dh);
}

function shadow(blur=6, color='rgba(0,0,0,0.85)') {
  ctx.shadowBlur = blur; ctx.shadowColor = color;
}
function noShadow() { ctx.shadowBlur=0; ctx.shadowColor='transparent'; }

// Stroke + fill de texto com Lilita One
function outlineText(text, x, y, fillStyle, size, align='center', baseline='middle') {
  ctx.font      = `${size}px 'Lilita One', 'Segoe UI', sans-serif`;
  ctx.textAlign    = align;
  ctx.textBaseline = baseline;
  ctx.lineWidth    = size * 0.12;
  ctx.strokeStyle  = 'rgba(0,0,0,0.9)';
  ctx.lineJoin     = 'round';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
}

// ─── RENDER ──────────────────────────────────────────────────────────────────
function render() {
  const W = cv.width, H = cv.height; // 400 x 400
  ctx.clearRect(0, 0, W, H);

  // Todas as medidas derivadas de W/H para manter proporção

  // ── 1. FUNDO ─────────────────────────────────────────────────────────────
  const activeBg = S.bgs.find(b => b.id === S.bgId);
  ctx.save();
  rr(0, 0, W, H, W * 0.04); ctx.clip();
  if (S.bgBlur > 0) ctx.filter = `blur(${S.bgBlur}px)`;
  if (activeBg?.img?.naturalWidth) {
    // Quando há blur, desenha um pouco maior para evitar bordas transparentes
    const expand = S.bgBlur * 2;
    drawCover(activeBg.img, -expand, -expand, W + expand*2, H + expand*2);
  } else {
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,'#3a0070'); g.addColorStop(1,'#9b3fcf');
    ctx.fillStyle = g; ctx.fillRect(-S.bgBlur*2, -S.bgBlur*2, W+S.bgBlur*4, H+S.bgBlur*4);
  }
  ctx.filter = 'none';
  ctx.restore();

  // ── 2. OVERLAY TOPO ──────────────────────────────────────────────────────
  const topG = ctx.createLinearGradient(0,0,0,H*0.28);
  topG.addColorStop(0,'rgba(0,0,0,0.70)');
  topG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = topG; ctx.fillRect(0,0,W,H*0.28);

  // ── 3. TÍTULO ─────────────────────────────────────────────────────────────
  // Na foto: "Atuma" ocupa ~40% da largura, Y ≈ 11% do alto
  const titleSize = Math.round(W * 0.115); // ~46px em 400
  const titleY    = H * 0.108;
  if (S.name) {
    ctx.save();
    let fill;
    if (S.colorMode === 'gradient') {
      const tg = ctx.createLinearGradient(W*0.1,0,W*0.9,0);
      tg.addColorStop(0, S.color1); tg.addColorStop(1, S.color2);
      fill = tg;
    } else { fill = S.color1; }
    shadow(W*0.025);
    outlineText(S.name, W/2, titleY, fill, titleSize);
    noShadow();
    ctx.restore();
  }

  // ── 4. CARD DA FOTO ───────────────────────────────────────────────────────
  // Na foto: card começa em ~20% do topo, tamanho ~50% de W, centralizado
  const cardSize = Math.round(W * 0.50);   // 200px
  const cardX    = (W - cardSize) / 2;
  const cardY    = H * 0.205;
  const cardR    = W * 0.025;

  // sombra
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = W*0.045; ctx.shadowOffsetY = W*0.012;
  rr(cardX, cardY, cardSize, cardSize, cardR);
  ctx.fillStyle = '#c47a3a'; ctx.fill();
  ctx.restore();

  // foto
  ctx.save();
  rr(cardX, cardY, cardSize, cardSize, cardR);
  ctx.clip();
  if (S.photo) {
    drawCover(S.photo, cardX, cardY, cardSize, cardSize);
  } else {
    ctx.fillStyle = '#c47a3a'; ctx.fillRect(cardX, cardY, cardSize, cardSize);
  }
  ctx.restore();

  // ── 5. NOME DO MAPA + ÍCONE ───────────────────────────────────────────────
  // Na foto: logo abaixo do card, ícone quadrado roxo + texto grande
  const mapY      = cardY + cardSize + H * 0.062;  // ~25px abaixo do card
  const mapFontSz = Math.round(W * 0.072);          // ~29px
  const iconSz    = Math.round(W * 0.082);          // ~33px

  const map = S.mapIdx >= 0 ? MAPS[S.mapIdx] : null;
  if (map) {
    ctx.font = `${mapFontSz}px 'Lilita One', sans-serif`;
    const tw = ctx.measureText(map.name).width;
    const blockW = iconSz + W*0.022 + tw;
    let ix = (W - blockW) / 2;

    // quadrado roxo
    ctx.save();
    rr(ix, mapY - iconSz/2, iconSz, iconSz, W*0.016);
    ctx.fillStyle = '#7c3cad'; ctx.fill();
    ctx.restore();

    // ícone do mapa
    const icImg = bgImages[map.bg];
    if (icImg) ctx.drawImage(icImg, ix, mapY - iconSz/2, iconSz, iconSz);

    // texto mapa
    ctx.save();
    shadow(W*0.025, 'rgba(0,0,0,0.95)');
    outlineText(map.name, ix + iconSz + W*0.022 + tw/2, mapY, '#ffffff', mapFontSz);
    noShadow();
    ctx.restore();
  }

  // ── 6. FORMATO + ÍCONE DO MODO ───────────────────────────────────────────
  // Na foto: abaixo do mapa, ligeiramente menor
  const fmtY      = mapY + H * 0.095;               // ~38px abaixo do mapa
  const fmtFontSz = Math.round(W * 0.060);          // ~24px
  const fmtIconSz = Math.round(W * 0.068);          // ~27px

  ctx.font = `${fmtFontSz}px 'Lilita One', sans-serif`;
  const fmtTW   = ctx.measureText(S.format).width;
  const fmtBlkW = (modeIconImg ? fmtIconSz + W*0.018 : 0) + fmtTW;
  let fx = (W - fmtBlkW) / 2;

  if (modeIconImg) {
    ctx.drawImage(modeIconImg, fx, fmtY - fmtIconSz/2, fmtIconSz, fmtIconSz);
    fx += fmtIconSz + W*0.018;
  }

  ctx.save();
  shadow(W*0.022, 'rgba(0,0,0,0.95)');
  outlineText(S.format, fx + fmtTW/2, fmtY, '#ffffff', fmtFontSz);
  noShadow();
  ctx.restore();

  // ── 7. EMOTES — canto inferior esquerdo ───────────────────────────────────
  // Na foto: quadrados grandes cinza claro, ~44px, margem 10px
  const eSz  = Math.round(W * 0.112);  // ~45px
  const eGap = Math.round(W * 0.018);  // ~7px
  const eML  = Math.round(W * 0.028);  // ~11px margem esquerda
  const eMB  = Math.round(H * 0.025);  // ~10px margem baixo
  const ePad = Math.round(eSz * 0.10); // padding interno

  const cnt = S.emotes.length;
  if (cnt > 0) {
    const ey = H - eMB - eSz / 2;
    let ex = eML;
    S.emotes.forEach(({ img }) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.30)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2;
      rr(ex, ey - eSz/2, eSz, eSz, eSz * 0.16);
      ctx.fillStyle = '#d5d8dc';
      ctx.fill();
      ctx.restore();
      ctx.drawImage(img, ex+ePad, ey-eSz/2+ePad, eSz-ePad*2, eSz-ePad*2);
      ex += eSz + eGap;
    });
  }

  // ── 8. DISCORD — canto inferior direito ──────────────────────────────────
  if (S.discord) {
    const discY    = H - eMB - eSz/2;
    const discFont = Math.round(W * 0.038);
    const icSz     = Math.round(W * 0.055); // tamanho do ícone discord

    ctx.save();
    ctx.font = `${discFont}px 'Lilita One', sans-serif`;
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 4; ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.fillStyle = '#ffffff';

    const textW = ctx.measureText(S.discord).width;
    const totalW = icSz + 4 + textW;
    const startX = W - eML - totalW;

    // ícone discord
    if (discordIconImg) {
      ctx.drawImage(discordIconImg, startX, discY - icSz/2, icSz, icSz);
    }

    // texto
    ctx.fillText(S.discord, W - eML, discY);
    ctx.restore();
  }
}

// ─── DOWNLOAD ────────────────────────────────────────────────────────────────
document.getElementById('btn-dl').addEventListener('click', () => {
  render();
  const a = document.createElement('a');
  a.download = (S.name || 'capa-stumble') + '.png';
  a.href = cv.toDataURL('image/png');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// ─── COPIAR LINK ─────────────────────────────────────────────────────────────
document.getElementById('btn-cp').addEventListener('click', () => {
  render();
  const btn = document.getElementById('btn-cp');
  const original = btn.textContent;
  const dataUrl = cv.toDataURL('image/png');

  // Tenta copiar texto do dataURL (funciona em qualquer contexto)
  navigator.clipboard.writeText(dataUrl)
    .then(() => {
      btn.textContent = '✅ Link copiado!';
      setTimeout(() => { btn.textContent = original; }, 2500);
    })
    .catch(() => {
      // Fallback manual: cria input temporário e usa execCommand
      const ta = document.createElement('textarea');
      ta.value = dataUrl;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        btn.textContent = '✅ Link copiado!';
      } catch (e) {
        btn.textContent = '❌ Erro ao copiar';
      }
      document.body.removeChild(ta);
      setTimeout(() => { btn.textContent = original; }, 2500);
    });
});

// ─── INITIAL ─────────────────────────────────────────────────────────────────
render();

function initDefaults() {
  if (initDefaults._done) return;
  // Precisa do bg_12 carregado para aplicar
  const bd = S.bgs.find(b => b.key === 'bg_12');
  if (!bd) return;
  initDefaults._done = true;

  // Título
  S.name = 'Atuma';
  document.getElementById('inp-name').value = 'Atuma';

  // Background Block Dash
  selectBg(bd.id);

  // Mapa Block Dash
  const bdIdx = MAPS.findIndex(m => m.name === 'Block Dash');
  if (bdIdx >= 0) {
    S.mapIdx = bdIdx;
    const btn = document.querySelector(`.map-ic-btn[data-idx="${bdIdx}"]`);
    if (btn) btn.classList.add('sel');
  }

  // Emotes soco normal + soco de fogo
  ['soco normal.webp', 'soco de fogo.webp'].forEach(file => {
    if (activePresets.has(file)) return;
    loadPresetImg(file).then(img => {
      if (!img) return;
      const id = emoteIdCtr++;
      S.emotes.push({ file, img, id });
      activePresets.add(file);
      addEmoteThumb(img, id, `public/emotes/${encodeURIComponent(file)}`, file);
      const pb = document.querySelector(`.preset-btn[data-file="${CSS.escape(file)}"]`);
      if (pb) pb.classList.add('active');
      render();
    });
  });

  render();
}
initDefaults._done = false;
