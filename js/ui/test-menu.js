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
      // Map theme names to actual OS versions with display info
      const osMap = {
        'windows95': { version: 'windows95', displayName: 'Windows 95', year: '1995', color: '#008080' },
        'windows98': { version: 'windows98', displayName: 'Windows 98', year: '1998', color: '#008080' }, 
        'win2000': { version: 'win2000', displayName: 'Windows 2000', year: '2000', color: '#0b3b6f' },
        'winxp': { version: 'winxp', displayName: 'Windows XP', year: '2001', color: '#5a9fd4' },
        'win7': { version: 'windows7', displayName: 'Windows 7', year: '2009', color: '#4e9fe6' },
        'win8': { version: 'windows8', displayName: 'Windows 8', year: '2012', color: '#1ba1e2' }, 
        'win10': { version: 'windows10', displayName: 'Windows 10', year: '2015', color: '#0078d4' },
        'win11': { version: 'windows11', displayName: 'Windows 11', year: '2021', color: '#0067c4' }
      };
      
      this.themes.forEach(t=>{
        const btn = document.createElement('div');
        const osInfo = osMap[t] || { version: t, displayName: t, year: '????', color: '#808080' };
        
        btn.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 12px; height: 12px; border-radius: 2px; background: ${osInfo.color}; border: 1px solid #000;"></div>
            <div>
              <div style="font-weight: bold; font-size: 11px;">${osInfo.displayName}</div>
              <div style="font-size: 9px; color: #666;">${osInfo.year}</div>
            </div>
          </div>
        `;
        
        btn.style.padding = '6px';
        btn.style.cursor = 'pointer';
        btn.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        btn.style.transition = 'background-color 0.2s';
        btn.onmouseover = () => {
          btn.style.backgroundColor = '#f0f0f0';
        };
        btn.onmouseout = () => {
          btn.style.backgroundColor = 'transparent';
        };
        
        btn.onclick = async ()=>{
          try{
            console.log('TestMenu: Switching to OS version:', osInfo.version);
            
            // Use OSManager upgrade system for proper OS switching
            if(window.OSManager && window.OSManager.upgrade) {
              await OSManager.upgrade(osInfo.version);
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
                UIManager.renderDesktop({version: osInfo.version, ui: {theme: t}});
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
