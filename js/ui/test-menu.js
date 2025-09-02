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
            // update OSManager env if present
            if(window.OSManager && OSManager.env){
              OSManager.env.ui = OSManager.env.ui || {};
              OSManager.env.ui.theme = t;
            }
      // update theme link for immediate stylesheet swap
      const link = document.getElementById('theme-stylesheet');
      if(link) {
        link.href = `css/themes/${t}.css?cb=${Date.now()}`;
        // also set a class on the desktop root so CSS selectors matching theme classes take effect
        var root = document.getElementById('desktop-root');
        if (root) {
          // remove any existing theme- classes
          Array.from(root.classList).filter(function(c){return c.indexOf('theme-')===0}).forEach(function(c){root.classList.remove(c)});
          root.classList.add('theme-' + t);
        }
      }
            // re-render desktop to allow JS-driven changes
            if(window.UIManager) UIManager.renderDesktop(window.OSManager?OSManager.env:{version:t, ui:{theme:t}});
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
