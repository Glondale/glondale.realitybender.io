// Save/load using localStorage
(function(global){
  const KEY = 'rbos-save-v1';
  const SaveManager = {
    save(state){
      try{ localStorage.setItem(KEY, JSON.stringify(state)); return true; }catch(e){ console.error('Save failed',e); return false; }
    },
    load(){
      try{ const raw = localStorage.getItem(KEY); return raw?JSON.parse(raw):null; }catch(e){ console.error('Load failed',e); return null; }
    }
  };
  global.SaveManager = SaveManager;
})(window);
