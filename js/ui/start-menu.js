// OS-specific Start Menu with authentic styling
(function(global){
  const StartMenu = {
    menuEl: null,
    toggle(env){
      if(this.menuEl){ this.menuEl.remove(); this.menuEl = null; return; }
      const apps = (env && env.apps) || [];
      const theme = (env && env.ui && env.ui.theme) || (env && env.version) || 'windows95';
      
      const el = document.createElement('div');
      el.className = `start-menu theme-${theme}`;
      el.style.position='absolute';
      el.style.left='8px';
      el.style.bottom='44px';
      el.style.zIndex='1000';
      
      // Apply theme-specific styling
      this.applyThemeStyles(el, theme);
      
      // Create menu content based on OS
      this.createMenuContent(el, apps, theme);
      
      document.getElementById('desktop-root').appendChild(el);
      this.menuEl = el;
    },
    
    applyThemeStyles(el, theme){
      switch(theme) {
        case 'windows95':
        case 'windows98':
          el.style.width='220px';
          el.style.background='#c0c0c0';
          el.style.border='2px outset #c0c0c0';
          el.style.fontFamily='MS Sans Serif, Arial, sans-serif';
          el.style.fontSize='11px';
          break;
        case 'win2000':
          el.style.width='240px';
          el.style.background='#e6f2ff';
          el.style.border='1px solid #9bc2e6';
          el.style.borderRadius='0';
          el.style.boxShadow='2px 2px 4px rgba(0,0,0,0.3)';
          break;
        case 'winxp':
          el.style.width='300px';
          el.style.background='linear-gradient(to bottom, #fff 0%, #f0f8ff 100%)';
          el.style.border='1px solid #4e9a06';
          el.style.borderRadius='8px';
          el.style.boxShadow='0 4px 8px rgba(0,0,0,0.3)';
          break;
        case 'win7':
          el.style.width='320px';
          el.style.background='rgba(0,0,0,0.8)';
          el.style.backdropFilter='blur(20px)';
          el.style.border='1px solid rgba(255,255,255,0.2)';
          el.style.borderRadius='8px';
          el.style.boxShadow='0 0 20px rgba(0,0,0,0.5)';
          break;
        case 'win8':
          el.style.width='100vw';
          el.style.height='100vh';
          el.style.left='0';
          el.style.bottom='0';
          el.style.background='#1a6fb3';
          el.style.border='none';
          break;
        case 'win10':
          el.style.width='340px';
          el.style.background='rgba(0,0,0,0.95)';
          el.style.backdropFilter='blur(20px)';
          el.style.border='1px solid rgba(255,255,255,0.1)';
          el.style.borderRadius='4px';
          break;
        case 'win11':
          el.style.width='360px';
          el.style.background='rgba(32,32,32,0.9)';
          el.style.backdropFilter='blur(30px)';
          el.style.border='1px solid rgba(255,255,255,0.05)';
          el.style.borderRadius='12px';
          el.style.boxShadow='0 8px 32px rgba(0,0,0,0.5)';
          break;
      }
    },
    
    createMenuContent(el, apps, theme){
      if(theme === 'win8') {
        this.createWin8StartScreen(el, apps);
      } else if(theme === 'win10' || theme === 'win11') {
        this.createModernStartMenu(el, apps, theme);
      } else {
        this.createClassicStartMenu(el, apps, theme);
      }
    },
    
    createClassicStartMenu(el, apps, theme){
      if(theme === 'winxp') {
        // Create XP-style header
        const header = document.createElement('div');
        header.style.background='linear-gradient(45deg, #4a90e2, #73d216)';
        header.style.color='white';
        header.style.padding='12px';
        header.style.fontWeight='bold';
        header.style.borderRadius='8px 8px 0 0';
        header.innerHTML = '<div style="font-size:14px;">Windows XP</div><div style="font-size:10px;">Professional</div>';
        el.appendChild(header);
      }
      
      const appContainer = document.createElement('div');
      appContainer.style.padding='8px';
      
      apps.forEach(a=>{
        const btn = document.createElement('div');
        btn.innerHTML = `<span style="display:inline-block; width:16px; height:16px; background:#ccc; margin-right:8px; vertical-align:middle;"></span>${a}`;
        btn.style.padding='6px 12px';
        btn.style.cursor='pointer';
        btn.style.borderRadius=theme === 'winxp' ? '3px' : '0';
        btn.style.color=theme === 'win7' ? '#fff' : '#000';
        btn.onmouseover = ()=>{
          btn.style.background=theme === 'winxp' ? '#316ac5' : theme === 'win7' ? 'rgba(255,255,255,0.1)' : '#0078d4';
          btn.style.color='#fff';
        };
        btn.onmouseout = ()=>{
          btn.style.background='transparent';
          btn.style.color=theme === 'win7' ? '#fff' : '#000';
        };
        btn.onclick = ()=>{
          const inst = PluginManager.create(a);
          if(inst && inst.open) inst.open();
          this.toggle();
        };
        appContainer.appendChild(btn);
      });
      
      el.appendChild(appContainer);
      
      // Add bottom section for XP/7
      if(theme === 'winxp' || theme === 'win7') {
        const footer = document.createElement('div');
        footer.style.borderTop='1px solid #ccc';
        footer.style.padding='8px 12px';
        footer.innerHTML='<div style="cursor:pointer; padding:4px; color:' + (theme === 'win7' ? '#fff' : '#000') + ';">Shut down...</div>';
        el.appendChild(footer);
      }
    },
    
    createWin8StartScreen(el, apps){
      el.innerHTML = '<div style="padding:40px; color:white;"><h1>Start</h1><div id="tile-grid" style="display:grid; grid-template-columns:repeat(6,120px); gap:20px; margin-top:40px;"></div></div>';
      const grid = el.querySelector('#tile-grid');
      
      apps.forEach(a=>{
        const tile = document.createElement('div');
        tile.style.width='120px';
        tile.style.height='120px';
        tile.style.background='#0078d4';
        tile.style.color='white';
        tile.style.display='flex';
        tile.style.alignItems='center';
        tile.style.justifyContent='center';
        tile.style.cursor='pointer';
        tile.style.fontSize='14px';
        tile.style.fontWeight='300';
        tile.textContent=a;
        tile.onclick = ()=>{
          const inst = PluginManager.create(a);
          if(inst && inst.open) inst.open();
          this.toggle();
        };
        grid.appendChild(tile);
      });
    },
    
    createModernStartMenu(el, apps, theme){
      const searchBox = document.createElement('div');
      searchBox.style.padding='16px';
      searchBox.style.borderBottom='1px solid rgba(255,255,255,0.1)';
      searchBox.innerHTML='<input type="text" placeholder="Type here to search" style="width:100%; padding:8px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; border-radius:' + (theme === 'win11' ? '8px' : '2px') + ';">';
      el.appendChild(searchBox);
      
      const section = document.createElement('div');
      section.style.padding='16px';
      
      const title = document.createElement('div');
      title.style.color=theme === 'win11' ? '#fff' : '#ccc';
      title.style.fontSize='12px';
      title.style.marginBottom='8px';
      title.style.textTransform='uppercase';
      title.textContent='Pinned';
      section.appendChild(title);
      
      const grid = document.createElement('div');
      grid.style.display='grid';
      grid.style.gridTemplateColumns='repeat(6, 1fr)';
      grid.style.gap='8px';
      
      apps.forEach(a=>{
        const tile = document.createElement('div');
        tile.style.width='48px';
        tile.style.height='48px';
        tile.style.background=theme === 'win11' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)';
        tile.style.borderRadius=theme === 'win11' ? '8px' : '2px';
        tile.style.display='flex';
        tile.style.alignItems='center';
        tile.style.justifyContent='center';
        tile.style.cursor='pointer';
        tile.style.fontSize='10px';
        tile.style.color='white';
        tile.textContent=a.substring(0,2).toUpperCase();
        tile.onclick = ()=>{
          const inst = PluginManager.create(a);
          if(inst && inst.open) inst.open();
          this.toggle();
        };
        grid.appendChild(tile);
      });
      
      section.appendChild(grid);
      el.appendChild(section);
    }
  };
  global.StartMenu = StartMenu;
})(window);
