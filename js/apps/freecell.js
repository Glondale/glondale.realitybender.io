// FreeCell (placeholder minimal)
(function(global){
  function FreeCell(){ this.id='freecell'; }
  FreeCell.prototype.open = function(){
    const html = `<div style="padding:8px;font-family:Arial, sans-serif;">FreeCell placeholder — game not implemented yet.</div>`;
    WindowManager.createWindow('FreeCell', html, {width:480,height:320,x:160,y:120});
  };
  if(window.PluginManager) window.PluginManager.register('freecell', ()=> new FreeCell());
  global.FreeCell = FreeCell;
})(window);
