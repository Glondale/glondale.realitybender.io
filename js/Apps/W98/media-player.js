// Windows Media Player 6.4 style (classic) lightweight implementation
// - Scans Assets/Music for .mp3 files (directory listing parsing)
// - Single main window emulating WMP 6.4 layout (menubar, display area, transport bar, status bar)
// - Toggle-able embedded playlist panel
// - Spectrum visualization (green bars) inside the display area
// - Basic transport: prev / play / pause / stop / next; seek + time display; volume; playlist selection

import { computer } from '../../../computer.js';

function installMediaPlayer(env) {
  // Add Start Menu path: Programs -> Accessories -> Entertainment
  env.addStartMenuEntry(['Programs', 'Accessories', 'Entertainment']);
  env.addStartMenuItem(['Programs', 'Accessories', 'Entertainment'], {
    id: 'wmplayer',
    title: 'Windows Media Player',
    target: 'wmplayer.exe'
  });

  // Optionally add a desktop shortcut
  env.addDesktopShortcut({ id: 'wmplayer', title: 'Media Player', target: 'wmplayer.exe' });
  env.renderDesktop();
  env.renderStartMenu?.();

  // Patch launch chain (chain-friendly with existing patches like notepad)
  if (!env.__wmpLaunchPatched) {
    const originalLaunch = env.launch.bind(env);
    env.launch = function(target, options = {}) {
      if (target === 'wmplayer.exe') {
        return openMediaPlayer(env, options);
      }
      return originalLaunch(target, options);
    };
    env.__wmpLaunchPatched = true;
  }
}

// Keep per-instance state (single instance for simplicity)
let wmpState = null; // { pid, tracks, currentIndex, audio, analyser, raf, canvas }

