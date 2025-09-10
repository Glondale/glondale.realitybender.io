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
				<button class="win98-start-btn" id="win98-start-btn">Start</button>
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
		const html = [
			'<div class="win98-start-menu-inner">',
			this._renderMenuLevel(this.startMenu.programs),
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
		return `<ul class="menu-level">${items.map(item => {
			if (item.type === 'folder') {
				return `<li class="folder">${item.name}${this._renderMenuLevel(item.children)}</li>`;
			} else {
				return `<li class="item" data-target="${item.target}">${item.title}</li>`;
			}
		}).join('')}</ul>`;
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
		win.className = 'win98-window';
		win.innerHTML = `
			<div class="title-bar">
				<span class="title">${proc.title}</span>
				<div class="controls"><button data-act="close">X</button></div>
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
				<div class="sidebar">(Drives placeholder)</div>
				<div class="content">(File list placeholder \u2014 future dynamic FS mount)</div>
			</div>`;
		this._attachProcessWindow(pid, html);
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
			tasksPanel.innerHTML = `<table class="task-table"><tr><th>PID</th><th>Title</th><th>Status</th><th>Action</th></tr>${Array.from(this.processes.values()).map(p => `<tr><td>${p.pid}</td><td>${p.title}</td><td>${p.status}</td><td><button data-kill="${p.pid}">End</button></td></tr>`).join('')}</table>`;
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

// Minimal CSS injection to emulate Windows 98 vibe (placeholder; to be refined for authenticity)
(function injectStyles(){
	if (document.getElementById('win98-styles')) return;
	const css = `
	.win98-root { position:relative; width:100vw; height:100vh; background:#008080 url('') center/cover; overflow:hidden; font-family: 'MS Sans Serif', Tahoma, sans-serif; }
	.win98-desktop { position:absolute; inset:0; padding:8px; display:flex; flex-wrap:wrap; align-content:flex-start; gap:12px; }
	.win98-shortcut { width:64px; text-align:center; color:#fff; font-size:11px; cursor:default; }
	.win98-shortcut .icon { width:32px; height:32px; margin:0 auto 4px; background:linear-gradient(#c0c0c0,#808080); border:1px solid #000; }
	.win98-taskbar { position:absolute; left:0; right:0; bottom:0; height:32px; background:#c0c0c0; border-top:2px solid #fff; display:flex; align-items:center; gap:4px; padding:2px 4px; box-shadow:inset 0 1px #808080; }
	.win98-start-btn { font:11px 'MS Sans Serif'; background:#c0c0c0; border:2px solid #fff; box-shadow:inset -1px -1px #000, inset 1px 1px #808080; cursor:pointer; }
	.win98-task-buttons { flex:1; display:flex; gap:4px; }
	.task-btn { font:11px 'MS Sans Serif'; padding:2px 6px; background:#c0c0c0; border:2px solid #fff; box-shadow:inset -1px -1px #000, inset 1px 1px #808080; }
	.task-btn.active { outline:1px dashed #000; }
	.win98-tray { font:11px monospace; padding:2px 6px; background:#c0c0c0; border:2px solid #fff; box-shadow:inset -1px -1px #000, inset 1px 1px #808080; }
	.win98-window { position:absolute; top:80px; left:120px; width:360px; background:#c0c0c0; border:2px solid #fff; box-shadow:inset -2px -2px #000, inset 2px 2px #808080; }
	.win98-window .title-bar { background:linear-gradient(90deg,#000080,#1084d0); color:#fff; padding:2px 4px; display:flex; justify-content:space-between; align-items:center; font:11px 'MS Sans Serif'; }
	.win98-window .title-bar .controls button { font:11px 'MS Sans Serif'; }
	.win98-window .window-body { background:#c0c0c0; padding:6px; font:11px 'MS Sans Serif'; min-height:120px; }
	.win98-start-menu { position:absolute; left:0; bottom:32px; width:220px; background:#c0c0c0; border:2px solid #fff; box-shadow:inset -2px -2px #000, inset 2px 2px #808080; font:11px 'MS Sans Serif'; }
	.win98-start-menu-inner { max-height:300px; overflow:auto; }
	.win98-start-menu ul { list-style:none; margin:4px; padding:0; }
	.win98-start-menu li { margin:2px 0; }
	.win98-start-menu li.item { cursor:pointer; padding:2px 4px; }
	.win98-start-menu li.item:hover { background:#000080; color:#fff; }
	.win98-start-menu li.folder > ul { margin-left:12px; }
	.explorer-pane { display:flex; gap:8px; }
	.explorer-pane .sidebar { width:120px; background:#fff; padding:4px; border:1px solid #000; }
	.explorer-pane .content { flex:1; background:#fff; padding:4px; border:1px solid #000; }
	.taskmgr .tabs { display:flex; gap:4px; margin-bottom:4px; }
	.taskmgr .tabs button { font:11px 'MS Sans Serif'; }
	.taskmgr .panel { background:#fff; border:1px solid #000; padding:4px; }
	.taskmgr table { width:100%; border-collapse:collapse; font:11px 'MS Sans Serif'; }
	.taskmgr th, .taskmgr td { border:1px solid #808080; padding:2px 4px; text-align:left; }
	.perf-canvas { display:block; background:#000; margin-top:4px; border:1px solid #808080; }
	`;
	const style = document.createElement('style');
	style.id = 'win98-styles';
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

