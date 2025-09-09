// Windows Control Panel - System settings and configuration
(function(global) {
  class ControlPanel extends BaseApp {
    constructor() {
      super('control', 'Control Panel', '⚙️');
      this.currentView = 'category';
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '560px';
      window.style.height = '420px';
      
      const content = window.querySelector('.content');
      content.style.padding = '8px';
      content.style.background = '#f0f0f0';
      content.innerHTML = this.getControlPanelHTML();
      
      this.setupEventListeners(content);
      return window;
    }

    getControlPanelHTML() {
      return `
        <div class="control-panel">
          <div class="toolbar">
            <div class="view-controls">
              <button class="view-btn active" data-view="category">Category View</button>
              <button class="view-btn" data-view="classic">Classic View</button>
              <button class="view-btn" data-view="small">Small Icons</button>
            </div>
            <div class="search-box">
              <input type="text" placeholder="Search Control Panel" class="search-input">
            </div>
          </div>

          <div class="content-area">
            <div class="category-view" id="category-view">
              <h2>Adjust your computer's settings</h2>
              
              <div class="category-section">
                <div class="category-item" data-category="system">
                  <div class="category-icon">💻</div>
                  <div class="category-info">
                    <h3>System and Security</h3>
                    <p>Review your computer's status, back up files, find and fix problems</p>
                    <div class="subcategories">
                      • Windows Security • System • Windows Tools • File History
                    </div>
                  </div>
                </div>

                <div class="category-item" data-category="network">
                  <div class="category-icon">🌐</div>
                  <div class="category-info">
                    <h3>Network and Internet</h3>
                    <p>Connect to the internet, set up a home network, manage wireless settings</p>
                    <div class="subcategories">
                      • Internet Options • Network Center • Windows Defender Firewall
                    </div>
                  </div>
                </div>

                <div class="category-item" data-category="hardware">
                  <div class="category-icon">🖨</div>
                  <div class="category-info">
                    <h3>Hardware and Sound</h3>
                    <p>Add a printer, change mouse settings, adjust volume</p>
                    <div class="subcategories">
                      • Devices and Printers • Sound • Power Options • Display
                    </div>
                  </div>
                </div>

                <div class="category-item" data-category="programs">
                  <div class="category-icon">📦</div>
                  <div class="category-info">
                    <h3>Programs</h3>
                    <p>Uninstall programs, change startup programs, view installed updates</p>
                    <div class="subcategories">
                      • Default Programs • Programs and Features • Java
                    </div>
                  </div>
                </div>

                <div class="category-item" data-category="accounts">
                  <div class="category-icon">👥</div>
                  <div class="category-info">
                    <h3>User Accounts</h3>
                    <p>Change account type, manage another account, change User Account Control settings</p>
                    <div class="subcategories">
                      • User Accounts • Mail • Credential Manager
                    </div>
                  </div>
                </div>

                <div class="category-item" data-category="appearance">
                  <div class="category-icon">🎨</div>
                  <div class="category-info">
                    <h3>Appearance and Personalization</h3>
                    <p>Change desktop background, screen saver, window color and sounds</p>
                    <div class="subcategories">
                      • Personalization • Display • Taskbar • Folder Options
                    </div>
                  </div>
                </div>

                <div class="category-item" data-category="clock">
                  <div class="category-icon">🕐</div>
                  <div class="category-info">
                    <h3>Clock and Region</h3>
                    <p>Change keyboards, date, time, number, and regional settings</p>
                    <div class="subcategories">
                      • Date and Time • Region • Language
                    </div>
                  </div>
                </div>

                <div class="category-item" data-category="ease">
                  <div class="category-icon">♿</div>
                  <div class="category-info">
                    <h3>Ease of Access</h3>
                    <p>Optimize display for blindness, use computer without mouse, set up microphone</p>
                    <div class="subcategories">
                      • Ease of Access Center • Speech Recognition
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="classic-view hidden" id="classic-view">
              <div class="icons-grid">
                <div class="control-item" data-item="display">
                  <div class="item-icon">🖥</div>
                  <div class="item-name">Display</div>
                </div>
                
                <div class="control-item" data-item="sound">
                  <div class="item-icon">🔊</div>
                  <div class="item-name">Sound</div>
                </div>
                
                <div class="control-item" data-item="mouse">
                  <div class="item-icon">🖱</div>
                  <div class="item-name">Mouse</div>
                </div>
                
                <div class="control-item" data-item="keyboard">
                  <div class="item-icon">⌨️</div>
                  <div class="item-name">Keyboard</div>
                </div>
                
                <div class="control-item" data-item="system">
                  <div class="item-icon">💻</div>
                  <div class="item-name">System</div>
                </div>
                
                <div class="control-item" data-item="network">
                  <div class="item-icon">🌐</div>
                  <div class="item-name">Network</div>
                </div>
                
                <div class="control-item" data-item="printers">
                  <div class="item-icon">🖨</div>
                  <div class="item-name">Printers</div>
                </div>
                
                <div class="control-item" data-item="programs">
                  <div class="item-icon">📦</div>
                  <div class="item-name">Add/Remove Programs</div>
                </div>
                
                <div class="control-item" data-item="users">
                  <div class="item-icon">👥</div>
                  <div class="item-name">User Accounts</div>
                </div>
                
                <div class="control-item" data-item="accessibility">
                  <div class="item-icon">♿</div>
                  <div class="item-name">Accessibility</div>
                </div>
                
                <div class="control-item" data-item="datetime">
                  <div class="item-icon">🕐</div>
                  <div class="item-name">Date/Time</div>
                </div>
                
                <div class="control-item" data-item="regional">
                  <div class="item-icon">🌍</div>
                  <div class="item-name">Regional Settings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>
          .control-panel {
            height: 100%;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            display: flex;
            flex-direction: column;
          }

          .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            background: #e0e0e0;
            border-bottom: 2px inset #f0f0f0;
          }

          .view-controls {
            display: flex;
            gap: 4px;
          }

          .view-btn {
            padding: 4px 8px;
            border: 2px outset #f0f0f0;
            background: #f0f0f0;
            cursor: pointer;
            font-size: 11px;
          }

          .view-btn.active {
            border: 2px inset #f0f0f0;
            background: #d0d0d0;
          }

          .search-input {
            padding: 4px;
            border: 2px inset #f0f0f0;
            font-size: 11px;
            width: 150px;
          }

          .content-area {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
          }

          .category-view h2 {
            margin: 0 0 20px 0;
            color: #000080;
            font-size: 16px;
          }

          .category-section {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .category-item {
            display: flex;
            gap: 12px;
            padding: 12px;
            border: 1px solid #d0d0d0;
            background: white;
            cursor: pointer;
            border-radius: 2px;
          }

          .category-item:hover {
            background: #f0f8ff;
            border-color: #0078d4;
          }

          .category-icon {
            font-size: 32px;
            width: 48px;
            text-align: center;
          }

          .category-info h3 {
            margin: 0 0 4px 0;
            color: #000080;
            font-size: 14px;
          }

          .category-info p {
            margin: 0 0 8px 0;
            color: #333;
            font-size: 11px;
            line-height: 1.4;
          }

          .subcategories {
            font-size: 10px;
            color: #666;
          }

          .icons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 16px;
            padding: 16px;
          }

          .control-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            cursor: pointer;
            border-radius: 4px;
            text-align: center;
          }

          .control-item:hover {
            background: #e0e0e0;
          }

          .item-icon {
            font-size: 32px;
            margin-bottom: 4px;
          }

          .item-name {
            font-size: 10px;
            line-height: 1.2;
            max-width: 70px;
            word-wrap: break-word;
          }

          .hidden {
            display: none;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const viewButtons = content.querySelectorAll('.view-btn');
      const categoryItems = content.querySelectorAll('.category-item');
      const controlItems = content.querySelectorAll('.control-item');

      // View switching
      viewButtons.forEach(btn => {
        btn.onclick = () => {
          viewButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.switchView(btn.dataset.view);
        };
      });

      // Category items
      categoryItems.forEach(item => {
        item.onclick = () => {
          this.openCategory(item.dataset.category);
        };
      });

      // Control items
      controlItems.forEach(item => {
        item.onclick = () => {
          this.openControlItem(item.dataset.item);
        };
      });
    }

    switchView(viewType) {
      const content = this.window.querySelector('.content');
      const categoryView = content.querySelector('#category-view');
      const classicView = content.querySelector('#classic-view');

      categoryView.classList.add('hidden');
      classicView.classList.add('hidden');

      if (viewType === 'category') {
        categoryView.classList.remove('hidden');
      } else {
        classicView.classList.remove('hidden');
      }

      this.currentView = viewType;
    }

    openCategory(category) {
      // Create a simple modal dialog for the category
      this.showDialog(`${category.charAt(0).toUpperCase() + category.slice(1)} Settings`, 
        `This would open the ${category} settings panel. In a full implementation, this would show the actual system settings for this category.`);
    }

    openControlItem(item) {
      // Handle specific control panel items
      const messages = {
        display: 'Display Properties:\n• Screen resolution: 1024x768\n• Color depth: 32-bit\n• Refresh rate: 60 Hz',
        sound: 'Sound Properties:\n• Default playback device: Speakers\n• Default recording device: Microphone\n• System sounds: Windows Default',
        mouse: 'Mouse Properties:\n• Button configuration: Right-handed\n• Double-click speed: Medium\n• Pointer speed: Medium',
        keyboard: 'Keyboard Properties:\n• Repeat delay: Short\n• Repeat rate: Fast\n• Cursor blink rate: Medium',
        system: 'System Properties:\n• Computer: Windows Simulator\n• Processor: Virtual CPU\n• Memory: 4.00 GB RAM',
        network: 'Network Connections:\n• Local Area Connection: Connected\n• Wireless Network Connection: Available',
        printers: 'Printers and Faxes:\n• Microsoft Print to PDF\n• Add Printer Wizard available',
        programs: 'Add or Remove Programs:\n• Currently installed programs list\n• Windows components configuration',
        users: 'User Accounts:\n• Current user: Administrator\n• Account type: Administrator\n• Password protected: Yes',
        accessibility: 'Accessibility Options:\n• High contrast: Off\n• Magnifier: Available\n• On-Screen Keyboard: Available',
        datetime: 'Date and Time Properties:\n• Current date: ' + new Date().toLocaleDateString() + '\n• Current time: ' + new Date().toLocaleTimeString() + '\n• Time zone: Local',
        regional: 'Regional and Language Options:\n• Language: English (United States)\n• Number format: 1,234.56\n• Currency: $ (US Dollar)'
      };

      this.showDialog(item.charAt(0).toUpperCase() + item.slice(1) + ' Properties', 
        messages[item] || `This would open the ${item} configuration panel.`);
    }

    showDialog(title, message) {
      // Create a simple modal dialog
      const dialog = document.createElement('div');
      dialog.style.position = 'fixed';
      dialog.style.top = '50%';
      dialog.style.left = '50%';
      dialog.style.transform = 'translate(-50%, -50%)';
      dialog.style.background = '#f0f0f0';
      dialog.style.border = '2px outset #f0f0f0';
      dialog.style.padding = '16px';
      dialog.style.zIndex = '10000';
      dialog.style.minWidth = '300px';
      dialog.style.fontFamily = 'MS Sans Serif, Arial, sans-serif';
      dialog.style.fontSize = '11px';

      dialog.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 12px; color: #000080;">${title}</div>
        <div style="white-space: pre-line; margin-bottom: 16px;">${message}</div>
        <div style="text-align: center;">
          <button style="padding: 4px 16px; border: 2px outset #f0f0f0; background: #f0f0f0; cursor: pointer;" onclick="this.parentElement.parentElement.remove();">OK</button>
        </div>
      `;

      document.body.appendChild(dialog);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (dialog.parentElement) {
          dialog.remove();
        }
      }, 5000);
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('control', ControlPanel);
  }
})(window);