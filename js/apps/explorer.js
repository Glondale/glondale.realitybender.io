// Very small explorer app that can open a single README from C:/
(function(global){
  function ExplorerApp(){
    this.id = 'explorer'; this.name = 'Explorer';
  }
  ExplorerApp.prototype.open = async function(){
    try{
      const text = await FileSystem.readFile('C:/README.txt');
      WindowManager.createWindow('C:\\README.txt', `<pre>${escapeHtml(text)}</pre>`, {width:520,height:360,x:80,y:60});
    }catch(e){
      WindowManager.createWindow('Explorer', '<div class="content">Failed to open file: '+e.message+'</div>');
    }
  };
  function escapeHtml(s){ return s.replace(/[&<>]/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]); }
  // register with plugin manager
  if(window.PluginManager) window.PluginManager.register('explorer', ()=> new ExplorerApp());
  global.ExplorerApp = ExplorerApp;
})(window);
