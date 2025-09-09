<!--
Reality-Bending OS (RBOS) - repository guidance for automated coding agents

Keep this short, focused and actionable. Do not add general coding advice — focus on
the concrete patterns and files used in this repo so an AI agent can make safe edits.
-->

# RBOS — Copilot instructions

Purpose: Help an AI coding agent become productive quickly in this small browser-run OS prototype.

Key locations
- `index.html` — app entry, script load order matters: core (`js/core/*.js`) → UI (`js/ui/*.js`) → apps (`js/apps/*.js`) → GameEngine.start()
- `js/core/` — core runtime (EventSystem, GameEngine, OSManager, contentLoader, FileSystem, WindowManager, PluginManager).
- `js/ui/` — UI shell and menus. `UIManager.renderDesktop(env)` is the central DOM renderer.
- `js/apps/` — individual app modules. Apps must register with `PluginManager.register(id, factory)`.
- `css/core/base.css` and `css/themes/*` — theming is applied by swapping `<link id="theme-stylesheet">` and adding `theme-<name>` classes on `#desktop-root`.

Architecture overview (big picture)
- Single-page app. The engine loads an OS JSON from `config/os/<version>.json` via `contentLoader.loadOSVersion()` then calls `OSManager.initialize(env)`.
- `OSManager` emits `os:initialized`. `UIManager.renderDesktop(env)` constructs two DOM regions: `.desktop-area` (wallpaper + icons) and `.taskbar` (fixed bottom). Theme classes are applied to `#desktop-root`.
- Plugin pattern: `PluginManager` stores factories under ids. UI and apps call `PluginManager.create(id)` to obtain instances. Some apps register factories (functions returning new instances), others register constructors/classes — `PluginManager.create` attempts both.
- Window model: `WindowManager.createWindow(title, html, opts)` builds draggable windows attached to `#desktop-root`.
- Virtual data layer: `FileSystem` fetches virtual files from `data/virtual-files/*` and reads OS-specific unlocks from `config/os/*.json`.

Important conventions and gotchas
- Script load order is critical. Never move app script tags before `js/core/plugin-manager.js` and `js/core/window-manager.js` in `index.html`.
- `UIManager.renderDesktop(env)` may replace DOM nodes; avoid relying on element identity across renders. Prefer listening to `EventSystem` events (e.g., `os:initialized`, `engine:ready`).
- Plugins must be registered on the global `window.PluginManager`. Use `window.PluginManager.register('id', ()=> new MyApp())` or `window.PluginManager.register('id', MyConstructor)` consistently.
- When changing themes, update both the stylesheet href (`#theme-stylesheet`) and add/remove `theme-<name>` class on `#desktop-root` to keep CSS selectors consistent.
- File paths: virtual filesystem maps Windows-style paths to `data/virtual-files/<drive-folder>/...`. Use `FileSystem.readFile('C:/path')` and friends.

Dev/debug workflows (quick commands and tips)
- Run a static server from repo root to serve assets (from dev container):
  - python3 -m http.server 8000
  Then open `http://localhost:8000` in the browser.
- Use browser DevTools console to inspect runtime globals (helpful checks):
  - `window.PluginManager.list()` — lists registered plugin ids
  - `window.OSManager.env` — current OS env
  - `window.UIManager.renderDesktop` — callable function
  - `window.GameEngine.start()` — restart/trigger boot
- If an app doesn't open: check console logs for messages from `PluginManager.create()` and Start Menu handlers. We added verbose logging to `js/core/plugin-manager.js` and `js/ui/start-menu.js`.

Patterns for safe edits
- Prefer non-destructive theme changes: update `#theme-stylesheet.href` with a cache-busting `?cb=...` param and call `UIManager.renderDesktop(env)` with merged env to avoid wiping runtime state.
- When adding or editing apps in `js/apps/`, ensure they register with `PluginManager` and expose an `.open()` method on instances. Tests and smoke-tests in `js/core/game-engine.js` try to create `explorer` and `email` at boot.
- When updating core modules, run a fast smoke test: open the page and verify console logs include:
  - `GameEngine: starting, osVersion=`
  - `Plugin registered <id>` for expected apps
  - `PluginManager.create requested id=` when opening apps

Files to read first
- `js/core/plugin-manager.js` — registration & create fallback (factory vs constructor)
- `js/ui/desktop-shell.js` — how desktop and taskbar are laid out and where Start Menu/Test Menu hooks plug in
- `js/ui/start-menu.js` — mapping of menu item `app` ids used across the UI
- `js/apps/` small apps (notepad.js, explorer.js, email.js) — examples of how apps are written and how they interact with FileSystem and WindowManager

Non-obvious decisions
- Some apps register classes (e.g., `file-explorer.js` registers a class) while many register factories (`()=> new App()`). `PluginManager.create()` supports both, but prefer factory registration for simpler semantics.
- The debug overlay and smoke-tests were intentionally added to help automated agents validate plugin presence. Use them when making changes.

When in doubt
- Run the app locally and check the debug overlay (top-right) for `plugins:` list and use the overlay buttons to try opening Explorer/Email.
- If editing `UIManager.renderDesktop`, ensure you don't delete global references like `window.PluginManager` or `window.UIManager`.

If you want, I can also add small unit-style smoke scripts under `tools/` that run quick DOM-less checks (e.g., verifying all `app` ids in `start-menu.js` have a registration). Ask and I'll add them.