async function openMediaPlayer(env) {
  if (wmpState && env.processes.has(wmpState.pid)) {
    // Focus existing
    return; // focusing handled by clicking task button / window
  }
  const pid = env._spawnProcess({ id: 'wmplayer', title: 'Windows Media Player 6.4' });
  const contentHTML = `
    <div class="wmp64-root">
      <div class="wmp64-menubar"> <span>File</span><span>View</span><span>Play</span><span>Favorites</span><span>Help</span> </div>
      <div class="wmp64-display">
        <div class="wmp64-title" data-role="title">Windows Media Player</div>
        <canvas class="wmp64-vis" width="320" height="100"></canvas>
      </div>
      <div class="wmp64-controls-bar">
        <div class="wmp64-transport">
          <button data-act="prev" title="Previous" class="tb">⏮</button>
          <button data-act="play" title="Play" class="tb">▶</button>
          <button data-act="pause" title="Pause" class="tb">⏸</button>
          <button data-act="stop" title="Stop" class="tb">⏹</button>
          <button data-act="next" title="Next" class="tb">⏭</button>
        </div>
        <div class="wmp64-seek-wrap">
          <input type="range" data-act="seek" min="0" max="1000" value="0" class="wmp64-seek" />
          <div class="wmp64-time" data-role="time">00:00 / 00:00</div>
        </div>
        <div class="wmp64-vol-wrap" title="Volume">
          <input type="range" data-act="vol" min="0" max="1" step="0.01" value="1" class="wmp64-vol" />
        </div>
        <button data-act="toggle-playlist" class="wmp64-pl-toggle" title="Show/Hide Playlist">PL</button>
      </div>
      <div class="wmp64-playlist-panel" data-role="playlist-panel" hidden>
        <div class="wmp64-pl-header">Playlist</div>
        <div class="wmp64-playlist" data-role="playlist">Loading playlist...</div>
      </div>
      <div class="wmp64-status" data-role="status">Ready</div>
    </div>`;
  env._attachProcessWindow(pid, contentHTML);

  // After attach, hydrate UI
  const winEl = Array.from(document.querySelectorAll('.win98-window')).find(w => w.querySelector('.title')?.textContent === 'Windows Media Player 6.4');
  if (!winEl) return;
  const root = winEl.querySelector('.wmp64-root');
  injectStyles();
  const playlistEl = root.querySelector('[data-role="playlist"]');
  const playlistPanel = root.querySelector('[data-role="playlist-panel"]');
  const statusEl = root.querySelector('[data-role="status"]');
  const titleEl = root.querySelector('[data-role="title"]');
  const timeEl = root.querySelector('[data-role="time"]');
  const canvas = root.querySelector('.wmp64-vis');
  const seekEl = root.querySelector('[data-act="seek"]');
  const volEl = root.querySelector('[data-act="vol"]');

  const audio = new Audio();
  audio.crossOrigin = 'anonymous';
  const ctx = safeAudioContext();
  let analyser = null;
  if (ctx) {
    const src = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyser.connect(ctx.destination);
  }

  const tracks = await discoverTracks(statusEl);
  renderPlaylist(playlistEl, tracks);

  wmpState = { pid, tracks, currentIndex: 0, audio, analyser, raf: null, canvas };

  // Listen for process close to cleanup audio
  const cleanup = () => {
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    if (wmpState && wmpState.raf) {
      cancelAnimationFrame(wmpState.raf);
    }
    if (ctx && ctx.state !== 'closed') {
      try { ctx.close(); } catch(e) {}
    }
    wmpState = null;
  };

  // Listen for computer events to detect when this process is closed
  const processCloseListener = computer.on('process:closed', (data) => {
    if (data.pid === pid) {
      cleanup();
      processCloseListener(); // unsubscribe
    }
  });

  // Also cleanup if window is removed from DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === winEl) {
          cleanup();
          observer.disconnect();
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function playIndex(i) {
    if (!tracks.length) return;
    if (i < 0 || i >= tracks.length) i = 0;
    wmpState.currentIndex = i;
    const track = tracks[i];
    audio.src = track.url;
    audio.play().catch(()=>{});
    highlightPlaylist(playlistEl, i);
    titleEl.textContent = track.name;
    statusEl.textContent = 'Playing';
    resumeCtx(ctx);
  }  audio.addEventListener('ended', () => {
    playIndex((wmpState.currentIndex + 1) % tracks.length);
  });
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      seekEl.value = Math.floor((audio.currentTime / audio.duration) * 1000);
      timeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    } else {
      timeEl.textContent = '00:00 / 00:00';
    }
  });

  seekEl.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (seekEl.value / 1000) * audio.duration;
    }
  });
  volEl.addEventListener('input', () => { audio.volume = Number(volEl.value); });

  root.querySelector('[data-act="play"]').addEventListener('click', () => { if (audio.src) audio.play(); else playIndex(0); resumeCtx(ctx); statusEl.textContent = 'Playing'; });
  root.querySelector('[data-act="pause"]').addEventListener('click', () => audio.pause());
  root.querySelector('[data-act="stop"]').addEventListener('click', () => { audio.pause(); audio.currentTime = 0; });
  root.querySelector('[data-act="prev"]').addEventListener('click', () => playIndex((wmpState.currentIndex - 1 + tracks.length) % tracks.length));
  root.querySelector('[data-act="next"]').addEventListener('click', () => playIndex((wmpState.currentIndex + 1) % tracks.length));

  playlistEl.addEventListener('click', (e) => {
    const row = e.target.closest('[data-idx]');
    if (row) playIndex(Number(row.getAttribute('data-idx')));
  });

  root.querySelector('[data-act="toggle-playlist"]').addEventListener('click', () => {
    const hidden = playlistPanel.hasAttribute('hidden');
    if (hidden) playlistPanel.removeAttribute('hidden'); else playlistPanel.setAttribute('hidden','');
  });

  // Visualization loop
  if (analyser) startVisualizer(wmpState);

  if (tracks.length) playIndex(0); else { statusEl.textContent = 'No MP3 files found in Assets/Music'; titleEl.textContent = 'Windows Media Player'; }
}

