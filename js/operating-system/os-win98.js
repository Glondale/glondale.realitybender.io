// Windows 98 style operating system layer (simplified placeholder implementation)
// Scope (initial scaffold):
//  - Desktop system with shortcut registration
//  - File manager (Explorer) stub that can launch registered .exe-like app modules
//  - Task manager stub with rudimentary process list + mock performance metrics
//  - Dynamic app loading hooks (future) + filesystem integration (future)
//  - Start menu population API
// NOTE: This is a non-visual, minimal HTML/CSS markup generator for now; full fidelity Win98 theming will be added later.

import { computer } from '../../computer.js';

const WIN98_ID = 'windows98';

class Win98Environment {
	constructor() {
		this.id = WIN98_ID;
		this.version = '4.10.1998';
		this.processes = new Map(); // pid -> { id, title, type, created, status }
		this.nextPid = 1;
		this.desktopShortcuts = []; // { id, title, target }
		this.startMenu = { programs: [] }; // hierarchical list for start menu rendering
		this.mountedDrives = []; // placeholder for future dynamic filesystem
		this.loaded = false;
		this.rootEl = null;
		this.taskbarEl = null;
		this.desktopEl = null;
		this.activePid = null;
		this.perfSamples = [];
		this.perfInterval = null;
		this.windowByPid = new Map(); // pid -> window element
	}

	load(container = document.body) {
		if (this.loaded) return;
		// Ensure the external 98.css theme is present (injected by this OS module)
		ensure98Css();
		this._buildDOM(container);
		this._seedDefaults();
		this._startPerfSampler();
		this.loaded = true;
	}

	_buildDOM(container) {
		const root = document.createElement('div');
		root.className = 'win98-root';
		root.innerHTML = `
			<div class="win98-desktop" id="win98-desktop"></div>
			<div class="win98-taskbar" id="win98-taskbar">
				<button class="win98-start-btn default" id="win98-start-btn">Start</button>
				<div class="win98-task-buttons" id="win98-task-buttons"></div>
				<div class="win98-tray" id="win98-tray">12:00</div>
			</div>
			<div class="win98-start-menu" id="win98-start-menu" hidden></div>
		`;
		container.appendChild(root);
		this.rootEl = root;
		this.desktopEl = root.querySelector('#win98-desktop');
		this.taskbarEl = root.querySelector('#win98-taskbar');
		this.startMenuEl = root.querySelector('#win98-start-menu');

		root.querySelector('#win98-start-btn').addEventListener('click', () => {
			const hidden = this.startMenuEl.hasAttribute('hidden');
			if (hidden) this.renderStartMenu();
			this.startMenuEl.toggleAttribute('hidden');
		});

		document.addEventListener('click', (e) => {
			if (!root.contains(e.target)) return;
			if (!this.startMenuEl.contains(e.target) && e.target.id !== 'win98-start-btn') {
				this.startMenuEl.setAttribute('hidden', '');
			}
		});
	}

	_seedDefaults() {
		// Add minimal shortcuts (example placeholders)
		this.addDesktopShortcut({ id: 'explorer', title: 'My Computer', target: 'explorer.exe' });
		this.addDesktopShortcut({ id: 'taskmgr', title: 'Task Manager', target: 'taskmgr.exe' });
		this.renderDesktop();

		// Add Start menu baseline groups
		this.addStartMenuEntry(['Programs']);
		this.addStartMenuEntry(['Programs', 'Accessories']);
		this.addStartMenuEntry(['Programs', 'Games']);
		// Add sample items
		this.addStartMenuItem(['Programs', 'Games'], { id: 'hearts', title: 'Hearts', target: 'hearts.exe', placeholder: true });
		this.renderStartMenu();
	}

	addDesktopShortcut(entry) {
		this.desktopShortcuts.push(entry);
	}

