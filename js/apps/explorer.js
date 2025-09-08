// Enhanced File Explorer with folder navigation and progressive unlocking
(function(global){
  function ExplorerApp(){
    this.id = 'explorer'; 
    this.name = 'File Explorer';
    this.currentPath = 'C:/';
    this.window = null;
  }
  
  ExplorerApp.prototype.open = async function(path = 'C:/'){
    this.currentPath = path;
    
    try {
      const content = await this.renderExplorer();
      this.window = WindowManager.createWindow(
        `File Explorer - ${this.currentPath}`, 
        content, 
        {width: 600, height: 450, x: 100, y: 80}
      );
      
      // Add event listeners for navigation
      this.attachEventListeners();
      
    } catch(e) {
      WindowManager.createWindow('File Explorer - Error', 
        `<div class="error">Failed to open directory: ${e.message}</div>`);
    }
  };
  
  ExplorerApp.prototype.renderExplorer = async function() {
    let html = `
      <div class="explorer-container">
        <div class="explorer-toolbar">
          <button id="back-btn" ${this.currentPath === 'C:/' ? 'disabled' : ''}>← Back</button>
          <div class="address-bar">
            <span class="address-label">Address:</span>
            <input type="text" id="address-input" value="${this.currentPath}" readonly />
          </div>
          <button id="refresh-btn">⟳ Refresh</button>
        </div>
        <div class="drive-bar">`;
    
    // Show available drives based on OS version
    const drives = await this.getAvailableDrives();
    drives.forEach(drive => {
      const isActive = this.currentPath.startsWith(drive);
      html += `<button class="drive-btn ${isActive ? 'active' : ''}" data-drive="${drive}">${drive}</button>`;
    });
    
    html += `</div>
        <div class="file-list-container">
          <div class="file-list" id="file-list">`;
    
    try {
      const files = await FileSystem.listDirectory(this.currentPath);
      
      if (files.length === 0) {
        html += '<div class="empty-folder">This folder is empty</div>';
      } else {
        files.forEach(file => {
          const isFolder = file.endsWith('/');
          const displayName = isFolder ? file.slice(0, -1) : file;
          const iconClass = isFolder ? 'folder-icon' : this.getFileIcon(file);
          
          html += `
            <div class="file-item ${isFolder ? 'folder' : 'file'}" data-name="${file}">
              <div class="file-icon ${iconClass}"></div>
              <div class="file-name">${escapeHtml(displayName)}</div>
            </div>`;
        });
      }
    } catch (e) {
      html += `<div class="error">Access denied: ${e.message}</div>`;
    }
    
    html += `
          </div>
        </div>
        <div class="status-bar">
          <span id="item-count">Ready</span>
          <span id="os-version">${FileSystem.currentOS}</span>
        </div>
      </div>
      
      <style>
      .explorer-container { display: flex; flex-direction: column; height: 100%; font-family: 'MS Sans Serif', Arial, sans-serif; }
      .explorer-toolbar { display: flex; align-items: center; padding: 4px; border-bottom: 1px solid #808080; background: #f0f0f0; }
      .explorer-toolbar button { margin-right: 4px; padding: 2px 8px; }
      .address-bar { flex: 1; display: flex; align-items: center; margin: 0 8px; }
      .address-label { margin-right: 4px; font-size: 11px; }
      .address-bar input { flex: 1; padding: 2px 4px; font-size: 11px; }
      .drive-bar { display: flex; padding: 2px; background: #e0e0e0; border-bottom: 1px solid #808080; }
      .drive-btn { margin-right: 2px; padding: 4px 8px; font-size: 11px; background: #d0d0d0; border: 1px solid #808080; cursor: pointer; }
      .drive-btn.active { background: #a0a0a0; }
      .file-list-container { flex: 1; overflow: auto; background: white; }
      .file-list { padding: 8px; }
      .file-item { display: flex; align-items: center; padding: 2px 4px; margin: 1px 0; cursor: pointer; user-select: none; }
      .file-item:hover { background: #b0b0ff; }
      .file-item.selected { background: #0000ff; color: white; }
      .file-icon { width: 16px; height: 16px; margin-right: 6px; background-size: contain; }
      .folder-icon { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23ffd700" d="M2 2v12h12V6H8L6 4H2z"/></svg>'); }
      .txt-icon { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect fill="%23ffffff" x="2" y="1" width="12" height="14"/><text x="8" y="9" font-size="6" text-anchor="middle" fill="black">TXT</text></svg>'); }
      .exe-icon { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect fill="%23ff6666" x="2" y="1" width="12" height="14"/><text x="8" y="9" font-size="6" text-anchor="middle" fill="white">EXE</text></svg>'); }
      .log-icon { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect fill="%23ffff99" x="2" y="1" width="12" height="14"/><text x="8" y="9" font-size="6" text-anchor="middle" fill="black">LOG</text></svg>'); }
      .file-name { font-size: 11px; }
      .status-bar { display: flex; justify-content: space-between; padding: 2px 8px; background: #f0f0f0; border-top: 1px solid #808080; font-size: 11px; }
      .empty-folder, .error { text-align: center; padding: 20px; color: #666; font-style: italic; }
      .error { color: #cc0000; }
      </style>`;
    
    return html;
  };
  
  ExplorerApp.prototype.getAvailableDrives = async function() {
    const config = await FileSystem.getOSConfig();
    const drives = ['C:/'];
    
    if (config.unlocks?.drives) {
      drives.push(...config.unlocks.drives.map(d => d.replace('\\', '/')));
    }
    
    return drives;
  };
  
  ExplorerApp.prototype.getFileIcon = function(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'txt': return 'txt-icon';
      case 'exe': return 'exe-icon';
      case 'log': return 'log-icon';
      default: return 'txt-icon';
    }
  };
  
  ExplorerApp.prototype.attachEventListeners = function() {
    if (!this.window) return;
    
    // Drive buttons
    const driveBtns = this.window.querySelectorAll('.drive-btn');
    driveBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const drive = e.target.getAttribute('data-drive');
        await this.navigateTo(drive);
      });
    });
    
    // File/folder double-click
    const fileItems = this.window.querySelectorAll('.file-item');
    fileItems.forEach(item => {
      item.addEventListener('dblclick', async (e) => {
        const filename = item.getAttribute('data-name');
        if (item.classList.contains('folder')) {
          await this.navigateTo(this.currentPath + filename);
        } else {
          await this.openFile(this.currentPath + filename);
        }
      });
      
      // Single click selection
      item.addEventListener('click', (e) => {
        this.window.querySelectorAll('.file-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
    
    // Toolbar buttons
    const backBtn = this.window.querySelector('#back-btn');
    if (backBtn && !backBtn.disabled) {
      backBtn.addEventListener('click', () => {
        const parentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/', this.currentPath.length - 2) + 1);
        this.navigateTo(parentPath || 'C:/');
      });
    }
    
    const refreshBtn = this.window.querySelector('#refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refresh();
      });
    }
  };
  
  ExplorerApp.prototype.navigateTo = async function(path) {
    this.currentPath = path.endsWith('/') ? path : path + '/';
    await this.refresh();
  };
  
  ExplorerApp.prototype.refresh = async function() {
    if (!this.window) return;
    
    try {
      const content = await this.renderExplorer();
      this.window.querySelector('.content').innerHTML = content;
      this.window.querySelector('.title-text').textContent = `File Explorer - ${this.currentPath}`;
      this.attachEventListeners();
    } catch (e) {
      console.error('Explorer refresh failed:', e);
    }
  };
  
  ExplorerApp.prototype.openFile = async function(path) {
    try {
      const text = await FileSystem.readFile(path);
      const filename = path.split('/').pop();
      WindowManager.createWindow(
        `${filename} - Notepad`, 
        `<pre style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; margin: 0;">${escapeHtml(text)}</pre>`, 
        {width: 500, height: 400, x: this.window.offsetLeft + 20, y: this.window.offsetTop + 20}
      );
    } catch (e) {
      WindowManager.createWindow('Error', 
        `<div class="error">Failed to open file: ${e.message}</div>`);
    }
  };
  
  function escapeHtml(s) { 
    return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]); 
  }
  
  // Register with plugin manager
  if(window.PluginManager) {
    window.PluginManager.register('explorer', () => new ExplorerApp());
  }
  global.ExplorerApp = ExplorerApp;
})(window);
