// Windows Explorer/File Manager - Navigate files and folders
(function(global) {
  class FileExplorer extends BaseApp {
    constructor() {
      super('explorer', 'Windows Explorer', '📂');
      this.currentPath = 'C:\\';
      this.history = ['C:\\'];
      this.historyIndex = 0;
      this.viewMode = 'details';
      this.selectedItems = [];
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '640px';
      window.style.height = '480px';
      
      const content = window.querySelector('.content');
      content.style.padding = '0';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.innerHTML = this.getExplorerHTML();
      
      this.setupEventListeners(content);
      this.loadDirectory(this.currentPath);
      return window;
    }

    getExplorerHTML() {
      return `
        <div class="file-explorer">
          <div class="menu-bar">
            <div class="menu-item">File</div>
            <div class="menu-item">Edit</div>
            <div class="menu-item">View</div>
            <div class="menu-item">Tools</div>
            <div class="menu-item">Help</div>
          </div>

          <div class="toolbar">
            <button class="tool-btn" id="back-btn" title="Back">⬅️</button>
            <button class="tool-btn" id="forward-btn" title="Forward">➡️</button>
            <button class="tool-btn" id="up-btn" title="Up">⬆️</button>
            <div class="separator"></div>
            <button class="tool-btn" id="cut-btn" title="Cut">✂️</button>
            <button class="tool-btn" id="copy-btn" title="Copy">📋</button>
            <button class="tool-btn" id="paste-btn" title="Paste">📄</button>
            <div class="separator"></div>
            <button class="tool-btn" id="delete-btn" title="Delete">🗑️</button>
            <button class="tool-btn" id="refresh-btn" title="Refresh">🔄</button>
            <div class="separator"></div>
            <div class="view-controls">
              <button class="view-btn" data-view="large" title="Large Icons">🔳</button>
              <button class="view-btn" data-view="small" title="Small Icons">🔸</button>
              <button class="view-btn" data-view="list" title="List">📋</button>
              <button class="view-btn active" data-view="details" title="Details">📊</button>
            </div>
          </div>

          <div class="address-bar">
            <label>Address:</label>
            <input type="text" class="address-input" value="${this.currentPath}">
            <button class="go-btn">Go</button>
          </div>

          <div class="main-area">
            <div class="sidebar">
              <div class="folder-tree">
                <div class="tree-item" data-path="C:\\">
                  <span class="tree-icon">💻</span>
                  <span class="tree-label">My Computer</span>
                </div>
                <div class="tree-item expanded" data-path="C:\\">
                  <span class="tree-icon">💽</span>
                  <span class="tree-label">Local Disk (C:)</span>
                  <div class="tree-children">
                    <div class="tree-item" data-path="C:\\Documents and Settings">
                      <span class="tree-icon">📁</span>
                      <span class="tree-label">Documents and Settings</span>
                    </div>
                    <div class="tree-item" data-path="C:\\Program Files">
                      <span class="tree-icon">📁</span>
                      <span class="tree-label">Program Files</span>
                    </div>
                    <div class="tree-item" data-path="C:\\Windows">
                      <span class="tree-icon">📁</span>
                      <span class="tree-label">Windows</span>
                    </div>
                  </div>
                </div>
                <div class="tree-item" data-path="A:\\">
                  <span class="tree-icon">💾</span>
                  <span class="tree-label">Floppy (A:)</span>
                </div>
              </div>
            </div>

            <div class="file-view">
              <div class="file-list-container">
                <div class="file-list" id="file-list">
                  <!-- Files will be loaded here -->
                </div>
              </div>
            </div>
          </div>

          <div class="status-bar">
            <div class="status-info">
              <span id="item-count">0 objects</span>
              <span class="separator">|</span>
              <span id="selection-info"></span>
            </div>
            <div class="status-right">
              <span id="disk-info">Local Disk (C:)</span>
            </div>
          </div>
        </div>

        <style>
          .file-explorer {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            font-size: 11px;
          }

          .menu-bar {
            display: flex;
            background: #f0f0f0;
            border-bottom: 1px solid #c0c0c0;
            padding: 2px;
          }

          .menu-item {
            padding: 4px 8px;
            cursor: pointer;
          }

          .menu-item:hover {
            background: #e0e0e0;
          }

          .toolbar {
            display: flex;
            align-items: center;
            gap: 2px;
            padding: 4px;
            background: #f0f0f0;
            border-bottom: 1px solid #c0c0c0;
          }

          .tool-btn, .view-btn {
            width: 24px;
            height: 24px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }

          .tool-btn:hover, .view-btn:hover {
            border: 1px outset #f0f0f0;
            background: #e0e0e0;
          }

          .tool-btn:active, .view-btn:active {
            border: 1px inset #f0f0f0;
          }

          .view-btn.active {
            border: 1px inset #f0f0f0;
            background: #d0d0d0;
          }

          .separator {
            width: 1px;
            height: 20px;
            background: #c0c0c0;
            margin: 0 4px;
          }

          .view-controls {
            display: flex;
            gap: 1px;
            margin-left: auto;
          }

          .address-bar {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: #f0f0f0;
            border-bottom: 1px solid #c0c0c0;
          }

          .address-input {
            flex: 1;
            padding: 2px 4px;
            border: 2px inset #f0f0f0;
          }

          .go-btn {
            padding: 2px 8px;
            border: 2px outset #f0f0f0;
            background: #f0f0f0;
            cursor: pointer;
          }

          .main-area {
            flex: 1;
            display: flex;
          }

          .sidebar {
            width: 200px;
            background: #f0f0f0;
            border-right: 1px solid #c0c0c0;
            overflow-y: auto;
            padding: 8px;
          }

          .tree-item {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 2px 4px;
            cursor: pointer;
            white-space: nowrap;
          }

          .tree-item:hover {
            background: #e0e0e0;
          }

          .tree-item.selected {
            background: #0078d4;
            color: white;
          }

          .tree-children {
            margin-left: 16px;
          }

          .tree-icon {
            font-size: 12px;
            width: 16px;
          }

          .file-view {
            flex: 1;
            background: white;
            overflow: auto;
          }

          .file-list {
            width: 100%;
          }

          .file-list.details {
            display: table;
            border-collapse: collapse;
          }

          .file-header {
            display: table-row;
            background: #f0f0f0;
            font-weight: bold;
          }

          .file-header-cell {
            display: table-cell;
            padding: 4px 8px;
            border: 1px solid #c0c0c0;
            cursor: pointer;
          }

          .file-item {
            display: table-row;
            cursor: pointer;
          }

          .file-item:hover {
            background: #e0f2ff;
          }

          .file-item.selected {
            background: #0078d4;
            color: white;
          }

          .file-cell {
            display: table-cell;
            padding: 2px 8px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: middle;
          }

          .file-icon {
            font-size: 16px;
            margin-right: 4px;
          }

          .status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2px 8px;
            background: #f0f0f0;
            border-top: 1px solid #c0c0c0;
            font-size: 10px;
          }

          .status-info {
            display: flex;
            gap: 8px;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      // Navigation buttons
      content.querySelector('#back-btn').onclick = () => this.goBack();
      content.querySelector('#forward-btn').onclick = () => this.goForward();
      content.querySelector('#up-btn').onclick = () => this.goUp();
      content.querySelector('#refresh-btn').onclick = () => this.loadDirectory(this.currentPath);

      // Address bar
      const addressInput = content.querySelector('.address-input');
      const goBtn = content.querySelector('.go-btn');
      
      goBtn.onclick = () => this.navigateTo(addressInput.value);
      addressInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          this.navigateTo(addressInput.value);
        }
      };

      // View mode buttons
      const viewBtns = content.querySelectorAll('.view-btn');
      viewBtns.forEach(btn => {
        btn.onclick = () => {
          viewBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.viewMode = btn.dataset.view;
          this.updateView();
        };
      });

      // Tree navigation
      const treeItems = content.querySelectorAll('.tree-item');
      treeItems.forEach(item => {
        item.onclick = () => {
          const path = item.dataset.path;
          if (path) {
            this.navigateTo(path);
          }
        };
      });
    }

    loadDirectory(path) {
      const fileList = this.window.querySelector('#file-list');
      const addressInput = this.window.querySelector('.address-input');
      
      this.currentPath = path;
      addressInput.value = path;

      // Simulate different directories with sample files
      const directories = {
        'C:\\': [
          { name: 'Documents and Settings', type: 'folder', icon: '📁', size: '', modified: '2023-01-15 10:30' },
          { name: 'Program Files', type: 'folder', icon: '📁', size: '', modified: '2023-02-20 14:45' },
          { name: 'Windows', type: 'folder', icon: '📁', size: '', modified: '2023-01-01 12:00' },
          { name: 'autoexec.bat', type: 'file', icon: '📄', size: '1 KB', modified: '2023-01-01 09:00' },
          { name: 'config.sys', type: 'file', icon: '📄', size: '512 bytes', modified: '2023-01-01 09:00' }
        ],
        'C:\\Program Files': [
          { name: 'Internet Explorer', type: 'folder', icon: '📁', size: '', modified: '2023-01-10 16:20' },
          { name: 'Windows Media Player', type: 'folder', icon: '📁', size: '', modified: '2023-01-10 16:25' },
          { name: 'Accessories', type: 'folder', icon: '📁', size: '', modified: '2023-01-10 16:30' },
          { name: 'Common Files', type: 'folder', icon: '📁', size: '', modified: '2023-01-10 16:35' }
        ],
        'C:\\Documents and Settings': [
          { name: 'Administrator', type: 'folder', icon: '👤', size: '', modified: '2023-01-15 10:30' },
          { name: 'All Users', type: 'folder', icon: '👥', size: '', modified: '2023-01-15 10:30' },
          { name: 'Default User', type: 'folder', icon: '👤', size: '', modified: '2023-01-15 10:30' }
        ],
        'C:\\Windows': [
          { name: 'System32', type: 'folder', icon: '📁', size: '', modified: '2023-01-01 12:00' },
          { name: 'System', type: 'folder', icon: '📁', size: '', modified: '2023-01-01 12:00' },
          { name: 'Temp', type: 'folder', icon: '📁', size: '', modified: '2023-01-01 12:00' },
          { name: 'notepad.exe', type: 'file', icon: '📝', size: '195 KB', modified: '2023-01-01 12:00' },
          { name: 'calc.exe', type: 'file', icon: '🧮', size: '114 KB', modified: '2023-01-01 12:00' },
          { name: 'explorer.exe', type: 'file', icon: '📂', size: '1.04 MB', modified: '2023-01-01 12:00' }
        ]
      };

      const files = directories[path] || [
        { name: '(Empty)', type: 'info', icon: '📄', size: '', modified: '' }
      ];

      this.renderFileList(files);
      this.updateStatusBar(files);
    }

    renderFileList(files) {
      const fileList = this.window.querySelector('#file-list');
      
      if (this.viewMode === 'details') {
        fileList.className = 'file-list details';
        
        let html = `
          <div class="file-header">
            <div class="file-header-cell" style="width: 200px;">Name</div>
            <div class="file-header-cell" style="width: 80px;">Size</div>
            <div class="file-header-cell" style="width: 80px;">Type</div>
            <div class="file-header-cell" style="width: 120px;">Modified</div>
          </div>
        `;
        
        files.forEach((file, index) => {
          html += `
            <div class="file-item" data-index="${index}">
              <div class="file-cell">
                <span class="file-icon">${file.icon}</span>
                ${file.name}
              </div>
              <div class="file-cell">${file.size}</div>
              <div class="file-cell">${file.type === 'folder' ? 'File folder' : file.type === 'info' ? '' : 'Application'}</div>
              <div class="file-cell">${file.modified}</div>
            </div>
          `;
        });
        
        fileList.innerHTML = html;
      } else {
        // Other view modes could be implemented here
        fileList.className = 'file-list details';
        this.renderFileList(files); // Fallback to details view
      }

      // Add click handlers for file items
      const fileItems = fileList.querySelectorAll('.file-item');
      fileItems.forEach((item, index) => {
        item.onclick = () => this.selectFile(index, files[index]);
        item.ondblclick = () => this.openFile(files[index]);
      });
    }

    selectFile(index, file) {
      const fileItems = this.window.querySelectorAll('.file-item');
      fileItems.forEach(item => item.classList.remove('selected'));
      fileItems[index].classList.add('selected');
      
      this.selectedItems = [file];
      this.updateStatusBar();
    }

    openFile(file) {
      if (file.type === 'folder') {
        const newPath = this.currentPath.endsWith('\\') ? 
          this.currentPath + file.name : 
          this.currentPath + '\\' + file.name;
        this.navigateTo(newPath);
      } else if (file.type === 'file') {
        // Try to open the file with associated program
        this.openAssociatedProgram(file);
      }
    }

    openAssociatedProgram(file) {
      const extensions = {
        'notepad.exe': 'notepad',
        'calc.exe': 'calc',
        'explorer.exe': 'explorer'
      };

      const app = extensions[file.name];
      if (app && global.PluginManager) {
        const instance = global.PluginManager.create(app);
        if (instance && instance.open) {
          instance.open();
        }
      }
    }

    navigateTo(path) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(path);
      this.historyIndex = this.history.length - 1;
      this.loadDirectory(path);
    }

    goBack() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.loadDirectory(this.history[this.historyIndex]);
      }
    }

    goForward() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.loadDirectory(this.history[this.historyIndex]);
      }
    }

    goUp() {
      if (this.currentPath !== 'C:\\') {
        const parts = this.currentPath.split('\\');
        parts.pop();
        const parentPath = parts.join('\\') || 'C:';
        this.navigateTo(parentPath.endsWith('\\') ? parentPath : parentPath + '\\');
      }
    }

    updateView() {
      this.loadDirectory(this.currentPath);
    }

    updateStatusBar(files = null) {
      const itemCount = this.window.querySelector('#item-count');
      const selectionInfo = this.window.querySelector('#selection-info');
      
      if (files) {
        const count = files.length;
        itemCount.textContent = `${count} object${count !== 1 ? 's' : ''}`;
      }
      
      if (this.selectedItems.length > 0) {
        selectionInfo.textContent = `${this.selectedItems.length} selected`;
      } else {
        selectionInfo.textContent = '';
      }
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('explorer', FileExplorer);
  }
})(window);