	renderDesktop() {
		if (!this.desktopEl) return;
		this.desktopEl.innerHTML = '';
		this.desktopShortcuts.forEach(sc => {
			const el = document.createElement('div');
			el.className = 'win98-shortcut';
			el.innerHTML = `<div class="icon"></div><div class="label">${sc.title}</div>`;
			el.addEventListener('dblclick', () => this.launch(sc.target, { title: sc.title }));
			this.desktopEl.appendChild(el);
		});
	}

	addStartMenuEntry(pathParts) {
		let node = this.startMenu; // { programs: [] } root object holds arrays by lower-case category, but we keep simple
		const arr = node.programs;
		// simple linear hierarchical representation for now
		// We'll store entries like { type: 'folder', name, children: [] }
		let currentLevel = arr;
		pathParts.forEach(part => {
			let folder = currentLevel.find(e => e.type === 'folder' && e.name === part);
			if (!folder) {
				folder = { type: 'folder', name: part, children: [] };
				currentLevel.push(folder);
			}
			currentLevel = folder.children;
		});
	}

	addStartMenuItem(pathParts, item) {
		// Traverse / create folders, then push item { type:'item', id, title, target }
		let currentLevel = this.startMenu.programs;
		pathParts.forEach(part => {
			let folder = currentLevel.find(e => e.type === 'folder' && e.name === part);
			if (!folder) {
				folder = { type: 'folder', name: part, children: [] };
				currentLevel.push(folder);
			}
			currentLevel = folder.children;
		});
		currentLevel.push({ type: 'item', ...item });
	}

	renderStartMenu() {
		if (!this.startMenuEl) return;
		// Use a sunken-panel wrapper and a role-based menu per 98.css recommendations
		const html = [
			'<div class="sunken-panel win98-start-menu-inner">',
			'<menu role="tablist">',
			this._renderMenuLevelAsTabs(this.startMenu.programs),
			'</menu>',
			'</div>'
		].join('');
		this.startMenuEl.innerHTML = html;
		this.startMenuEl.querySelectorAll('[data-target]').forEach(el => {
			el.addEventListener('click', () => {
				const target = el.getAttribute('data-target');
				this.startMenuEl.setAttribute('hidden', '');
				this.launch(target, { title: el.textContent.trim() });
			});
		});
	}

	_renderMenuLevel(items) {
		// kept for backward compatibility
		return `<ul class="menu-level">${items.map(item => {
			if (item.type === 'folder') {
				return `<li class="folder">${item.name}${this._renderMenuLevel(item.children)}</li>`;
			} else {
				return `<li class="item" data-target="${item.target}">${item.title}</li>`;
			}
		}).join('')}</ul>`;
	}

	_renderMenuLevelAsTabs(items) {
		// Render top-level entries as tab-like items per 98.css examples (menu > li[role=tab])
		return items.map(item => {
			if (item.type === 'folder') {
				return item.children.map(child => {
					if (child.type === 'folder') return `<li role="tab">${child.name}</li>`;
					return `<li role="tab" data-target="${child.target}">${child.title}</li>`;
				}).join('');
			} else {
				return `<li role="tab" data-target="${item.target}">${item.title}</li>`;
			}
		}).join('');
	}

	launch(target, options = {}) {
		// Determine if target ends with .exe and map to module / process id
		if (!target) return;
		if (target === 'explorer.exe') return this._openExplorer();
		if (target === 'taskmgr.exe') return this._openTaskManager();
		// Placeholder for dynamic registered apps (future)
		const pid = this._spawnProcess({ id: target, title: options.title || target });
		this._attachProcessWindow(pid, `<div class="app-generic">Application placeholder for ${target}</div>`);
	}

	_spawnProcess(proc) {
		const pid = this.nextPid++;
		this.processes.set(pid, { pid, status: 'running', created: Date.now(), ...proc });
		this._renderTaskButtons();
		return pid;
	}

	_terminateProcess(pid) {
		this.processes.delete(pid);
			// cleanup lingering window ref if any
			const w = this.windowByPid.get(pid);
			if (w && w.parentNode) try { w.remove(); } catch(e) {}
			this.windowByPid.delete(pid);
		this._renderTaskButtons();
	}

