// Minimal desktop shell: renders start button and handles launching explorer
(function(global){
  const root = document.getElementById('desktop-root');
  const UIManager = {
    renderDesktop(env){
      root.innerHTML = '';
      this.env = env || {};
      // background is via CSS theme
      // create a sample desktop icon using the W95 icon asset
  const icon = document.createElement('div');
  icon.className = 'icon';
  // use the provided W95 desktop ico as a background image (fallback-safe)
  icon.style.backgroundImage = "url('Assets/Icons/W95/w98_desktop_w95.ico')";
  icon.style.backgroundSize = '32px 32px';
  icon.style.backgroundRepeat = 'no-repeat';
  icon.style.backgroundPosition = 'center 6px';
  const label = document.createElement('div'); label.textContent = 'Explorer'; label.style.fontSize='11px'; label.style.textAlign='center';
  icon.appendChild(label);
  icon.style.cursor = 'pointer';
      icon.onclick = ()=>{
        const inst = PluginManager.create('explorer');
        if(inst && inst.open) inst.open();
      };
      root.appendChild(icon);
      // taskbar
      const tb = document.createElement('div'); tb.className='taskbar';
  const start = document.createElement('div'); start.className='start-button';
  // use small W95 icon as background for the start button
  start.style.backgroundImage = "url('Assets/Icons/W95/w95_1.ico')";
  start.style.backgroundRepeat = 'no-repeat';
  start.style.backgroundPosition = '8px center';
  start.style.backgroundSize = '16px 16px';
  const sLabel = document.createElement('div'); sLabel.textContent = 'Start'; sLabel.style.fontWeight='700'; sLabel.style.marginLeft='6px'; start.appendChild(sLabel);
      start.onclick = ()=>{ if(window.StartMenu) StartMenu.toggle(this.env); else { const inst = PluginManager.create('explorer'); if(inst && inst.open) inst.open(); } };
      tb.appendChild(start);
      const status = document.createElement('div'); status.className='status'; status.textContent = env && env.version? env.version : 'unknown';
      tb.appendChild(status);
      root.appendChild(tb);
      // expose for OSManager
      global.UIManager = UIManager;
    },
    upgradeInterface(fromVersion, toVersion){
      console.log('UIManager: upgrade',fromVersion,'->',toVersion);
      // placeholder: re-render with new theme maybe
      this.renderDesktop({version:toVersion});
    }
  };
  global.UIManager = UIManager;
})(window);
