// Minimal desktop shell: renders start button and handles launching explorer
(function(global){
  const root = document.getElementById('desktop-root');
  const UIManager = {
    renderDesktop(env){
  root.innerHTML = '';
  // create a dedicated desktop area that sits above the taskbar
  const area = document.createElement('div');
  area.className = 'desktop-area';
      this.env = env || {};
      // apply theme class to desktop-root based on env.ui.theme or env.version
      const theme = (env && env.ui && env.ui.theme) ? env.ui.theme : (env && env.version ? env.version : 'windows95');
      // remove previous theme classes
      root.className = '';
      root.classList.add('theme-' + theme);
      
      // Debug logging
      console.log('UIManager: Applied theme class:', 'theme-' + theme, 'to root element');
      console.log('UIManager: Root element classes:', root.className);
      // background is via CSS theme
      // create a sample desktop icon using the W95 icon asset
  const icon = document.createElement('div');
  icon.className = 'icon';
  // simplified: no image, just a text label for now
  const label = document.createElement('div'); label.textContent = 'Explorer'; label.style.fontSize='11px'; label.style.textAlign='center';
  icon.appendChild(label);
  icon.style.cursor = 'pointer';
      icon.onclick = ()=>{
        const inst = PluginManager.create('explorer');
        if(inst && inst.open) inst.open();
      };
  area.appendChild(icon);
  root.appendChild(area);
      // taskbar with OS-specific styling
      const tb = document.createElement('div'); 
      tb.className = `taskbar theme-${theme}`;
      this.createTaskbar(tb, theme, env);
      root.appendChild(tb);
      // expose for OSManager
      global.UIManager = UIManager;
    },
    
    createTaskbar(taskbar, theme, env){
      taskbar.innerHTML = ''; // Clear existing content
      
      // Create start button
      const start = document.createElement('div');
      start.className = `start-button theme-${theme}`;
      this.createStartButton(start, theme);
      start.onclick = ()=>{ 
        if(window.StartMenu) StartMenu.toggle(this.env); 
        else { 
          const inst = global.PluginManager.create('explorer'); 
          if(inst && inst.open) inst.open(); 
        } 
      };
      taskbar.appendChild(start);
      
      // Quick launch area (for older OS versions)
      if(['windows95', 'windows98', 'win2000', 'winxp', 'win7'].includes(theme)) {
        const quickLaunch = document.createElement('div');
        quickLaunch.className = 'quick-launch';
        quickLaunch.style.display = 'flex';
        quickLaunch.style.alignItems = 'center';
        quickLaunch.style.marginLeft = '8px';
        quickLaunch.style.paddingLeft = '8px';
        quickLaunch.style.borderLeft = theme !== 'win7' ? '1px solid #808080' : 'none';
        
        // Add some quick launch icons
        ['explorer', 'notepad'].forEach(app => {
          const icon = document.createElement('div');
          icon.style.width = '20px';
          icon.style.height = '20px';
          icon.style.background = '#ccc';
          icon.style.margin = '0 2px';
          icon.style.cursor = 'pointer';
          icon.style.border = '1px solid transparent';
          icon.title = app;
          icon.onclick = () => {
            const inst = global.PluginManager.create(app);
            if(inst && inst.open) inst.open();
          };
          quickLaunch.appendChild(icon);
        });
        taskbar.appendChild(quickLaunch);
      }
      
      // Task buttons area
      const taskArea = document.createElement('div');
      taskArea.className = 'task-area';
      taskArea.style.flex = '1';
      taskArea.style.display = 'flex';
      taskArea.style.alignItems = 'center';
      taskArea.style.marginLeft = '8px';
      taskbar.appendChild(taskArea);
      
      // System tray
      const systemTray = document.createElement('div');
      systemTray.className = 'system-tray';
      this.createSystemTray(systemTray, theme);
      taskbar.appendChild(systemTray);
      
      // Dev button (keep for development)
      const devBtn = document.createElement('div'); 
      devBtn.className = 'dev-button'; 
      devBtn.textContent = 'Dev'; 
      devBtn.style.marginLeft = '8px'; 
      devBtn.style.cursor = 'pointer';
      devBtn.style.padding = '4px 8px';
      devBtn.style.fontSize = '10px';
      devBtn.onclick = ()=>{ if(window.TestMenu) TestMenu.toggle(this.env); };
      systemTray.appendChild(devBtn);
      
      // Version status
      const status = document.createElement('div'); 
      status.className = 'status'; 
      status.textContent = env && env.version ? env.version : 'unknown';
      status.style.fontSize = '10px';
      status.style.marginLeft = '8px';
      systemTray.appendChild(status);
    },
    
    createStartButton(button, theme){
      button.innerHTML = '';
      
      switch(theme) {
        case 'windows95':
        case 'windows98':
          button.innerHTML = 'Start';
          break;
        case 'win2000':
          button.innerHTML = 'Start';
          break;
        case 'winxp':
          button.innerHTML = '<span style="font-size:11px; font-weight:bold; margin-left:6px;">start</span>';
          break;
        case 'win7':
          // Win7 orb - just the icon
          break;
        case 'win8':
          // Win8 has no visible start button initially
          button.style.display = 'none';
          break;
        case 'win10':
        case 'win11':
          // Modern Windows logo only
          break;
      }
    },
    
    createSystemTray(tray, theme){
      tray.style.display = 'flex';
      tray.style.alignItems = 'center';
      tray.style.marginLeft = 'auto';
      tray.style.paddingRight = '8px';
      
      // Notification area
      const notifications = document.createElement('div');
      notifications.className = 'notification-area';
      notifications.style.display = 'flex';
      notifications.style.alignItems = 'center';
      
      // Add some system tray icons
      if(theme !== 'win8') {
        ['speaker', 'network', 'battery'].forEach(icon => {
          const iconEl = document.createElement('div');
          iconEl.style.width = '16px';
          iconEl.style.height = '16px';
          iconEl.style.background = '#808080';
          iconEl.style.margin = '0 2px';
          iconEl.style.cursor = 'pointer';
          iconEl.title = icon;
          notifications.appendChild(iconEl);
        });
      }
      
      // Clock
      const clock = document.createElement('div');
      clock.className = 'clock';
      this.updateClock(clock, theme);
      setInterval(() => this.updateClock(clock, theme), 1000);
      
      if(theme !== 'win8') {
        tray.appendChild(notifications);
      }
      tray.appendChild(clock);
    },
    
    updateClock(clockEl, theme){
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const dateStr = now.toLocaleDateString();
      
      if(['win10', 'win11'].includes(theme)) {
        clockEl.innerHTML = `<div style="text-align:right; font-size:12px; color:white; padding:4px 8px;"><div>${timeStr}</div><div style="font-size:10px;">${dateStr}</div></div>`;
      } else if(theme === 'win7') {
        clockEl.innerHTML = `<div style="text-align:right; font-size:11px; color:white; padding:2px 6px;"><div>${timeStr}</div><div style="font-size:9px;">${dateStr}</div></div>`;
      } else if(theme === 'win8') {
        clockEl.innerHTML = `<div style="font-size:14px; color:white; padding:8px;">${timeStr}</div>`;
      } else {
        clockEl.innerHTML = `<div style="font-size:11px; padding:4px 6px;">${timeStr}</div>`;
      }
      
      clockEl.style.cursor = 'pointer';
      clockEl.style.minWidth = theme === 'win8' ? 'auto' : '60px';
    },
    upgradeInterface(fromVersion, toVersion){
      console.log('UIManager: upgrade',fromVersion,'->',toVersion);
      // placeholder: re-render with new theme maybe
      this.renderDesktop({version:toVersion});
    }
  };
  global.UIManager = UIManager;
})(window);