	_attachProcessWindow(pid, contentHTML) {
		const proc = this.processes.get(pid);
		if (!proc) return;
		const win = document.createElement('div');
		// Keep legacy class while adding 98.css `.window` for compatibility
		win.className = 'window win98-window';
		win.setAttribute('role','dialog');
		win.innerHTML = `
			<div class="title-bar">
				<div class="title-bar-text"><span class="title">${proc.title}</span></div>
				<div class="title-bar-controls controls"><button aria-label="Close" data-act="close"></button></div>
			</div>
			<div class="window-body">${contentHTML}</div>
		`;
    win.querySelector('[data-act="close"]').addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.closeProcess(pid);
    });
    // focus on pointer down
    win.addEventListener('pointerdown', (e) => { this._focusWindow(pid, win); });
    // make window draggable by its title bar
    const titleBar = win.querySelector('.title-bar');
    titleBar.style.touchAction = 'none';
    titleBar.style.cursor = 'move';		let dragging = false;
		let startX = 0, startY = 0, origX = 0, origY = 0;
		const onPointerMove = (e) => {
			if (!dragging) return;
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;
			win.style.left = (origX + dx) + 'px';
			win.style.top = (origY + dy) + 'px';
		};
		const onPointerUp = (e) => {
			if (!dragging) return;
			dragging = false;
			try { titleBar.releasePointerCapture(e.pointerId); } catch (err) {}
			document.removeEventListener('pointermove', onPointerMove);
			document.removeEventListener('pointerup', onPointerUp);
		};
		titleBar.addEventListener('pointerdown', (e) => {
			// Don't start drag if clicking on control buttons
			if (e.target.closest('.controls')) return;
			// initialize drag
			dragging = true;
			this._focusWindow(pid, win);
			startX = e.clientX; startY = e.clientY;
			// compute current position
			const rect = win.getBoundingClientRect();
			origX = rect.left; origY = rect.top;
			try { titleBar.setPointerCapture(e.pointerId); } catch (err) {}
			document.addEventListener('pointermove', onPointerMove);
			document.addEventListener('pointerup', onPointerUp);
		});
	// set initial position so multiple windows don't stack exactly
	win.style.position = 'absolute';
	const offset = (pid % 8) * 20;
	win.style.left = (120 + offset) + 'px';
	win.style.top = (80 + offset) + 'px';
	this.desktopEl.appendChild(win);
		this.windowByPid.set(pid, win);
	this._focusWindow(pid, win);
	}

	_focusWindow(pid, winEl) {
		this.activePid = pid;
		// naive z-index ordering
		document.querySelectorAll('.win98-window').forEach(w => w.style.zIndex = 10);
		winEl.style.zIndex = 100;
		this._highlightTaskButton(pid);
	}

	_highlightTaskButton(pid) {
		const btns = this.taskbarEl.querySelectorAll('.task-btn');
		btns.forEach(b => b.classList.toggle('active', Number(b.dataset.pid) === pid));
	}

	_renderTaskButtons() {
		const container = this.taskbarEl.querySelector('#win98-task-buttons');
		container.innerHTML = '';
		Array.from(this.processes.values()).forEach(proc => {
			const btn = document.createElement('button');
			btn.className = 'task-btn';
			btn.dataset.pid = proc.pid;
			btn.textContent = proc.title;
			btn.addEventListener('click', () => {
				const win = Array.from(document.querySelectorAll('.win98-window')).find(w => w.querySelector('.title').textContent === proc.title);
				if (win) this._focusWindow(proc.pid, win); else this._attachProcessWindow(proc.pid, '<div class="app-restored">(Restored)</div>');
			});
			container.appendChild(btn);
		});
	}

	_openExplorer() {
		const pid = this._spawnProcess({ id: 'explorer', title: 'Explorer' });
		const html = `
			<div class="explorer-pane">
				<div class="sidebar field-border" data-role="drives">(Drives)</div>
				<div class="content sunken-panel" data-role="content">(Loading...)</div>
			</div>`;
		this._attachProcessWindow(pid, html);

			// after attach, hydrate
			setTimeout(async () => {
				const win = this._findWindowByPid(pid);
				if (!win) return;
				const drivesEl = win.querySelector('[data-role="drives"]');
				const contentEl = win.querySelector('[data-role="content"]');

				// Map drives to data folders (mirror repo data/)
				const drives = [ { name: 'C:', path: 'data/C/' }, { name: 'D:', path: 'data/D/' }, { name: 'FUTURE', path: 'data/FUTURE/' } ];
				drivesEl.innerHTML = drives.map(d => `<div class="drive" data-path="${d.path}">${d.name}</div>`).join('');

				// click handler for drives
				drivesEl.querySelectorAll('.drive').forEach(el => {
					el.addEventListener('click', async () => {
						// highlight
						drivesEl.querySelectorAll('.drive').forEach(d => d.classList.toggle('active', d===el));
						const path = el.getAttribute('data-path');
						await renderDir(path);
					});
				});

				// render initial drive (C:)
				await renderDir(drives[0].path);

				async function renderDir(path) {
					contentEl.innerHTML = `<div class="explorer-header">${path}</div><div class="explorer-list">Loading...</div>`;
					const listEl = contentEl.querySelector('.explorer-list');
					try {
						const entries = await (this && this._fetchDir ? this._fetchDir(path) : window.fetch(path).then(r=>r.text()));
						// if _fetchDir returned a list, use it; otherwise show raw
						if (Array.isArray(entries)) {
							if (entries.length === 0) listEl.textContent = '(empty)';
							else listEl.innerHTML = entries.map((e,i) => `<div class="explorer-entry" data-path="${path}${e.name}" data-isdir="${e.isDir}">${e.isDir? '📁':'📄'} ${e.name}</div>`).join('');
							// attach click / dblclick
							listEl.querySelectorAll('.explorer-entry').forEach(el => {
								el.addEventListener('dblclick', async (ev) => {
									const isDir = el.getAttribute('data-isdir') === 'true';
									const p = el.getAttribute('data-path');
									if (isDir) {
										await renderDir(p + (p.endsWith('/')? '':'/'));
									} else {
										// open files: if .txt, load into notepad
										if (/\.txt$/.test(p)) {
											try {
												const content = await (this && this._fetchFile ? this._fetchFile(p) : window.fetch(p).then(r=>r.text()));
												if (this && this.launch) this.launch('notepad.exe', { content, title: p.split('/').pop() });
											} catch (err) { listEl.textContent = 'Failed to open file'; }
										} else {
											// for unknown files, attempt to download or show info
											window.open(p, '_blank');
										}
									}
								});
							});
						} else {
							listEl.textContent = 'Unable to parse directory listing';
						}
					} catch (err) {
						listEl.textContent = 'Error reading directory';
					}
				}
				// bind correct this for inner functions
				renderDir = renderDir.bind(this);
			}, 30);
	}

		// fetch directory listing and return array [{name,isDir}]
		async _fetchDir(path) {
			try {
				const resp = await fetch(path);
				const txt = await resp.text();
				const tmp = document.createElement('div');
				tmp.innerHTML = txt;
				const links = Array.from(tmp.querySelectorAll('a'));
				// filter out parent link and map
				const items = links.map(a => {
					const href = a.getAttribute('href');
					const name = decodeURIComponent(href.split('/').filter(Boolean).pop());
					const isDir = href.endsWith('/');
					return { name, href, isDir };
				}).filter(it => it.name && it.name !== '..');
				return items;
			} catch (err) {
				console.error('fetchDir error', err);
				return [];
			}
		}

		async _fetchFile(path) {
			try {
				const resp = await fetch(path);
				return await resp.text();
			} catch (err) {
				console.error('fetchFile error', err);
				throw err;
			}
		}

	_openTaskManager() {
		const pid = this._spawnProcess({ id: 'taskmgr', title: 'Task Manager' });
		const html = `
			<div class="taskmgr">
				<div class="tabs">
					<button data-tab="tasks" class="active">Applications</button>
					<button data-tab="performance">Performance</button>
				</div>
				<div class="panel" data-panel="tasks"></div>
				<div class="panel" data-panel="performance" hidden>
					<canvas width="240" height="80" class="perf-canvas"></canvas>
				</div>
			</div>`;
		this._attachProcessWindow(pid, html);
		this._renderTaskManager(pid);
	}

	_renderTaskManager(pid) {
		const win = this._findWindowByPid(pid);
		if (!win) return;
		const tasksPanel = win.querySelector('[data-panel="tasks"]');
		const perfPanel = win.querySelector('[data-panel="performance"]');
		const tabs = win.querySelectorAll('.tabs button');
		tabs.forEach(btn => btn.addEventListener('click', () => {
			tabs.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			const tab = btn.getAttribute('data-tab');
			tasksPanel.hidden = tab !== 'tasks';
			perfPanel.hidden = tab !== 'performance';
			if (tab === 'performance') this._drawPerf(win.querySelector('.perf-canvas'));
		}));

		const renderTasks = () => {
			// Wrap table in sunken-panel and use `interactive` table class per 98.css TableView guidance
			tasksPanel.innerHTML = `<div class="sunken-panel" style="max-height:220px; overflow:auto;"><table class="interactive"><thead><tr><th>PID</th><th>Title</th><th>Status</th><th>Action</th></tr></thead><tbody>${Array.from(this.processes.values()).map(p => `<tr><td>${p.pid}</td><td>${p.title}</td><td>${p.status}</td><td><button data-kill="${p.pid}">End</button></td></tr>`).join('')}</tbody></table></div>`;
			tasksPanel.querySelectorAll('[data-kill]').forEach(btn => {
				btn.addEventListener('click', (e) => {
					e.preventDefault();
					e.stopPropagation();
					const kpid = Number(btn.getAttribute('data-kill'));
				  this.closeProcess(kpid);
				  // Force immediate re-render
				  setTimeout(() => renderTasks(), 10);
				});
			});
		};
		renderTasks();

		// refresh tasks when processes change (simplistic)
		const unsub = computer.on('system:tick', () => {
			if (!document.body.contains(win)) { unsub(); return; }
			renderTasks();
			if (!perfPanel.hidden) this._drawPerf(win.querySelector('.perf-canvas'));
		});
	}

	_findWindowByPid(pid) {
			if (this.windowByPid.has(pid)) return this.windowByPid.get(pid);
			return Array.from(document.querySelectorAll('.win98-window')).find(w => w.querySelector('.title')?.textContent === this.processes.get(pid)?.title);
	}

	closeProcess(pid) {
		if (!this.processes.has(pid)) return;
		const win = this.windowByPid.get(pid);
		if (win && win.parentNode) {
			try { win.remove(); } catch(e) {}
		}
		this.windowByPid.delete(pid);
		this._terminateProcess(pid); // handles process map + task buttons cleanup
		// Emit event for any listeners (like Task Manager)
		computer.emit('process:closed', { pid });
	}	_startPerfSampler() {
		this.perfInterval = setInterval(() => {
			const sample = {
				t: Date.now(),
				cpu: Math.random() * 60 + 10, // placeholder random utilization
				mem: Math.random() * 50 + 30  // placeholder random memory usage
			};
			this.perfSamples.push(sample);
			if (this.perfSamples.length > 120) this.perfSamples.shift();
		}, 1000);
	}

	_drawPerf(canvas) {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#004';
		ctx.fillRect(0,0,canvas.width, canvas.height);
		const cpuPoints = this.perfSamples.slice(-canvas.width).map(s => s.cpu);
		ctx.strokeStyle = '#0f0';
		ctx.beginPath();
		cpuPoints.forEach((v,i) => {
			const y = canvas.height - (v/100)*canvas.height;
			if (i===0) ctx.moveTo(i,y); else ctx.lineTo(i,y);
		});
		ctx.stroke();
		ctx.fillStyle = '#fff';
		ctx.font = '10px monospace';
		const last = this.perfSamples[this.perfSamples.length -1];
		if (last) ctx.fillText(`CPU ${last.cpu.toFixed(1)}% MEM ${last.mem.toFixed(1)}%`, 4, 12);
	}
}

