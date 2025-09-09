// Placeholder apps: register non-implemented Start Menu items with a simple window
(function(global){
  function PlaceholderApp(id, title){
    this.id = id;
    this.title = title || id;
  }

  PlaceholderApp.prototype.open = function(){
    try{
      const html = `<div style="padding:12px;font-family:Arial, sans-serif;"><h3>${this.title}</h3><p>This program is not implemented yet. You clicked <b>${this.id}</b>.</p><p>Feature roadmap: basic UI + simple functionality.</p></div>`;
      WindowManager.createWindow(this.title+' (Placeholder)', html, {width:420,height:220,x:120,y:120});
    }catch(e){ console.error('PlaceholderApp open failed', e); }
  };

  const placeholders = {
    'calendar':'Calendar', 'cardfile':'Cardfile', 'charmap':'Character Map', 'clock':'Clock',
    'dialer':'Phone Dialer', 'quickview':'Quick View', 'freecell':'FreeCell', 'hearts':'Hearts',
    'cdplayer':'CD Player', 'volume':'Volume Control', 'backup':'Backup', 'defrag':'Disk Defragmenter',
    'drivespace':'DriveSpace', 'rsrcmeter':'Resource Meter', 'scandisk':'ScanDisk', 'sysmon':'System Monitor',
    'printers':'Printers', 'taskbar-settings':'Taskbar & Start Menu', 'find-files':'Find Files', 'find-computer':'Find Computer',
    'help':'Help', 'run':'Run', 'shutdown':'Shut Down', 'winupdate':'Windows Update', 'logoff':'Log Off',
    'compmgmt':'Computer Management', 'eventvwr':'Event Viewer', 'secpol':'Local Security Policy', 'perfmon':'Performance', 'services':'Services',
    'mydocs':'My Documents', 'netplaces':'My Network Places', 'progaccess':'Set Program Access and Defaults', 'search':'Search',
    'gettingstarted':'Getting Started', 'mediacenter':'Windows Media Center', 'stickynotes':'Sticky Notes', 'snippingtool':'Snipping Tool',
    'mstsc':'Remote Desktop Connection', 'mail':'Mail', 'msn':'MSN Explorer', 'wmplayer':'Windows Media Player', 'tour':'Tour Windows', 'migwiz':'Files & Settings Transfer',
    'mypics':'My Pictures', 'mymusic':'My Music', 'paint3d':'Paint 3D', 'stickynotes':'Sticky Notes', 'outlook':'Outlook', 'printers':'Printers',
    'calendar':'Calendar','cardfile':'Cardfile'
  };

  if(window.PluginManager){
    Object.keys(placeholders).forEach(id => {
      try{
        // Only register if not already present
        if(window.PluginManager.list && window.PluginManager.list().includes(id)) return;
        window.PluginManager.register(id, ()=> new PlaceholderApp(id, placeholders[id]||id));
      }catch(e){ console.error('Failed to register placeholder for', id, e); }
    });
  }

  global.PlaceholderApp = PlaceholderApp;
})(window);
