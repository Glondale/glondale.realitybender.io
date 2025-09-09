// Character Map - simple grid of glyphs to copy
(function(global){
  function Charmap(){ this.id='charmap'; }
  Charmap.prototype.open = function(){
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}<>?/\\|~`'.split('');
    let cells = glyphs.map(g=>`<button class="glyph">${g}</button>`).join('');
    const html = `<div style="padding:8px;font-family:Arial, sans-serif;"><div style="max-height:260px;overflow:auto;">${cells}</div><div style="margin-top:8px;text-align:right;"><input id="rbos-charmap-output" style="width:60%" readonly /> <button id="rbos-charmap-copy">Copy</button></div></div>`;
    const win = WindowManager.createWindow('Character Map', html, {width:520,height:380,x:120,y:90});
    win.querySelectorAll('.glyph').forEach(btn=>btn.onclick = ()=>{ const out = win.querySelector('#rbos-charmap-output'); out.value = btn.textContent; });
    win.querySelector('#rbos-charmap-copy').onclick = ()=>{ const out = win.querySelector('#rbos-charmap-output'); out.select(); document.execCommand('copy'); };
  };
  if(window.PluginManager) window.PluginManager.register('charmap', ()=> new Charmap());
  global.Charmap = Charmap;
})(window);
