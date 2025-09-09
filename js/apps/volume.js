// Volume Control (placeholder)
(function(global){
  function Volume(){ this.id='volume'; }
  Volume.prototype.open = function(){
    const html = `<div style="padding:12px;font-family:Arial, sans-serif;"><div>Volume: <span id="rbos-vol-val">50</span>%</div><input id="rbos-vol-slider" type="range" min="0" max="100" value="50" style="width:100%;margin-top:8px;"/></div>`;
    const win = WindowManager.createWindow('Volume Control', html, {width:340,height:160,x:240,y:160});
    const slider = win.querySelector('#rbos-vol-slider');
    const val = win.querySelector('#rbos-vol-val');
    slider.oninput = ()=> val.textContent = slider.value;
  };
  if(window.PluginManager) window.PluginManager.register('volume', ()=> new Volume());
  global.Volume = Volume;
})(window);
