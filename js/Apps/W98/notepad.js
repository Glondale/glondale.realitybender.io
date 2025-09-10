// notepad.js - simple Notepad app installer for Win98 environment
// Location: js/Apps/W98/notepad.js

export default function installNotepad(env) {
  if (!env) throw new Error('Win98 env instance required');

  const target = 'notepad.exe';
  // add to Start -> Programs -> Accessories
  try { env.addStartMenuItem(['Programs','Accessories'], { id: 'notepad', title: 'Notepad', target }); } catch (e) { /* ignore if method missing */ }

  // patch env.launch to provide a native notepad window when requested
  if (!env.__notepad_patched__) {
    env.__notepad_patched__ = true;
    const origLaunch = env.launch.bind(env);
    env.launch = (tgt, options = {}) => {
      if (tgt === target) {
        const pid = env._spawnProcess({ id: 'notepad', title: options.title || 'Notepad' });
        const content = `
          <div class="notepad-app">
            <div style="margin-bottom:6px;"><button data-save>Save</button> <button data-close>Close</button></div>
            <textarea class="notepad-textarea" style="width:100%;height:240px;font-family:monospace;font-size:13px;">${options.content || ''}</textarea>
            <div class="notepad-status" style="font-size:11px;margin-top:6px;color:#333;"></div>
          </div>
        `;
        env._attachProcessWindow(pid, content);

        // attach handlers once window exists in DOM
        setTimeout(() => {
          const win = env._findWindowByPid ? env._findWindowByPid(pid) : null;
          if (!win) return;
          const textarea = win.querySelector('.notepad-textarea');
          const status = win.querySelector('.notepad-status');
          const saveBtn = win.querySelector('[data-save]');
          const closeBtn = win.querySelector('[data-close]');

          saveBtn.addEventListener('click', () => {
            const data = textarea.value;
            // For now save to localStorage under a small key. Later this will save to the emulated filesystem.
            try {
              const key = `w98_notepad_${Date.now()}`;
              localStorage.setItem(key, data);
              status.textContent = `Saved to localStorage (${key})`;
            } catch (e) {
              status.textContent = 'Save failed (localStorage unavailable)';
            }
          });

          closeBtn.addEventListener('click', () => {
            win.remove();
            env._terminateProcess(pid);
          });
        }, 30);

        return;
      }
      return origLaunch(tgt, options);
    };
  }
}

// Auto-register helper: push installer onto global queue so the OS can install after load.
(function register() {
  try {
    if (typeof window !== 'undefined') {
      window.__W98_APPS__ = window.__W98_APPS__ || [];
      window.__W98_APPS__.push(installNotepad);
      // if the OS is already loaded, install immediately
      if (window.win98Env) installNotepad(window.win98Env);
    }
  } catch (e) { /* ignore in non-browser env */ }
})();