// Load the main 98.css theme dynamically so this module controls its own theme.
function ensure98Css() {
	if (typeof document === 'undefined') return;
	if (document.getElementById('cdn-98css')) return;
	// Prefer local node_modules copy when available. Try dist/98.css then style.css, else fall back to CDN.
	const candidates = [
		'/node_modules/98.css/dist/98.css',
		'/node_modules/98.css/style.css',
		'https://jdan.github.io/98.css/98.css'
	];
	const tryInject = (href) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = href;
		link.id = 'cdn-98css';
		link.crossOrigin = 'anonymous';
		document.head.appendChild(link);
	};
	// Probe local files using fetch; if reachable, inject, otherwise try next candidate.
	(async () => {
		for (const href of candidates) {
			if (href.startsWith('http')) { tryInject(href); break; }
			try {
				const r = await fetch(href, { method: 'HEAD' });
				if (r.ok) { tryInject(href); break; }
			} catch (e) {
				// ignore and try next
			}
		}
	})();
}

// Minimal compatibility shim: rely on external 98.css for core styles, keep a tiny override for our custom classes.
(function injectWin98CompatStyles(){
	if (document.getElementById('win98-compat')) return;
	const css = `
	/* Compatibility overrides to work with https://jdan.github.io/98.css/98.css */
	.win98-root { width:100vw; height:100vh; overflow:hidden; font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif; background-color:#008080; background-image: url('Assets/Wallpapers/W95-98.webp'); background-position:center; background-repeat:no-repeat; background-size:auto; }
	.win98-desktop { position:absolute; inset:0; padding:8px; display:flex; flex-wrap:wrap; align-content:flex-start; gap:12px; }
	.win98-shortcut { width:72px; text-align:center; color:#000; font-size:12px; cursor:default; }
	.win98-shortcut .icon { width:32px; height:32px; margin:0 auto 4px; background:linear-gradient(#ffffff,#c0c0c0); border:1px solid #000; box-shadow: 1px 1px 0 #808080; }
	.win98-taskbar { position:absolute; left:0; right:0; bottom:0; height:36px; display:flex; align-items:center; gap:6px; padding:4px; }
	.win98-window { position:absolute; background:#c0c0c0; border:2px solid #fff; box-shadow: 2px 2px 0 #808080, -1px -1px 0 #fff; }
	.win98-window .title-bar { height:20px; padding:2px 6px; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; }
	.win98-window .window-body { padding:8px; min-height:120px; }
	.win98-start-menu { position:absolute; left:6px; bottom:42px; width:220px; }
	.explorer-pane { display:flex; gap:8px; }
	/* keep task button text from wrapping */
	.task-btn { white-space:nowrap; }
	/* small utility tweaks for embedded canvases / perf widget */
	.perf-canvas { display:block; background:#000; margin-top:6px; border:2px inset #808080; }
	`;
	const style = document.createElement('style');
	style.id = 'win98-compat';
	style.textContent = css;
	document.head.appendChild(style);
})();

export function loadWindows98() {
	const env = new Win98Environment();
	env.load();
	// make the running env available globally for app installers / debugging
	try { window.win98Env = env; } catch (e) { /* no-op if not in browser */ }

	// If apps queued before the OS loaded, call their installer with the env
	if (typeof window !== 'undefined' && Array.isArray(window.__W98_APPS__)) {
		window.__W98_APPS__.forEach(fn => {
			try { if (typeof fn === 'function') fn(env); } catch (err) { console.error('W98 app install error', err); }
		});
	}

	computer.emit('os:loaded', { id: WIN98_ID });
	return env;
}

// Auto-load if desired (optional for now)
if (typeof window !== 'undefined') {
	window.loadWindows98 = loadWindows98;
}

