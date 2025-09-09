// My Computer - Windows system navigation
(function(global) {
  class MyComputer extends BaseApp {
    constructor() {
      super('mycomputer', 'My Computer', '💻');
      this.currentPath = 'Computer';
      this.viewMode = 'icons';
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '640px';
      window.style.height = '480px';
      
      const content = window.querySelector('.content');
      content.style.padding = '0';
      content.style.background = 'white';
      content.innerHTML = this.getMyComputerHTML();
      
      this.setupEventListeners(content);
      return window;
    }

    getMyComputerHTML() {
      return `
        <div class="my-computer">
          <div class="toolbar">
            <button class="toolbar-btn" id="back-btn" disabled>
              <span class="btn-icon">←</span>
              <span class="btn-text">Back</span>
            </button>
            <button class="toolbar-btn" id="forward-btn" disabled>
              <span class="btn-icon">→</span>
              <span class="btn-text">Forward</span>
            </button>
            <div class="separator"></div>
            <button class="toolbar-btn" id="up-btn" disabled>
              <span class="btn-icon">⬆</span>
              <span class="btn-text">Up</span>
            </button>
            <div class="separator"></div>
            <div class="address-bar">
              <label>Address:</label>
              <input type="text" id="address-input" value="My Computer" readonly>
            </div>
            <div class="view-controls">
              <button class="view-btn active" data-view="icons">Icons</button>
              <button class="view-btn" data-view="list">List</button>
              <button class="view-btn" data-view="details">Details</button>
            </div>
          </div>
          
          <div class="main-area">
            <div class="sidebar">
              <div class="sidebar-section">
                <div class="sidebar-header">System Tasks</div>
                <div class="sidebar-item" data-action="system-info">View system information</div>
                <div class="sidebar-item" data-action="add-remove">Add or remove programs</div>
                <div class="sidebar-item" data-action="change-setting">Change a setting</div>
              </div>
              
              <div class="sidebar-section">
                <div class="sidebar-header">Other Places</div>
                <div class="sidebar-item" data-action="network">My Network Places</div>
                <div class="sidebar-item" data-action="documents">My Documents</div>
                <div class="sidebar-item" data-action="shared">Shared Documents</div>
                <div class="sidebar-item" data-action="control">Control Panel</div>
              </div>
            </div>
            
            <div class="content-area">
              <div class="drives-container" id="drives-container">
                <div class="drive-item" data-drive="A">
                  <div class="drive-icon">💾</div>
                  <div class="drive-info">
                    <div class="drive-name">3½ Floppy (A:)</div>
                    <div class="drive-details">Floppy disk drive</div>
                  </div>
                </div>
                
                <div class="drive-item" data-drive="C">
                  <div class="drive-icon">💽</div>
                  <div class="drive-info">
                    <div class="drive-name">Local Disk (C:)</div>
                    <div class="drive-details">15.0 GB free of 40.0 GB</div>
                  </div>
                </div>
                
                <div class="drive-item" data-drive="D">
                  <div class="drive-icon">📀</div>
                  <div class="drive-info">
                    <div class="drive-name">CD Drive (D:)</div>
                    <div class="drive-details">CD-ROM drive</div>
                  </div>
                </div>
                
                <div class="system-folders">
                  <div class="folder-item" data-folder="shared">
                    <div class="folder-icon">📂</div>
                    <div class="folder-name">Shared Documents</div>
                  </div>
                  
                  <div class="folder-item" data-folder="user">
                    <div class="folder-icon">👤</div>
                    <div class="folder-name">Administrator's Documents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="status-bar">
            <span id="status-text">My Computer</span>
            <div class="status-info">
              <span id="items-count">4 objects</span>
            </div>
          </div>
        </div>

        <style>
          .my-computer {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'MS Sans Serif', Arial, sans-serif;
          }

          .toolbar {
            background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
            border-bottom: 1px solid #c0c0c0;
            padding: 4px 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .toolbar-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 4px 8px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            font-size: 10px;
            min-width: 50px;
          }

          .toolbar-btn:hover:not(:disabled) {
            border: 1px outset #e0e0e0;
            background: #f0f0f0;
          }

          .toolbar-btn:active:not(:disabled) {
            border: 1px inset #e0e0e0;
          }

          .toolbar-btn:disabled {
            color: #999;
            cursor: not-allowed;
          }

          .btn-icon {
            font-size: 16px;
            margin-bottom: 2px;
          }

          .separator {
            width: 1px;
            height: 32px;
            background: #c0c0c0;
            margin: 0 4px;
          }

          .address-bar {
            display: flex;
            align-items: center;
            gap: 4px;
            flex: 1;
            min-width: 200px;
          }

          .address-bar label {
            font-size: 11px;
          }

          .address-bar input {
            flex: 1;
            padding: 2px 4px;
            border: 2px inset #f0f0f0;
            font-size: 11px;
            background: white;
          }

          .view-controls {
            display: flex;
            gap: 2px;
          }

          .view-btn {
            padding: 2px 6px;
            border: 1px outset #e0e0e0;
            background: #e0e0e0;
            cursor: pointer;
            font-size: 10px;
          }

          .view-btn.active {
            border: 1px inset #e0e0e0;
            background: #d0d0d0;
          }

          .main-area {
            flex: 1;
            display: flex;
            min-height: 0;
          }

          .sidebar {
            width: 200px;
            background: linear-gradient(to right, #f0f8ff, #e6f3ff);
            border-right: 1px solid #c0c0c0;
            padding: 8px;
            overflow-y: auto;
          }

          .sidebar-section {
            margin-bottom: 20px;
          }

          .sidebar-header {
            font-weight: bold;
            color: #000080;
            font-size: 12px;
            margin-bottom: 8px;
            padding-bottom: 2px;
            border-bottom: 1px solid #c0c0c0;
          }

          .sidebar-item {
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            color: #0000ee;
            text-decoration: underline;
            margin-bottom: 4px;
          }

          .sidebar-item:hover {
            color: #ff0000;
          }

          .content-area {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: white;
          }

          .drives-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .drive-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 12px;
            border: 1px solid transparent;
            cursor: pointer;
            border-radius: 2px;
          }

          .drive-item:hover {
            background: #e6f3ff;
            border-color: #0078d4;
          }

          .drive-item:active {
            background: #cce7ff;
          }

          .drive-icon {
            font-size: 32px;
            width: 40px;
            text-align: center;
          }

          .drive-name {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 2px;
          }

          .drive-details {
            font-size: 11px;
            color: #666;
          }

          .system-folders {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }

          .folder-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            cursor: pointer;
            border-radius: 4px;
            min-width: 80px;
          }

          .folder-item:hover {
            background: #e6f3ff;
          }

          .folder-icon {
            font-size: 32px;
            margin-bottom: 4px;
          }

          .folder-name {
            font-size: 11px;
            text-align: center;
            word-wrap: break-word;
          }

          .status-bar {
            background: #f0f0f0;
            border-top: 1px solid #c0c0c0;
            padding: 4px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const backBtn = content.querySelector('#back-btn');
      const forwardBtn = content.querySelector('#forward-btn');
      const upBtn = content.querySelector('#up-btn');
      const viewBtns = content.querySelectorAll('.view-btn');
      const driveItems = content.querySelectorAll('.drive-item');
      const folderItems = content.querySelectorAll('.folder-item');
      const sidebarItems = content.querySelectorAll('.sidebar-item');

      // Navigation buttons
      backBtn.onclick = () => this.navigateBack();
      forwardBtn.onclick = () => this.navigateForward();
      upBtn.onclick = () => this.navigateUp();

      // View mode buttons
      viewBtns.forEach(btn => {
        btn.onclick = () => {
          viewBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.viewMode = btn.dataset.view;
          this.updateView();
        };
      });

      // Drive items
      driveItems.forEach(item => {
        item.onclick = () => {
          const drive = item.dataset.drive;
          this.openDrive(drive);
        };
      });

      // Folder items
      folderItems.forEach(item => {
        item.onclick = () => {
          const folder = item.dataset.folder;
          this.openFolder(folder);
        };
      });

      // Sidebar items
      sidebarItems.forEach(item => {
        item.onclick = () => {
          const action = item.dataset.action;
          this.executeSidebarAction(action);
        };
      });
    }

    navigateBack() {
      // Placeholder for navigation
      this.updateStatus('Back navigation not implemented');
    }

    navigateForward() {
      // Placeholder for navigation
      this.updateStatus('Forward navigation not implemented');
    }

    navigateUp() {
      // Placeholder for navigation
      this.updateStatus('Up navigation not implemented');
    }

    openDrive(drive) {
      this.updateStatus(`Opening ${drive}: drive...`);
      
      // Simulate opening drive with File Explorer
      setTimeout(() => {
        if (window.PluginManager) {
          const explorer = window.PluginManager.create('explorer');
          if (explorer) {
            // Set initial path to the selected drive
            explorer.currentPath = drive + ':';
            explorer.refreshView();
          }
        }
      }, 500);
    }

    openFolder(folder) {
      const folderNames = {
        shared: 'Shared Documents',
        user: "Administrator's Documents"
      };
      
      this.updateStatus(`Opening ${folderNames[folder] || folder}...`);
      
      // Simulate opening folder
      setTimeout(() => {
        if (window.PluginManager) {
          const explorer = window.PluginManager.create('explorer');
        }
      }, 500);
    }

    executeSidebarAction(action) {
      const actions = {
        'system-info': 'System Information',
        'add-remove': 'Add or Remove Programs',
        'change-setting': 'Control Panel',
        'network': 'My Network Places', 
        'documents': 'My Documents',
        'shared': 'Shared Documents',
        'control': 'Control Panel'
      };

      this.updateStatus(`Opening ${actions[action] || action}...`);

      // Handle specific actions
      if (action === 'control' && window.PluginManager) {
        const controlPanel = window.PluginManager.create('control');
      } else if (action === 'documents' && window.PluginManager) {
        const explorer = window.PluginManager.create('explorer');
      }
    }

    updateView() {
      // Placeholder for view mode changes
      this.updateStatus(`Changed to ${this.viewMode} view`);
    }

    updateStatus(message) {
      const statusText = this.window.querySelector('#status-text');
      if (statusText) {
        statusText.textContent = message;
      }
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('mycomputer', MyComputer);
  }
})(window);