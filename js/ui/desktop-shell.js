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
      const img = document.createElement('img');
      img.src = 'Assets/Icons/W95/w98_desktop_w95.ico';
      img.alt = 'Explorer';
      img.style.width = '32px'; img.style.height = '32px'; img.style.display='block'; img.style.margin='0 auto 4px';
      const label = document.createElement('div'); label.textContent = 'Explorer'; label.style.fontSize='11px'; label.style.textAlign='center';
      icon.appendChild(img);
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
  // small start icon
  const sImg = document.createElement('img'); sImg.src = 'Assets/Icons/W95/w95_1.ico'; sImg.alt='Start'; sImg.style.width='16px'; sImg.style.height='16px'; sImg.style.marginRight='8px';
  start.appendChild(sImg);
  const sLabel = document.createElement('div'); sLabel.textContent = 'Start'; sLabel.style.fontWeight='700'; start.appendChild(sLabel);
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
