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
            console.log('TestMenu: FIXED VERSION - Switching to theme:', t, 'OS version:', osInfo.version);
            
            // Add visual feedback that the new code is running
            btn.style.backgroundColor = '#90EE90';
            btn.innerHTML = 'Switching...';
            setTimeout(() => {
              btn.style.backgroundColor = 'transparent';
              btn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 12px; height: 12px; border-radius: 2px; background: ${osInfo.color}; border: 1px solid #000;"></div>
                  <div>
                    <div style="font-weight: bold; font-size: 11px;">${osInfo.displayName}</div>
                    <div style="font-size: 9px; color: #666;">${osInfo.year}</div>
                  </div>
                </div>
              `;
            }, 500);
            
            // Update theme stylesheet first with cache busting
            const link = document.getElementById('theme-stylesheet');
            if(link) {
              const newHref = `css/themes/${t}.css?cb=${Date.now()}`;
              console.log('TestMenu: Loading CSS:', newHref);
              link.href = newHref;
            }
            
            // Force immediate theme switching - don't use OSManager
            console.log('TestMenu: Calling UIManager.renderDesktop directly');
        if(window.UIManager && UIManager.renderDesktop) {
              // Wait a moment for CSS to load
              setTimeout(() => {
                console.log('TestMenu: Rendering desktop with theme:', t, 'version:', osInfo.version);
                
                // Render desktop with proper theme - use the CSS theme name directly
            var currentEnv = (window.OSManager && OSManager.env) ? OSManager.env : {};
            // merge env but prefer existing values for most keys; only override ui.theme and version when needed
            var mergedEnv = Object.assign({}, currentEnv, {
              version: currentEnv.version || t,
              ui: Object.assign({}, currentEnv.ui || {}, { theme: t })
            });
            // preserve apps list if present
            if(currentEnv.apps && !mergedEnv.apps) mergedEnv.apps = currentEnv.apps;
            // allow stylesheet to start loading before re-render so background images apply
            setTimeout(function(){ UIManager.renderDesktop(mergedEnv); }, 80);
                
                console.log(`TestMenu: Theme switching complete: ${t} for OS: ${osInfo.version}`);
              }, 150);
            } else {
              console.warn('TestMenu: UIManager not available, using direct DOM manipulation');
              // Direct DOM manipulation fallback
              const root = document.getElementById('desktop-root');
              if (root) {
                // Remove all existing theme classes
                Array.from(root.classList).filter(c => c.startsWith('theme-')).forEach(c => {
                  console.log('TestMenu: Removing class:', c);
                  root.classList.remove(c);
                });
                // Add new theme class
                const newClass = 'theme-' + t;
                root.classList.add(newClass);
                console.log('TestMenu: Applied theme class:', newClass);
                console.log('TestMenu: Root classes now:', root.className);
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
  
  // FORCE OVERRIDE - Replace any cached onclick handlers on load
  document.addEventListener('DOMContentLoaded', function() {
    console.log('TestMenu: DOM loaded, forcing theme switch override');
    setTimeout(() => {
      const testMenu = global.TestMenu;
      if (testMenu && testMenu.themes) {
        console.log('TestMenu: Overriding theme switching to bypass OSManager completely');
        // Force immediate theme switching without OSManager
        window.FORCE_THEME_SWITCH = function(themeName, displayName) {
          console.log('FORCE_THEME_SWITCH: Switching to', themeName, displayName);
          
          // Update CSS immediately
          const link = document.getElementById('theme-stylesheet');
          if(link) {
            link.href = `css/themes/${themeName}.css?cb=${Date.now()}`;
            console.log('FORCE_THEME_SWITCH: Updated CSS to', link.href);
          }
          
          // Update DOM classes immediately
          const root = document.getElementById('desktop-root');
          if (root) {
            // Remove all theme classes
            Array.from(root.classList).filter(c => c.startsWith('theme-')).forEach(c => {
              console.log('FORCE_THEME_SWITCH: Removing', c);
              root.classList.remove(c);
            });
            
            // Add new theme class
            const newClass = 'theme-' + themeName;
            root.classList.add(newClass);
            console.log('FORCE_THEME_SWITCH: Added', newClass);
            console.log('FORCE_THEME_SWITCH: Root classes now:', root.className);
            
            // Force re-render UI with new theme
            if(window.UIManager && window.UIManager.renderDesktop) {
              setTimeout(() => {
                try {
                  var currentEnv = (window.OSManager && OSManager.env) ? OSManager.env : {};
                  var mergedEnv = Object.assign({}, currentEnv, {
                    version: currentEnv.version || displayName.toLowerCase().replace(' ', ''),
                    ui: Object.assign({}, currentEnv.ui || {}, { theme: themeName })
                  });
                  if(currentEnv.apps && !mergedEnv.apps) mergedEnv.apps = currentEnv.apps;
                  UIManager.renderDesktop(mergedEnv);
                  console.log('FORCE_THEME_SWITCH: Re-rendered desktop with merged env');
                } catch (e) {
                  console.error('FORCE_THEME_SWITCH: render failed', e);
                }
              }, 100);
            }
          }
        };
      }
    }, 1000);
  });
})(window);
