// CD Player (placeholder UI)
(function(global){
  function CDPlayer(){ this.id='cdplayer'; }
  CDPlayer.prototype.open = function(){
    const html = `<div style="padding:8px;font-family:Arial, sans-serif;"><div><strong>CD Player (placeholder)</strong></div><div style="margin-top:8px;"><button id="rbos-cd-play">Play</button> <button id="rbos-cd-stop">Stop</button></div><div id="rbos-cd-status" style="margin-top:8px;color:#666;">Stopped</div></div>`;
    const win = WindowManager.createWindow('CD Player', html, {width:360,height:220,x:220,y:160});
    win.querySelector('#rbos-cd-play').onclick = ()=> win.querySelector('#rbos-cd-status').textContent = 'Playing (placeholder)';
    win.querySelector('#rbos-cd-stop').onclick = ()=> win.querySelector('#rbos-cd-status').textContent = 'Stopped';
  };
  if(window.PluginManager) window.PluginManager.register('cdplayer', ()=> new CDPlayer());
  global.CDPlayer = CDPlayer;
})(window);
