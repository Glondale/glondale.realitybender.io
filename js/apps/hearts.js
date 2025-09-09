// Hearts (placeholder)
(function(global){
  function Hearts(){ this.id='hearts'; }
  Hearts.prototype.open = function(){
    const html = `<div style="padding:8px;font-family:Arial, sans-serif;">Hearts placeholder — game not implemented yet.</div>`;
    WindowManager.createWindow('Hearts', html, {width:420,height:300,x:180,y:140});
  };
  if(window.PluginManager) window.PluginManager.register('hearts', ()=> new Hearts());
  global.Hearts = Hearts;
})(window);
