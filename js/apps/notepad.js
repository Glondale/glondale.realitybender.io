// Minimal Notepad app: reads C:/NOTE.txt and allows saving to SaveManager
(function(global){
  function NotepadApp(){ this.id='notepad'; this.name='Notepad'; }
  NotepadApp.prototype.open = async function(){
    const path = 'C:/NOTE.txt';
    let content = '';
    try{
      const saved = SaveManager.load();
      if(saved && saved.files && saved.files[path]) content = saved.files[path];
      else content = await FileSystem.readFile(path);
    }catch(e){ content = ''; }
    const html = `<div style="height:100%"><textarea id="notepad-area" style="width:100%;height:70%">${escapeHtml(content)}</textarea><div style="margin-top:8px"><button id="notepad-save">Save</button></div></div>`;
    const win = WindowManager.createWindow('Notepad - '+path, html, {width:520,height:360,x:120,y:80});
    const saveBtn = win.querySelector('#notepad-save');
    saveBtn.onclick = ()=>{
      const val = win.querySelector('#notepad-area').value;
      const state = SaveManager.load() || {};
      state.files = state.files || {};
      state.files[path] = val;
      SaveManager.save(state);
      // small feedback
      const fb = document.createElement('div'); fb.textContent='Saved'; fb.style.marginTop='6px'; win.querySelector('.content').appendChild(fb);
    };
  };
  function escapeHtml(s){ return (s||'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]); }
  if(window.PluginManager) window.PluginManager.register('notepad', ()=> new NotepadApp());
  global.NotepadApp = NotepadApp;
})(window);