async function discoverTracks(statusEl) {
  try {
    statusEl.textContent = 'Scanning Assets/Music/ ...';
    const resp = await fetch('Assets/Music/');
    const txt = await resp.text();
    // naive parse of directory listing
    const tmp = document.createElement('div');
    tmp.innerHTML = txt;
    const links = Array.from(tmp.querySelectorAll('a'));
    const tracks = links.filter(a => /\.mp3$/i.test(a.getAttribute('href')))
      .map(a => {
        const href = a.getAttribute('href');
        const name = decodeURIComponent(href.split('/').pop());
        return { name, url: 'Assets/Music/' + href.replace(/.*\//,'') };
      });
    statusEl.textContent = tracks.length ? `Found ${tracks.length} track(s)` : 'No tracks found';
    return tracks;
  } catch (err) {
    statusEl.textContent = 'Error loading playlist';
    console.error('WMP playlist error', err);
    return [];
  }
}

function renderPlaylist(el, tracks) {
  if (!tracks.length) { el.textContent = 'No tracks'; return; }
  el.innerHTML = tracks.map((t,i) => `<div class="wmp64-track" data-idx="${i}">${escapeHtml(t.name)}</div>`).join('');
}

function highlightPlaylist(el, idx) {
  el.querySelectorAll('.wmp64-track').forEach(div => div.classList.remove('active'));
  const row = el.querySelector(`.wmp64-track[data-idx="${idx}"]`);
  if (row) row.classList.add('active');
}

function startVisualizer(state) {
  const { analyser, canvas } = state;
  if (!analyser || !canvas) return;
  const ctx = canvas.getContext('2d');
  const data = new Uint8Array(analyser.frequencyBinCount);
  function frame() {
    analyser.getByteFrequencyData(data);
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    const bars = data.length / 2; // fewer bars for classic look
    const step = Math.floor(data.length / bars);
    const barW = (canvas.width / bars) - 1;
    for (let i=0, x=0;i<bars;i++, x+=barW+1) {
      const v = data[i*step] / 255;
      const h = v * canvas.height;
      ctx.fillStyle = `rgb(${Math.floor(40+80*v)}, ${Math.floor(200*v)+30}, ${Math.floor(40+80*v)})`;
      ctx.fillRect(x, canvas.height - h, barW, h);
    }
    state.raf = requestAnimationFrame(frame);
  }
  frame();
}

function injectStyles() {
  if (document.getElementById('wmp64-styles')) return;
  const css = `
  .wmp64-root { font:11px 'MS Sans Serif'; display:flex; flex-direction:column; background:#d4d0c8; color:#000; min-width:340px; }
  .wmp64-menubar { background:#d4d0c8; padding:2px 4px; border-bottom:1px solid #808080; display:flex; gap:12px; }
  .wmp64-menubar span { cursor:default; }
  .wmp64-display { background:#000; margin:4px; margin-bottom:2px; padding:4px; border:2px inset #808080; position:relative; }
  .wmp64-title { position:absolute; top:4px; left:8px; font-weight:bold; font-size:10px; color:#0f0; text-shadow:0 0 3px #060; }
  .wmp64-vis { display:block; width:100%; height:100px; background:#000; }
  .wmp64-controls-bar { display:flex; align-items:center; gap:8px; padding:4px; padding-top:0; }
  .wmp64-transport .tb { width:28px; height:22px; font:10px 'MS Sans Serif'; background:#c0c0c0; border:2px solid #fff; box-shadow:inset -1px -1px #000, inset 1px 1px #808080; cursor:pointer; }
  .wmp64-transport .tb:active { box-shadow:inset 1px 1px #000, inset -1px -1px #808080; }
  .wmp64-seek-wrap { flex:1; display:flex; flex-direction:column; gap:2px; }
  .wmp64-seek { width:100%; }
  .wmp64-time { font:10px monospace; text-align:right; }
  .wmp64-vol-wrap { display:flex; align-items:center; }
  .wmp64-vol { width:80px; }
  .wmp64-pl-toggle { font:10px 'MS Sans Serif'; background:#c0c0c0; border:2px solid #fff; box-shadow:inset -1px -1px #000, inset 1px 1px #808080; cursor:pointer; height:22px; }
  .wmp64-playlist-panel { margin:0 4px 4px; border:2px inset #808080; background:#fff; max-height:140px; overflow:auto; padding:4px; }
  .wmp64-pl-header { font-weight:bold; margin-bottom:4px; }
  .wmp64-track { padding:2px 4px; cursor:pointer; font-size:11px; }
  .wmp64-track.active, .wmp64-track:hover { background:#000080; color:#fff; }
  .wmp64-status { border-top:1px solid #808080; padding:2px 6px; font-size:10px; font-style:italic; background:#d4d0c8; }
  `;
  const style = document.createElement('style');
  style.id = 'wmp64-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
function formatTime(sec) { if (!isFinite(sec)) return '00:00'; const m=Math.floor(sec/60); const s=Math.floor(sec%60); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }

function safeAudioContext() {
  try { return new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
}
function resumeCtx(ctx) { if (ctx && ctx.state === 'suspended') ctx.resume().catch(()=>{}); }

// Auto-register installer
if (typeof window !== 'undefined') {
  window.__W98_APPS__ = window.__W98_APPS__ || [];
  window.__W98_APPS__.push(installMediaPlayer);
  if (window.win98Env) installMediaPlayer(window.win98Env);
}

export default installMediaPlayer;
