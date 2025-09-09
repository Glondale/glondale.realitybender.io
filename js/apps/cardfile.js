// Cardfile - simple note cards
(function(global){
  function Cardfile(){ this.id='cardfile'; }
  Cardfile.prototype.open = function(){
    const html = `<div style="padding:8px;font-family:Arial, sans-serif;"><textarea id="rbos-cardfile" style="width:100%;height:200px;">"My Cardfile"\n</textarea><div style="margin-top:8px;text-align:right;"><button id="rbos-cardfile-save">Save</button></div></div>`;
    const win = WindowManager.createWindow('Cardfile', html, {width:420,height:320,x:140,y:120});
    const ta = win.querySelector('#rbos-cardfile');
    win.querySelector('#rbos-cardfile-save').onclick = ()=>{ alert('Saved (placeholder)'); };
  };
  if(window.PluginManager) window.PluginManager.register('cardfile', ()=> new Cardfile());
  global.Cardfile = Cardfile;
})(window);
