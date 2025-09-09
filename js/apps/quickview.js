// Quick View - preview small text files from current FS
(function(global){
  function QuickView(){ this.id='quickview'; }
  QuickView.prototype.open = async function(){
    const html = `<div style="padding:8px;font-family:Arial, sans-serif;"><div><label>Path:</label> <input id="rbos-qv-path" style="width:60%" value="C:/README.txt"/></div><div style="margin-top:8px;"><button id="rbos-qv-load">Load</button></div><pre id="rbos-qv-content" style="margin-top:8px;height:240px;overflow:auto;background:#f8f8f8;padding:8px;border:1px solid #ccc;"></pre></div>`;
    const win = WindowManager.createWindow('Quick View', html, {width:520,height:440,x:120,y:90});
    const load = async ()=>{
      const path = win.querySelector('#rbos-qv-path').value;
      try{ const txt = await FileSystem.readFile(path); win.querySelector('#rbos-qv-content').textContent = txt; }catch(e){ win.querySelector('#rbos-qv-content').textContent = 'Failed to load: '+e.message; }
    };
    win.querySelector('#rbos-qv-load').onclick = load;
  };
  if(window.PluginManager) window.PluginManager.register('quickview', ()=> new QuickView());
  global.QuickView = QuickView;
})(window);
