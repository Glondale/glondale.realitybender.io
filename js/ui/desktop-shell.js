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
      // taskbar
      const tb = document.createElement('div'); tb.className='taskbar';
  const start = document.createElement('div'); start.className='start-button';
  // simplified Start button: no icon image for now
  const sLabel = document.createElement('div'); sLabel.textContent = 'Start'; sLabel.style.fontWeight='700'; start.appendChild(sLabel);
      start.onclick = ()=>{ if(window.StartMenu) StartMenu.toggle(this.env); else { const inst = PluginManager.create('explorer'); if(inst && inst.open) inst.open(); } };
      tb.appendChild(start);
  const devBtn = document.createElement('div'); devBtn.className='dev-button'; devBtn.textContent='Dev'; devBtn.style.marginLeft='8px'; devBtn.style.cursor='pointer';
  devBtn.onclick = ()=>{ if(window.TestMenu) TestMenu.toggle(this.env); };
  tb.appendChild(devBtn);
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
