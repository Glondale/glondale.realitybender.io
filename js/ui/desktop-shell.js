// Minimal desktop shell: renders start button and handles launching explorer
(function(global){
  const root = document.getElementById('desktop-root');
  const UIManager = {
    renderDesktop(env){
      root.innerHTML = '';
      this.env = env || {};
      // background is via CSS theme
      // create a sample icon
      const icon = document.createElement('div');
      icon.className = 'icon';
      icon.textContent = 'Explorer';
      icon.style.cursor = 'pointer';
      icon.onclick = ()=>{
        const inst = PluginManager.create('explorer');
        if(inst && inst.open) inst.open();
      };
      root.appendChild(icon);
      // taskbar
      const tb = document.createElement('div'); tb.className='taskbar';
      const start = document.createElement('div'); start.className='start-button'; start.textContent='Start';
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
