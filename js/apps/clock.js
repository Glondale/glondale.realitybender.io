// Simple Clock app
(function(global){
  function ClockApp(){ this.id='clock'; this.name='Clock'; this._interval = null; }
  ClockApp.prototype.open = function(){
    const html = `<div style="padding:12px;font-family:Arial, sans-serif; text-align:center;">
      <div id="rbos-clock-time" style="font-size:48px;font-weight:bold;margin-bottom:6px;"></div>
      <div id="rbos-clock-date" style="font-size:14px;color:#666;"></div>
    </div>`;
    const win = WindowManager.createWindow('Clock', html, {width:260,height:160,x:200,y:120});
    const timeEl = win.querySelector('#rbos-clock-time');
    const dateEl = win.querySelector('#rbos-clock-date');
    function update(){
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
      dateEl.textContent = now.toLocaleDateString();
    }
    update();
    this._interval = setInterval(update, 1000);
    // stop interval when window is closed
    const closeBtn = win.querySelector('.close-button');
    if(closeBtn) closeBtn.onclick = (e)=>{ e.stopPropagation(); win.remove(); clearInterval(this._interval); };
  };
  if(window.PluginManager) window.PluginManager.register('clock', ()=> new ClockApp());
  global.ClockApp = ClockApp;
})(window);
