// computer.js
// Core container / manager for the future retro computer exploration game.
// This file purposefully stays lean. Other functionality will live in future modular files.
// Responsibility: track high-level computer state, manage modules, basic event bus, lifecycle hooks.

class Computer {
  constructor(options = {}) {
    this.version = '0.1.0-dev';
    this.poweredOn = false;
    this.bootStage = 'off'; // off | powering_on | firmware | os_loader | desktop | error | shutting_down
    this.createdAt = Date.now();
    this.modules = new Map(); // name -> module object
    this.events = new Map(); // eventName -> Set(listeners)
    this.log = [];
    this.config = Object.freeze({
      autoBoot: options.autoBoot ?? false,
      tickIntervalMs: options.tickIntervalMs ?? 1000 / 30 // 30 Hz logical tick baseline (may change later)
    });
    this._tickHandle = null;

    this._record('computer:init', { version: this.version });

    if (this.config.autoBoot) {
      queueMicrotask(() => this.boot());
    }
  }

  // --- Public API --------------------------------------------------------

  registerModule(name, moduleObj) {
    if (!name || typeof name !== 'string') throw new Error('Module name must be a non-empty string');
    if (this.modules.has(name)) throw new Error(`Module '${name}' already registered`);
    this.modules.set(name, moduleObj);
    this._record('module:registered', { name });
    this.emit('module:registered', { name, module: moduleObj });
    return moduleObj;
  }

  getModule(name) {
    return this.modules.get(name);
  }

  on(eventName, listener) {
    if (typeof listener !== 'function') throw new Error('Listener must be a function');
    if (!this.events.has(eventName)) this.events.set(eventName, new Set());
    this.events.get(eventName).add(listener);
    return () => this.off(eventName, listener); // unsubscribe handle
  }

  once(eventName, listener) {
    const wrap = (data) => { this.off(eventName, wrap); listener(data); };
    return this.on(eventName, wrap);
  }

  off(eventName, listener) {
    const set = this.events.get(eventName);
    if (set) set.delete(listener);
  }

  emit(eventName, data) {
    const set = this.events.get(eventName);
    if (set) {
      for (const fn of Array.from(set)) {
        try { fn(data); } catch (err) { this._record('listener:error', { eventName, error: err.message }); }
      }
    }
  }

  boot() {
    if (this.poweredOn) return;
    this.poweredOn = true;
    this.bootStage = 'powering_on';
    this._record('system:boot:start');
    this.emit('system:boot:start');

    // Simulated staged boot sequence (placeholder logic for now)
    const stages = [
      ['firmware', 200],
      ['os_loader', 300],
      ['desktop', 250]
    ];
    let totalDelay = 0;
    stages.forEach(([stage, delay]) => {
      totalDelay += delay;
      setTimeout(() => {
        this.bootStage = stage;
        this._record('system:boot:stage', { stage });
        this.emit('system:boot:stage', { stage });
        if (stage === 'desktop') {
          this._record('system:boot:complete');
          this.emit('system:boot:complete');
          this._startTickLoop();
        }
      }, totalDelay);
    });
  }

  shutdown() {
    if (!this.poweredOn) return;
    this.bootStage = 'shutting_down';
    this.emit('system:shutdown:start');
    this._record('system:shutdown:start');
    setTimeout(() => {
      this.poweredOn = false;
      this.bootStage = 'off';
      this._stopTickLoop();
      this._record('system:shutdown:complete');
      this.emit('system:shutdown:complete');
    }, 300);
  }

  tick() {
    // Placeholder for future per-frame logic (e.g., timers, interrupts, message queue).
    this.emit('system:tick', { timestamp: performance.now() });
  }

  getStateSnapshot() {
    return Object.freeze({
      version: this.version,
      poweredOn: this.poweredOn,
      bootStage: this.bootStage,
      moduleCount: this.modules.size,
      uptimeMs: this.poweredOn ? Date.now() - this.createdAt : 0
    });
  }

  getLog(limit = 50) {
    return this.log.slice(-limit);
  }

  // --- Internals ---------------------------------------------------------

  _record(type, data = {}) {
    this.log.push({ t: Date.now(), type, ...data });
    if (this.log.length > 500) this.log.splice(0, this.log.length - 500); // cap basic log size
  }

  _startTickLoop() {
    if (this._tickHandle) return;
    const loop = () => {
      if (!this.poweredOn) return;
      try { this.tick(); } catch (e) { this._record('tick:error', { error: e.message }); }
      this._tickHandle = setTimeout(loop, this.config.tickIntervalMs);
    };
    loop();
  }

  _stopTickLoop() {
    if (this._tickHandle) {
      clearTimeout(this._tickHandle);
      this._tickHandle = null;
    }
  }
}

// Expose a singleton instance for now (can evolve later)
export const computer = new Computer({ autoBoot: true });

// For quick console access in browser dev tools
if (typeof window !== 'undefined') {
  window.computer = computer;
}

export default Computer;
