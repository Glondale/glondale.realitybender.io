<!--
Reality-Bending OS (RBOS) — concise guidance for AI coding agents

This file focuses on concrete, repo-specific patterns and must be kept short. Avoid general advice.
-->

# RBOS — Copilot instructions (updated)

 Quick context
 - Single-page browser OS prototype. Primary runtime pieces you need now: `computer.js` (container), `js/core/app-loader.js` (dynamic app discovery), OS layer at `js/operating-system/os-win98.js`, and apps under `js/Apps/`.

Key files to read first
- `computer.js` — global Computer singleton, event bus, boot lifecycle, tick loop. Available as `window.computer` in the browser.
 - `js/operating-system/os-win98.js` — current Windows98 OS implementation (desktop, Start menu, Explorer stub, Task Manager). Exposes `window.win98Env` after load and defines `loadWindows98()`.
- `js/core/app-loader.js` — imports all app modules found under `/js/Apps/` on page load (discovery relies on server directory listing). This makes app modules execute and register installers.
- `js/Apps/*` — app modules should export an installer (default) and auto-register via `window.__W98_APPS__` or execute installer on import.
- `index.html` — script order matters: app-loader should run before the OS loader so apps can register themselves before OS initialization.

How apps are discovered & registered (important)
- App discovery is dynamic: `app-loader.js` scrapes `/js/Apps/` (recursively) and imports discovered `.js` modules every page load — this is in-memory only.
- App modules should push an installer function to the global installer queue: `window.__W98_APPS__ = window.__W98_APPS__ || []; window.__W98_APPS__.push(installFn);`
- When `loadWindows98()` runs it calls queued installers with the running env (the OS also auto-installs queued apps if loaded after apps).
- Example pattern (look at `js/Apps/W98/notepad.js`): export default installer and auto-queue on import.

Runtime globals and debug checks
- `window.computer` — Computer singleton (boot, events). Useful events: `system:boot:complete`, `system:tick`.
- `window.win98Env` — Win98 environment after OS loads (exposes methods like `addStartMenuItem`, `launch`, `_spawnProcess` — internals prefixed with `_` but used by apps now).
- `window.__RBOS_APPS_LOADED__` — list of imported app module paths produced by the loader.

Dev & test workflow (exact commands)
- Serve from repo root (dev):
  ```bash
  python3 -m http.server 8000
  ```
  Then open `http://localhost:8000`.
- Open DevTools console and verify:
  - `window.computer` exists
  - `window.__RBOS_APPS_LOADED__` lists modules the loader imported
  - `window.win98Env` after `system:boot:complete` (or call `loadWindows98()` manually)

Conventions and gotchas
- Script load order: app-loader must run before the OS loader in `index.html` if apps should auto-register prior to OS initialization.
- Server requirement: dynamic discovery depends on HTML directory listings (works with `python3 -m http.server`). If deploying where listings are disabled, add a manifest or run a build-time generator.
 - Folder name: `js/operating-system/` is the preferred folder name to avoid spaces in import paths; update imports to the new path when moving files.
- App API: installers receive the env. Currently apps may call env internals (e.g., `_spawnProcess`, `_attachProcessWindow`) — treat these as stable for now but avoid changing their names without updating apps.

Quick examples
- Add a new app at `js/Apps/W98/example.js`:
  ```js
  export default function installExample(env) {
    env.addStartMenuItem(['Programs','Accessories'], { id: 'example', title: 'Example', target: 'example.exe' });
    // implement launch handling via env.launch patching or by relying on env to call registered handlers
  }
  // auto-register
  window.__W98_APPS__ = window.__W98_APPS__ || [];
  window.__W98_APPS__.push(installExample);
  if (window.win98Env) installExample(window.win98Env);
  ```

When to ask for help / edit core
- If you change the OS loader (`loadWindows98`) or the installer queue behavior, update `index.html` and `app-loader.js` accordingly and run a local smoke test (serve and confirm `window.__RBOS_APPS_LOADED__` and Start menu entries).
- If you modify window management (title-bar, z-order, drag handlers), test with multiple apps open and verify Taskbar buttons sync.

If anything here looks incomplete or outdated for the tasks you want automated agents to do, tell me which area to expand (app model, FS integration, build-time manifest generation, or folder rename) and I will iterate.
