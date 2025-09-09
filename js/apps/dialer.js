// Phone Dialer (placeholder)
(function(global){
  function Dialer(){ this.id='dialer'; }
  Dialer.prototype.open = function(){
    const html = `<div style="padding:8px;font-family:Arial, sans-serif;"><input id="rbos-dialer-num" style="width:100%;font-size:20px;padding:6px;margin-bottom:8px;" readonly /><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">${[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(n=>`<button class="num">${n}</button>`).join('')}</div><div style="margin-top:8px;text-align:right;"><button id="rbos-dialer-call">Call</button></div></div>`;
    const win = WindowManager.createWindow('Phone Dialer', html, {width:300,height:360,x:200,y:120});
    const out = win.querySelector('#rbos-dialer-num');
    win.querySelectorAll('.num').forEach(b=>b.onclick = ()=> out.value += b.textContent);
    win.querySelector('#rbos-dialer-call').onclick = ()=> alert('Placeholder: pretend calling '+out.value);
  };
  if(window.PluginManager) window.PluginManager.register('dialer', ()=> new Dialer());
  global.Dialer = Dialer;
})(window);
