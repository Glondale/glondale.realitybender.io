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
            console.log('TestMenu: Switching to theme:', t, 'OS version:', osInfo.version);
            
            // Update theme stylesheet first
            const link = document.getElementById('theme-stylesheet');
            if(link) {
              const newHref = `css/themes/${t}.css?cb=${Date.now()}`;
              console.log('Loading CSS:', newHref);
              link.href = newHref;
            }
            
            // Always use UIManager for proper theme switching
            if(window.UIManager && window.UIManager.renderDesktop) {
              // Wait a moment for CSS to load
              setTimeout(() => {
                console.log('Rendering desktop with theme:', t, 'version:', osInfo.version);
                
                // Render desktop with proper theme - use the CSS theme name directly
                window.UIManager.renderDesktop({
                  version: osInfo.version, 
                  ui: { theme: t }
                });
                
                console.log(`Theme switching complete: ${t} for OS: ${osInfo.version}`);
              }, 100);
            } else {
              console.warn('UIManager not available, using basic fallback');
              // Basic fallback - just update the root class
              const root = document.getElementById('desktop-root');
              if (root) {
                // Remove all existing theme classes
                Array.from(root.classList).filter(c => c.startsWith('theme-')).forEach(c => root.classList.remove(c));
                // Add new theme class
                root.classList.add('theme-' + t);
                console.log('Applied theme class:', 'theme-' + t);
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
