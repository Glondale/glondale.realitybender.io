// Simple Start Menu that lists apps from the OS env
(function(global){
  const StartMenu = {
    menuEl: null,
    toggle(env){
      if(this.menuEl){ this.menuEl.remove(); this.menuEl = null; return; }
      const apps = (env && env.apps) || [];
      const el = document.createElement('div');
      el.style.position='absolute';
      el.style.left='8px';
      el.style.bottom='44px';
      el.style.width='220px';
      el.style.background='#e0e0e0';
      el.style.border='2px solid #000';
      el.style.padding='8px';
      apps.forEach(a=>{
        const btn = document.createElement('div');
        btn.textContent = a;
        btn.style.padding='6px';
        btn.style.cursor='pointer';
        btn.onclick = ()=>{
          const inst = PluginManager.create(a);
          if(inst && inst.open) inst.open();
        };
        el.appendChild(btn);
      });
      document.getElementById('desktop-root').appendChild(el);
      this.menuEl = el;
    }
  };
  global.StartMenu = StartMenu;
})(window);
