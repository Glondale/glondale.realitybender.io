(function(global){
  // Small developer Test Menu for fast theme switching
  const TestMenu = {
    menuEl: null,
  themes: ['windows95','windows98','win2000','winxp','win7','win8','win10','win11'],
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
      // Map theme names to actual OS versions
      const osMap = {
        'windows95': 'windows95',
        'windows98': 'windows98', 
        'win2000': 'win2000',
        'winxp': 'winxp',
        'win7': 'windows7',
        'win8': 'windows8', 
        'win10': 'windows10',
        'win11': 'windows11'
      };
      
      this.themes.forEach(t=>{
        const btn = document.createElement('div');
        const osVersion = osMap[t] || t;
        btn.textContent = `${t} ${osVersion !== t ? `(${osVersion})` : ''}`;
        btn.style.padding = '6px';
        btn.style.cursor = 'pointer';
        btn.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        btn.onclick = async ()=>{
          try{
            console.log('TestMenu: Switching to OS version:', osVersion);
            
            // Use OSManager upgrade system for proper OS switching
            if(window.OSManager && window.OSManager.upgrade) {
              await OSManager.upgrade(osVersion);
            } else {
              // Fallback to theme switching only
              const link = document.getElementById('theme-stylesheet');
              if(link) {
                link.href = `css/themes/${t}.css?cb=${Date.now()}`;
                const root = document.getElementById('desktop-root');
                if (root) {
                  Array.from(root.classList).filter(c => c.indexOf('theme-')===0).forEach(c => root.classList.remove(c));
                  root.classList.add('theme-' + t);
                }
              }
              if(window.UIManager) {
                UIManager.renderDesktop({version: osVersion, ui: {theme: t}});
              }
            }
            
          }catch(e){ 
            console.error('OS switch failed',e); 
            alert('Failed to switch OS: ' + e.message);
          }
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
