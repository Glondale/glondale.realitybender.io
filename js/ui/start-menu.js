// OS-specific Start Menu with authentic styling
(function(global){
  const StartMenu = {
    menuEl: null,
    
    // Define comprehensive progressive menu items (newer OS includes older items)
    getMenuItems(theme) {
      // Base Windows 95 Programs structure
      const win95Programs = {
        accessories: {
          name: 'Accessories',
          icon: '🛠',
          submenu: [
            { name: 'Calculator', icon: '🧮', app: 'calc' },
            { name: 'Calendar', icon: '📅', app: 'calendar' },
            { name: 'Cardfile', icon: '📇', app: 'cardfile' },
            { name: 'Character Map', icon: '🗺', app: 'charmap' },
            { name: 'Clock', icon: '🕐', app: 'clock' },
            { name: 'Notepad', icon: '📝', app: 'notepad' },
            { name: 'Paint', icon: '🎨', app: 'paint' },
            { name: 'Phone Dialer', icon: '📞', app: 'dialer' },
            { name: 'Quick View', icon: '👁', app: 'quickview' },
            { name: 'Sound Recorder', icon: '🎙', app: 'soundrec' },
            { name: 'WordPad', icon: '📄', app: 'wordpad' }
          ]
        },
        games: {
          name: 'Games',
          icon: '🎮',
          submenu: [
            { name: 'FreeCell', icon: '🃏', app: 'freecell' },
            { name: 'Hearts', icon: '♥️', app: 'hearts' },
            { name: 'Minesweeper', icon: '💣', app: 'minesweeper' },
            { name: 'Solitaire', icon: '🂠', app: 'solitaire' }
          ]
        },
        multimedia: {
          name: 'Multimedia',
          icon: '🎭',
          submenu: [
            { name: 'CD Player', icon: '💿', app: 'cdplayer' },
            { name: 'Media Player', icon: '▶️', app: 'mediaplayer' },
            { name: 'Sound Recorder', icon: '🎙', app: 'soundrec' },
            { name: 'Volume Control', icon: '🔊', app: 'volume' }
          ]
        },
        systemTools: {
          name: 'System Tools',
          icon: '⚙️',
          submenu: [
            { name: 'Backup', icon: '💾', app: 'backup' },
            { name: 'Character Map', icon: '🗺', app: 'charmap' },
            { name: 'Disk Defragmenter', icon: '🗂', app: 'defrag' },
            { name: 'DriveSpace', icon: '💽', app: 'drivespace' },
            { name: 'Resource Meter', icon: '📊', app: 'rsrcmeter' },
            { name: 'ScanDisk', icon: '🔍', app: 'scandisk' },
            { name: 'System Monitor', icon: '📈', app: 'sysmon' }
          ]
        }
      };

      // Build progressive menu structures
      const menuStructure = {
        windows95: [
          {
            name: 'Programs',
            icon: '📁',
            submenu: [
              win95Programs.accessories,
              win95Programs.games,
              win95Programs.multimedia,
              win95Programs.systemTools
            ]
          },
          { name: 'Documents', icon: '📄', submenu: [
            { name: '(empty)', icon: '📄', disabled: true }
          ]},
          { name: 'Settings', icon: '⚙️', submenu: [
            { name: 'Control Panel', icon: '🎛', app: 'control' },
            { name: 'Printers', icon: '🖨', app: 'printers' },
            { name: 'Taskbar & Start Menu...', icon: '📊', app: 'taskbar-settings' }
          ]},
          { name: 'Find', icon: '🔍', submenu: [
            { name: 'Files or Folders...', icon: '📁', app: 'find-files' },
            { name: 'Computer...', icon: '💻', app: 'find-computer' }
          ]},
          { name: 'Help', icon: '❓', app: 'help' },
          { name: 'Run...', icon: '▶️', app: 'run' },
          { name: 'Shut Down...', icon: '⏻', app: 'shutdown' }
        ],

        windows98: [
          {
            name: 'Programs',
            icon: '📁',
            submenu: [
              win95Programs.accessories,
              win95Programs.games,
              win95Programs.multimedia,
              win95Programs.systemTools,
              { name: 'Internet Explorer', icon: '🌐', app: 'iexplore' }
            ]
          },
          { name: 'Documents', icon: '📄', submenu: [
            { name: '(empty)', icon: '📄', disabled: true }
          ]},
          { name: 'Settings', icon: '⚙️', submenu: [
            { name: 'Control Panel', icon: '🎛', app: 'control' },
            { name: 'Printers', icon: '🖨', app: 'printers' },
            { name: 'Taskbar & Start Menu...', icon: '📊', app: 'taskbar-settings' }
          ]},
          { name: 'Find', icon: '🔍', submenu: [
            { name: 'Files or Folders...', icon: '📁', app: 'find-files' },
            { name: 'Computer...', icon: '💻', app: 'find-computer' }
          ]},
          { name: 'Help', icon: '❓', app: 'help' },
          { name: 'Run...', icon: '▶️', app: 'run' },
          { name: 'Windows Update', icon: '🔄', app: 'winupdate' },
          { name: 'Log Off...', icon: '👤', app: 'logoff' },
          { name: 'Shut Down...', icon: '⏻', app: 'shutdown' }
        ],

        win2000: [
          {
            name: 'Programs',
            icon: '📁',
            submenu: [
              win95Programs.accessories,
              win95Programs.games,
              win95Programs.multimedia,
              win95Programs.systemTools,
              { name: 'Internet Explorer', icon: '🌐', app: 'iexplore' },
              {
                name: 'Administrative Tools',
                icon: '🔧',
                submenu: [
                  { name: 'Computer Management', icon: '💻', app: 'compmgmt' },
                  { name: 'Event Viewer', icon: '📋', app: 'eventvwr' },
                  { name: 'Local Security Policy', icon: '🔒', app: 'secpol' },
                  { name: 'Performance', icon: '📊', app: 'perfmon' },
                  { name: 'Services', icon: '⚙️', app: 'services' }
                ]
              }
            ]
          },
          { name: 'Documents', icon: '📄', submenu: [
            { name: 'My Documents', icon: '📁', app: 'mydocs' },
            { name: 'My Network Places', icon: '🌐', app: 'netplaces' }
          ]},
          { name: 'Settings', icon: '⚙️', submenu: [
            { name: 'Control Panel', icon: '🎛', app: 'control' },
            { name: 'Printers', icon: '🖨', app: 'printers' },
            { name: 'Taskbar & Start Menu...', icon: '📊', app: 'taskbar-settings' }
          ]},
          { name: 'Find', icon: '🔍', submenu: [
            { name: 'Files or Folders...', icon: '📁', app: 'find-files' },
            { name: 'Computer...', icon: '💻', app: 'find-computer' }
          ]},
          { name: 'Help', icon: '❓', app: 'help' },
          { name: 'Run...', icon: '▶️', app: 'run' },
          { name: 'Windows Update', icon: '🔄', app: 'winupdate' },
          { name: 'Log Off...', icon: '👤', app: 'logoff' },
          { name: 'Shut Down...', icon: '⏻', app: 'shutdown' }
        ],

        winxp: [
          // XP Frequent Programs (left side)
          { name: 'Internet', icon: '🌐', app: 'iexplore', frequent: true },
          { name: 'E-mail', icon: '📧', app: 'outlook', frequent: true },
          { name: 'MSN Explorer', icon: '🌍', app: 'msn', frequent: true },
          { name: 'Windows Media Player', icon: '🎵', app: 'wmplayer', frequent: true },
          { name: 'Tour Windows XP', icon: '🎯', app: 'tour', frequent: true },
          { name: 'Files and Settings Transfer Wizard', icon: '📦', app: 'migwiz', frequent: true },
          
          // XP Standard Items (right side)
          { name: 'My Documents', icon: '📁', app: 'mydocs' },
          { name: 'My Recent Documents', icon: '📋', submenu: [
            { name: '(empty)', icon: '📄', disabled: true }
          ]},
          { name: 'My Pictures', icon: '🖼️', app: 'mypics' },
          { name: 'My Music', icon: '🎵', app: 'mymusic' },
          { name: 'My Computer', icon: '💻', app: 'mycomputer' },
          { name: 'My Network Places', icon: '🌐', app: 'netplaces' },
          { name: 'Control Panel', icon: '⚙️', app: 'control' },
          { name: 'Set Program Access and Defaults', icon: '🔧', app: 'progaccess' },
          { name: 'Printers and Faxes', icon: '🖨', app: 'printers' },
          { name: 'Help and Support', icon: '❓', app: 'help' },
          { name: 'Search', icon: '🔍', app: 'search' },
          { name: 'Run...', icon: '▶️', app: 'run' },
          { name: 'All Programs', icon: '📁', submenu: 'all_programs' }
        ],

        win7: [
          // Recently used programs
          { name: 'Getting Started', icon: '🏁', app: 'gettingstarted' },
          { name: 'Windows Media Center', icon: '📺', app: 'mediacenter' },
          { name: 'Calculator', icon: '🧮', app: 'calc' },
          { name: 'Sticky Notes', icon: '📝', app: 'stickynotes' },
          { name: 'Snipping Tool', icon: '✂️', app: 'snippingtool' },
          { name: 'Paint', icon: '🎨', app: 'paint' },
          { name: 'Remote Desktop Connection', icon: '🖥', app: 'mstsc' },
          { name: 'Solitaire', icon: '🃏', app: 'solitaire' },
          { name: 'All Programs', icon: '📁', submenu: 'all_programs' }
        ],

        win8: [
          // Metro tiles with different sizes
          { name: 'Mail', icon: '📧', app: 'mail', tileSize: 'wide', color: '#0078d4' },
          { name: 'Calendar', icon: '📅', tileSize: 'medium', color: '#0078d4' },
          { name: 'People', icon: '👥', tileSize: 'medium', color: '#00bcf2' },
          { name: 'Photos', icon: '🖼️', tileSize: 'wide', color: '#00b294' },
          { name: 'Maps', icon: '🗺', tileSize: 'medium', color: '#8764b8' },
          { name: 'Internet Explorer', icon: '🌐', tileSize: 'medium', color: '#0078d4' },
          { name: 'Store', icon: '🛒', tileSize: 'medium', color: '#00bcf2' },
          { name: 'Xbox Games', icon: '🎮', tileSize: 'wide', color: '#107c10' },
          { name: 'Music', icon: '🎵', tileSize: 'wide', color: '#881798' },
          { name: 'Video', icon: '🎬', tileSize: 'wide', color: '#881798' },
          { name: 'Camera', icon: '📷', tileSize: 'medium', color: '#00b294' },
          { name: 'Weather', icon: '🌤', tileSize: 'wide', color: '#0078d4' },
          { name: 'Travel', icon: '✈️', tileSize: 'medium', color: '#00bcf2' },
          { name: 'News', icon: '📰', tileSize: 'wide', color: '#881798' },
          { name: 'Sports', icon: '⚽', tileSize: 'medium', color: '#107c10' },
          { name: 'Finance', icon: '💰', tileSize: 'medium', color: '#00b294' },
          { name: 'Desktop', icon: '💻', tileSize: 'small', color: '#8764b8' }
        ],

        win10: [
          // Pinned apps
          { name: 'Mail', icon: '📧', app: 'mail', category: 'pinned' },
          { name: 'Calendar', icon: '📅', category: 'pinned' },
          { name: 'Microsoft Edge', icon: '🌐', category: 'pinned' },
          { name: 'Photos', icon: '🖼️', category: 'pinned' },
          { name: 'Groove Music', icon: '🎵', category: 'pinned' },
          { name: 'Movies & TV', icon: '🎬', category: 'pinned' },
          { name: 'Microsoft Store', icon: '🛒', category: 'pinned' },
          { name: 'Xbox', icon: '🎮', category: 'pinned' },
          { name: 'Weather', icon: '🌤', category: 'pinned' },
          
          // All Apps (includes legacy)
          { name: '3D Builder', icon: '🏗', category: 'all' },
          { name: 'Calculator', icon: '🧮', app: 'calc', category: 'all' },
          { name: 'Camera', icon: '📷', category: 'all' },
          { name: 'Get Help', icon: '❓', category: 'all' },
          { name: 'Get Started', icon: '🏁', category: 'all' },
          { name: 'Maps', icon: '🗺', category: 'all' },
          { name: 'Microsoft Solitaire Collection', icon: '🃏', app: 'solitaire', category: 'all' },
          { name: 'Mixed Reality Portal', icon: '🥽', category: 'all' },
          { name: 'News', icon: '📰', category: 'all' },
          { name: 'Notepad', icon: '📝', app: 'notepad', category: 'all' },
          { name: 'OneNote', icon: '📓', category: 'all' },
          { name: 'Paint 3D', icon: '🎨', app: 'paint3d', category: 'all' },
          { name: 'People', icon: '👥', category: 'all' },
          { name: 'Snip & Sketch', icon: '✂️', category: 'all' },
          { name: 'Sticky Notes', icon: '📝', category: 'all' },
          { name: 'Tips', icon: '💡', category: 'all' },
          { name: 'Voice Recorder', icon: '🎙', category: 'all' },
          { name: 'Windows Security', icon: '🛡', category: 'all' }
        ],

        win11: [
          // Pinned apps
          { name: 'Microsoft Edge', icon: '🌐', category: 'pinned' },
          { name: 'Microsoft Store', icon: '🛒', category: 'pinned' },
          { name: 'Microsoft Teams', icon: '👥', category: 'pinned' },
          { name: 'Microsoft 365', icon: '📋', category: 'pinned' },
          { name: 'Xbox', icon: '🎮', category: 'pinned' },
          { name: 'Outlook', icon: '📧', app: 'outlook', category: 'pinned' },
          { name: 'Word', icon: '📝', category: 'pinned' },
          { name: 'Excel', icon: '📊', category: 'pinned' },
          { name: 'PowerPoint', icon: '📽', category: 'pinned' },
          { name: 'OneNote', icon: '📓', category: 'pinned' },
          { name: 'To Do', icon: '✅', category: 'pinned' },
          { name: 'Power BI', icon: '📈', category: 'pinned' },

          // Recommended (recent + legacy apps)
          { name: 'Calculator', icon: '🧮', app: 'calc', category: 'recommended' },
          { name: 'Notepad', icon: '📝', app: 'notepad', category: 'recommended' },
          { name: 'Paint', icon: '🎨', app: 'paint', category: 'recommended' },
          { name: 'Photos', icon: '🖼️', category: 'recommended' },
          { name: 'Settings', icon: '⚙️', category: 'recommended' },
          { name: 'File Explorer', icon: '📂', app: 'explorer', category: 'recommended' },
          
          // All Apps (comprehensive list including legacy)
          { name: 'Alarms & Clock', icon: '⏰', category: 'all' },
          { name: 'Calendar', icon: '📅', category: 'all' },
          { name: 'Camera', icon: '📷', category: 'all' },
          { name: 'Clipchamp', icon: '🎬', category: 'all' },
          { name: 'Clock', icon: '🕐', app: 'clock', category: 'all' },
          { name: 'Cortana', icon: '🔵', category: 'all' },
          { name: 'Feedback Hub', icon: '💬', category: 'all' },
          { name: 'Get Help', icon: '❓', category: 'all' },
          { name: 'Groove Music', icon: '🎵', category: 'all' },
          { name: 'Mail', icon: '📧', app: 'mail', category: 'all' },
          { name: 'Maps', icon: '🗺', category: 'all' },
          { name: 'Microsoft Solitaire Collection', icon: '🃏', app: 'solitaire', category: 'all' },
          { name: 'Movies & TV', icon: '🎬', category: 'all' },
          { name: 'News', icon: '📰', category: 'all' },
          { name: 'Paint 3D', icon: '🎨', app: 'paint3d', category: 'all' },
          { name: 'People', icon: '👥', category: 'all' },
          { name: 'Phone Link', icon: '📱', category: 'all' },
          { name: 'Snipping Tool', icon: '✂️', app: 'snippingtool', category: 'all' },
          { name: 'Spotify', icon: '🎵', category: 'all' },
          { name: 'Sticky Notes', icon: '📝', app: 'stickynotes', category: 'all' },
          { name: 'Tips', icon: '💡', category: 'all' },
          { name: 'Voice Recorder', icon: '🎙', app: 'soundrec', category: 'all' },
          { name: 'Weather', icon: '🌤', category: 'all' },
          { name: 'Whiteboard', icon: '📋', category: 'all' },
          { name: 'Windows Security', icon: '🛡', category: 'all' },
          { name: 'Windows Terminal', icon: '⌨️', category: 'all' },
          { name: 'WordPad', icon: '📄', app: 'wordpad', category: 'all' }
        ]
      };

      return menuStructure[theme] || menuStructure.windows95;
    },

    toggle(env){
      if(this.menuEl){ this.menuEl.remove(); this.menuEl = null; return; }
      const theme = (env && env.ui && env.ui.theme) || (env && env.version) || 'windows95';
      
      console.log('StartMenu: Opening menu for theme:', theme);
      
      const menuItems = this.getMenuItems(theme);
      console.log('StartMenu: Menu items:', menuItems);
      
      const el = document.createElement('div');
      el.className = `start-menu theme-${theme}`;
      el.style.position='absolute';
      el.style.left='8px';
      el.style.bottom='44px';
      el.style.zIndex='1000';
      
      // Apply theme-specific styling
      this.applyThemeStyles(el, theme);
      
      // Create menu content based on OS
      this.createMenuContent(el, menuItems, theme);
      
      document.getElementById('desktop-root').appendChild(el);
      this.menuEl = el;
    },
    
    applyThemeStyles(el, theme){
      switch(theme) {
        case 'windows95':
        case 'windows98':
          el.style.width='220px';
          el.style.background='#c0c0c0';
          el.style.border='2px outset #c0c0c0';
          el.style.fontFamily='MS Sans Serif, Arial, sans-serif';
          el.style.fontSize='11px';
          break;
        case 'win2000':
          el.style.width='240px';
          el.style.background='#e6f2ff';
          el.style.border='1px solid #9bc2e6';
          el.style.borderRadius='0';
          el.style.boxShadow='2px 2px 4px rgba(0,0,0,0.3)';
          break;
        case 'winxp':
          el.style.width='300px';
          el.style.background='linear-gradient(to bottom, #fff 0%, #f0f8ff 100%)';
          el.style.border='1px solid #4e9a06';
          el.style.borderRadius='8px';
          el.style.boxShadow='0 4px 8px rgba(0,0,0,0.3)';
          break;
        case 'win7':
          el.style.width='320px';
          el.style.background='rgba(0,0,0,0.8)';
          el.style.backdropFilter='blur(20px)';
          el.style.border='1px solid rgba(255,255,255,0.2)';
          el.style.borderRadius='8px';
          el.style.boxShadow='0 0 20px rgba(0,0,0,0.5)';
          break;
        case 'win8':
          el.style.width='100vw';
          el.style.height='100vh';
          el.style.left='0';
          el.style.bottom='0';
          el.style.background='#1a6fb3';
          el.style.border='none';
          break;
        case 'win10':
          el.style.width='340px';
          el.style.background='rgba(0,0,0,0.95)';
          el.style.backdropFilter='blur(20px)';
          el.style.border='1px solid rgba(255,255,255,0.1)';
          el.style.borderRadius='4px';
          break;
        case 'win11':
          el.style.width='360px';
          el.style.background='rgba(32,32,32,0.9)';
          el.style.backdropFilter='blur(30px)';
          el.style.border='1px solid rgba(255,255,255,0.05)';
          el.style.borderRadius='12px';
          el.style.boxShadow='0 8px 32px rgba(0,0,0,0.5)';
          break;
      }
    },
    
    createMenuContent(el, menuItems, theme){
      if(theme === 'win8') {
        this.createWin8StartScreen(el, menuItems);
      } else if(theme === 'win10' || theme === 'win11') {
        this.createModernStartMenu(el, menuItems, theme);
      } else if(theme === 'winxp') {
        this.createXPStartMenu(el, menuItems);
      } else if(theme === 'win7') {
        this.createWin7StartMenu(el, menuItems);
      } else {
        this.createClassicStartMenu(el, menuItems, theme);
      }
    },
    
    createClassicStartMenu(el, menuItems, theme){
      const container = document.createElement('div');
      container.style.padding = '2px 0';
      
      menuItems.forEach(item => {
        const menuItem = this.createMenuItem(item, theme);
        container.appendChild(menuItem);
      });
      
      el.appendChild(container);
    },

    createXPStartMenu(el, menuItems) {
      // XP Left panel with user info
      const leftPanel = document.createElement('div');
      leftPanel.style.width = '200px';
      leftPanel.style.background = 'linear-gradient(to bottom, #4a90e2 0%, #73d216 100%)';
      leftPanel.style.color = 'white';
      leftPanel.style.padding = '24px 16px 16px 16px';
      leftPanel.style.borderRadius = '8px 0 0 8px';
      leftPanel.style.cssFloat = 'left';
      leftPanel.innerHTML = `
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">Windows XP</div>
        <div style="font-size: 11px; opacity: 0.9;">Professional</div>
        <div style="margin-top: 20px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px;">
          <div style="font-weight: bold;">👤 User</div>
        </div>
      `;

      // XP Right panel with programs
      const rightPanel = document.createElement('div');
      rightPanel.style.width = '220px';
      rightPanel.style.background = '#f0f8ff';
      rightPanel.style.padding = '8px';
      rightPanel.style.borderRadius = '0 8px 8px 0';
      rightPanel.style.cssFloat = 'left';
      rightPanel.style.borderLeft = '1px solid #ccc';

      // Add frequently used programs section
      const frequentTitle = document.createElement('div');
      frequentTitle.textContent = 'Frequently Used Programs';
      frequentTitle.style.fontSize = '11px';
      frequentTitle.style.fontWeight = 'bold';
      frequentTitle.style.color = '#666';
      frequentTitle.style.marginBottom = '8px';
      rightPanel.appendChild(frequentTitle);

      // Add first 6 menu items as frequently used
      menuItems.slice(0, 6).forEach(item => {
        const menuItem = this.createMenuItem(item, 'winxp', true);
        rightPanel.appendChild(menuItem);
      });

      // Add "All Programs" separator
      const separator = document.createElement('div');
      separator.style.height = '1px';
      separator.style.background = '#ccc';
      separator.style.margin = '8px 0';
      rightPanel.appendChild(separator);

      // Add remaining items
      menuItems.slice(6).forEach(item => {
        const menuItem = this.createMenuItem(item, 'winxp');
        rightPanel.appendChild(menuItem);
      });

      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.appendChild(leftPanel);
      wrapper.appendChild(rightPanel);
      el.appendChild(wrapper);
    },

    createWin7StartMenu(el, menuItems) {
      // Search box
      const searchBox = document.createElement('div');
      searchBox.style.padding = '8px 16px';
      searchBox.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      searchBox.innerHTML = '<input type="text" placeholder="Search programs and files" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 3px;">';
      el.appendChild(searchBox);

      // Programs list
      const programsList = document.createElement('div');
      programsList.style.padding = '8px 0';
      programsList.style.maxHeight = '300px';
      programsList.style.overflowY = 'auto';
      
      menuItems.forEach(item => {
        const menuItem = this.createMenuItem(item, 'win7');
        programsList.appendChild(menuItem);
      });

      el.appendChild(programsList);

      // Bottom panel
      const bottomPanel = document.createElement('div');
      bottomPanel.style.borderTop = '1px solid rgba(255,255,255,0.1)';
      bottomPanel.style.padding = '8px 16px';
      bottomPanel.style.background = 'rgba(0,0,0,0.2)';
      bottomPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="color: #fff; cursor: pointer;">👤 User</div>
          <div style="display: flex; gap: 8px;">
            <div style="color: #fff; cursor: pointer; padding: 4px 8px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">⚙️</div>
            <div style="color: #fff; cursor: pointer; padding: 4px 8px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">⏻</div>
          </div>
        </div>
      `;
      el.appendChild(bottomPanel);
    },

    createMenuItem(item, theme, isFrequent = false) {
      const menuItem = document.createElement('div');
      menuItem.style.display = 'flex';
      menuItem.style.alignItems = 'center';
      menuItem.style.padding = theme === 'winxp' ? '6px 12px' : '4px 12px';
      menuItem.style.cursor = item.disabled ? 'default' : 'pointer';
      menuItem.style.fontSize = '11px';
      menuItem.style.position = 'relative';
      
      const hoverColor = {
        'windows95': '#0078d4',
        'windows98': '#0078d4', 
        'win2000': '#316ac5',
        'winxp': '#316ac5',
        'win7': 'rgba(255,255,255,0.1)'
      }[theme] || '#0078d4';

      const textColor = theme === 'win7' ? '#fff' : '#000';
      menuItem.style.color = item.disabled ? '#999' : textColor;
      menuItem.style.opacity = item.disabled ? '0.6' : '1';

      if (theme === 'winxp' && isFrequent) {
        menuItem.style.background = 'rgba(255,255,255,0.5)';
        menuItem.style.borderRadius = '3px';
        menuItem.style.marginBottom = '2px';
      }

      // Icon
      const icon = document.createElement('span');
      icon.textContent = item.icon || '📄';
      icon.style.marginRight = '8px';
      icon.style.fontSize = '14px';
      menuItem.appendChild(icon);

      // Text
      const text = document.createElement('span');
      text.textContent = item.name;
      text.style.flex = '1';
      menuItem.appendChild(text);

      // Arrow for submenus
      if (item.submenu && !item.disabled) {
        const arrow = document.createElement('span');
        arrow.textContent = '▶';
        arrow.style.fontSize = '8px';
        arrow.style.color = textColor;
        arrow.style.opacity = '0.7';
        arrow.style.marginLeft = '4px';
        menuItem.appendChild(arrow);
      }

      // Hover effects (only if not disabled)
      if (!item.disabled) {
        menuItem.onmouseover = () => {
          menuItem.style.background = hoverColor;
          if (theme !== 'win7') menuItem.style.color = '#fff';
          
          // Show submenu if it exists
          if (item.submenu && Array.isArray(item.submenu)) {
            this.showSubmenu(menuItem, item.submenu, theme);
          }
        };
        
        menuItem.onmouseout = (e) => {
          // Only hide if not moving to submenu
          if (!e.relatedTarget || !e.relatedTarget.closest('.submenu')) {
            if (!(theme === 'winxp' && isFrequent)) {
              menuItem.style.background = 'transparent';
            }
            menuItem.style.color = textColor;
            this.hideSubmenu(menuItem);
          }
        };

        // Click handler
        menuItem.onclick = (e) => {
          if (item.submenu && Array.isArray(item.submenu)) {
            e.stopPropagation();
            return; // Don't close menu for submenu items
          }
          
          if (item.app) {
            try {
              console.log('StartMenu: opening app', item.app);
              const inst = window.PluginManager && window.PluginManager.create(item.app);
              if(!inst){ console.warn('StartMenu: plugin instance not returned for', item.app); return; }
              if(typeof inst.open !== 'function'){
                console.warn('StartMenu: plugin instance has no open() for', item.app, inst);
                return;
              }
              inst.open();
            } catch(err){
              console.error('StartMenu: error opening app', item.app, err);
            }
          }
          this.toggle();
        };
      }

      return menuItem;
    },

    showSubmenu(parentItem, submenuItems, theme) {
      // Remove any existing submenu
      this.hideSubmenu(parentItem);
      
      const submenu = document.createElement('div');
      submenu.className = 'submenu';
      submenu.style.position = 'absolute';
      submenu.style.left = '100%';
      submenu.style.top = '0';
      submenu.style.background = theme === 'win7' ? 'rgba(0,0,0,0.9)' : '#f0f0f0';
      submenu.style.border = '1px solid #ccc';
      submenu.style.borderRadius = theme === 'winxp' ? '4px' : '0';
      submenu.style.minWidth = '180px';
      submenu.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.3)';
      submenu.style.zIndex = '1001';
      submenu.style.padding = '2px 0';
      
      submenuItems.forEach(subItem => {
        const subMenuItem = this.createMenuItem(subItem, theme);
        submenu.appendChild(subMenuItem);
      });
      
      // Prevent submenu from closing when hovering over it
      submenu.onmouseover = (e) => {
        e.stopPropagation();
      };
      
      parentItem.appendChild(submenu);
    },

    hideSubmenu(parentItem) {
      const existingSubmenu = parentItem.querySelector('.submenu');
      if (existingSubmenu) {
        existingSubmenu.remove();
      }
    },
    
    createWin8StartScreen(el, menuItems){
      // Full screen start screen
      el.innerHTML = `
        <div style="padding: 60px 40px; color: white; height: 100%; overflow-y: auto;">
          <h1 style="font-weight: 300; font-size: 42px; margin: 0 0 40px 0;">Start</h1>
          <div id="tile-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; max-width: 800px;"></div>
        </div>
      `;
      
      const grid = el.querySelector('#tile-grid');
      
      menuItems.forEach(item => {
        const tile = document.createElement('div');
        
        // Tile sizing based on tileSize property
        const size = item.tileSize || 'medium';
        const dimensions = {
          small: { width: '120px', height: '120px' },
          medium: { width: '250px', height: '120px' },
          wide: { width: '250px', height: '120px' },
          large: { width: '250px', height: '250px' }
        };
        
        tile.style.width = dimensions[size].width;
        tile.style.height = dimensions[size].height;
        tile.style.background = item.color || ['#0078d4', '#00bcf2', '#00b294', '#8764b8', '#881798'][Math.floor(Math.random() * 5)];
        tile.style.color = 'white';
        tile.style.display = 'flex';
        tile.style.flexDirection = 'column';
        tile.style.alignItems = 'flex-start';
        tile.style.justifyContent = 'flex-end';
        tile.style.cursor = 'pointer';
        tile.style.fontSize = '14px';
        tile.style.fontWeight = '300';
        tile.style.padding = '16px';
        tile.style.position = 'relative';
        tile.style.transition = 'transform 0.1s ease';
        
        // Icon
        const icon = document.createElement('div');
        icon.textContent = item.icon;
        icon.style.fontSize = '32px';
        icon.style.position = 'absolute';
        icon.style.top = '16px';
        icon.style.left = '16px';
        tile.appendChild(icon);
        
        // Name
        const name = document.createElement('div');
        name.textContent = item.name;
        name.style.fontWeight = '400';
        tile.appendChild(name);
        
        // Hover effect
        tile.onmouseover = () => tile.style.transform = 'scale(0.95)';
        tile.onmouseout = () => tile.style.transform = 'scale(1)';
        
        // Click handler
          tile.onclick = () => {
            if (item.app) {
              try {
                console.log('StartMenu tile: opening app', tile.app);
                const inst = window.PluginManager && window.PluginManager.create(tile.app);
                if(!inst){ console.warn('StartMenu tile: plugin instance not returned for', tile.app); return; }
                if(typeof inst.open !== 'function'){
                  console.warn('StartMenu tile: plugin instance has no open() for', tile.app, inst);
                  return;
                }
                inst.open();
              } catch(err){
                console.error('StartMenu tile: error opening app', tile.app, err);
              }
            }
            this.toggle();
          };
        
        grid.appendChild(tile);
      });
    },
    
    createModernStartMenu(el, menuItems, theme){
      // Search box
      const searchBox = document.createElement('div');
      searchBox.style.padding = '16px';
      searchBox.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = theme === 'win11' ? 'Search for apps, settings, and documents' : 'Type here to search';
      searchInput.style.width = '100%';
      searchInput.style.padding = '12px';
      searchInput.style.background = theme === 'win11' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)';
      searchInput.style.border = theme === 'win11' ? 'none' : '1px solid rgba(255,255,255,0.2)';
      searchInput.style.color = 'white';
      searchInput.style.borderRadius = theme === 'win11' ? '8px' : '2px';
      searchInput.style.fontSize = '14px';
      searchBox.appendChild(searchInput);
      el.appendChild(searchBox);

      if (theme === 'win11') {
        // Win11: Pinned apps
        this.createWin11Section(el, menuItems.filter(item => item.category === 'pinned'), 'Pinned');
        // Win11: Recommended
        this.createWin11Section(el, menuItems.filter(item => item.category === 'recommended'), 'Recommended');
      } else {
        // Win10: Pinned apps
        this.createWin10Section(el, menuItems.filter(item => item.category === 'pinned'), 'Pinned');
      }

      // Bottom user panel for Win11
      if (theme === 'win11') {
        const userPanel = document.createElement('div');
        userPanel.style.borderTop = '1px solid rgba(255,255,255,0.08)';
        userPanel.style.padding = '12px 16px';
        userPanel.style.display = 'flex';
        userPanel.style.justifyContent = 'space-between';
        userPanel.style.alignItems = 'center';
        
        userPanel.innerHTML = `
          <div style="display: flex; align-items: center; color: #fff;">
            <div style="width: 32px; height: 32px; background: #0078d4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">👤</div>
            <div>User</div>
          </div>
          <div style="color: #fff; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">⏻</div>
        `;
        el.appendChild(userPanel);
      }
    },

    createWin10Section(el, items, title) {
      const section = document.createElement('div');
      section.style.padding = '16px';
      
      const titleEl = document.createElement('div');
      titleEl.style.color = '#ccc';
      titleEl.style.fontSize = '12px';
      titleEl.style.marginBottom = '12px';
      titleEl.style.fontWeight = '600';
      titleEl.textContent = title;
      section.appendChild(titleEl);
      
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      grid.style.gap = '8px';
      
      items.forEach(item => {
        const tile = document.createElement('div');
        tile.style.width = '80px';
        tile.style.height = '80px';
        tile.style.background = 'rgba(255,255,255,0.1)';
        tile.style.borderRadius = '4px';
        tile.style.display = 'flex';
        tile.style.flexDirection = 'column';
        tile.style.alignItems = 'center';
        tile.style.justifyContent = 'center';
        tile.style.cursor = 'pointer';
        tile.style.transition = 'background 0.2s';
        tile.style.padding = '8px';
        
        // Icon
        const icon = document.createElement('div');
        icon.textContent = item.icon;
        icon.style.fontSize = '24px';
        icon.style.marginBottom = '4px';
        tile.appendChild(icon);
        
        // Name
        const name = document.createElement('div');
        name.textContent = item.name;
        name.style.fontSize = '10px';
        name.style.color = 'white';
        name.style.textAlign = 'center';
        name.style.lineHeight = '1.2';
        tile.appendChild(name);
        
        // Hover effect
        tile.onmouseover = () => tile.style.background = 'rgba(255,255,255,0.15)';
        tile.onmouseout = () => tile.style.background = 'rgba(255,255,255,0.1)';
        
        // Click handler
        tile.onclick = () => {
          if (item.app) {
            try {
              const inst = window.PluginManager && window.PluginManager.create(item.app);
              if (inst && inst.open) inst.open();
            } catch (e) {
              console.log('App not available:', item.app);
            }
          }
          this.toggle();
        };
        
        grid.appendChild(tile);
      });
      
      section.appendChild(grid);
      el.appendChild(section);
    },

    createWin11Section(el, items, title) {
      const section = document.createElement('div');
      section.style.padding = '16px';
      
      const titleEl = document.createElement('div');
      titleEl.style.color = '#fff';
      titleEl.style.fontSize = '14px';
      titleEl.style.marginBottom = '12px';
      titleEl.style.fontWeight = '600';
      titleEl.textContent = title;
      section.appendChild(titleEl);
      
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(6, 1fr)';
      grid.style.gap = '8px';
      
      items.forEach(item => {
        const tile = document.createElement('div');
        tile.style.width = '48px';
        tile.style.height = '48px';
        tile.style.background = 'rgba(255,255,255,0.05)';
        tile.style.borderRadius = '8px';
        tile.style.display = 'flex';
        tile.style.alignItems = 'center';
        tile.style.justifyContent = 'center';
        tile.style.cursor = 'pointer';
        tile.style.transition = 'all 0.2s ease';
        tile.style.position = 'relative';
        
        // Icon
        const icon = document.createElement('div');
        icon.textContent = item.icon;
        icon.style.fontSize = '20px';
        tile.appendChild(icon);
        
        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = item.name;
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '-24px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.background = 'rgba(0,0,0,0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '10px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transition = 'opacity 0.2s';
        tile.appendChild(tooltip);
        
        // Hover effects
        tile.onmouseover = () => {
          tile.style.background = 'rgba(255,255,255,0.1)';
          tile.style.transform = 'scale(1.1)';
          tooltip.style.opacity = '1';
        };
        tile.onmouseout = () => {
          tile.style.background = 'rgba(255,255,255,0.05)';
          tile.style.transform = 'scale(1)';
          tooltip.style.opacity = '0';
        };
        
        // Click handler
        tile.onclick = () => {
          if (item.app) {
            try {
              const inst = window.PluginManager && window.PluginManager.create(item.app);
              if (inst && inst.open) inst.open();
            } catch (e) {
              console.log('App not available:', item.app);
            }
          }
          this.toggle();
        };
        
        grid.appendChild(tile);
      });
      
      section.appendChild(grid);
      el.appendChild(section);
    }
  };
  global.StartMenu = StartMenu;
})(window);
