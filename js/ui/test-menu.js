(function(global){
  // Small developer Test Menu for fast theme switching
  const TestMenu = {
    menuEl: null,
    themes: ['windows95','windows98','win2000','winxp'],
    toggle(env){
      if(this.menuEl){ this.menuEl.remove(); this.menuEl = null; return; }
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.right = '12px';
      el.style.bottom = '44px';
      el.style.width = '200px';
      el.style.background = '#e0e0e0';
      el.style.border = '2px solid #000';
      el.style.padding = '8px';
      el.style.zIndex = 9999;
      el.innerHTML = '<strong>Test Menu</strong><hr/>';
      const list = document.createElement('div');
      this.themes.forEach(t=>{
        const btn = document.createElement('div');
        btn.textContent = t;
        btn.style.padding = '6px';
        btn.style.cursor = 'pointer';
        btn.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        btn.onclick = ()=>{
          try{
            if(window.OSManager && OSManager.env){
              OSManager.env.ui = OSManager.env.ui || {};
              OSManager.env.ui.theme = t;
              if(window.UIManager) UIManager.renderDesktop(OSManager.env);
            } else {
              // fallback: if OSManager.env not available, try to keep apps list empty
              const apps = (window.OSManager && OSManager.env && OSManager.env.apps) ? OSManager.env.apps : [];
              if(window.UIManager) UIManager.renderDesktop({version:t, ui:{theme:t}, apps: apps});
            }
          }catch(e){ console.error('Theme switch failed',e); }
          this.toggle();
        };
        list.appendChild(btn);
      });
      el.appendChild(list);
      document.getElementById('desktop-root').appendChild(el);
      this.menuEl = el;
    }
  };
  global.TestMenu = TestMenu;
})(window);
