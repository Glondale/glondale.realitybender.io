// Internet Explorer - Classic web browser
(function(global) {
  class InternetExplorer extends BaseApp {
    constructor() {
      super('iexplore', 'Internet Explorer', '🌐');
      this.currentUrl = 'about:blank';
      this.history = ['about:blank'];
      this.historyIndex = 0;
      this.favorites = [
        { name: 'MSN.com', url: 'http://www.msn.com' },
        { name: 'Windows Update', url: 'http://windowsupdate.microsoft.com' },
        { name: 'Microsoft', url: 'http://www.microsoft.com' }
      ];
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '800px';
      window.style.height = '600px';
      
      const content = window.querySelector('.content');
      content.style.padding = '0';
      content.style.background = '#f0f0f0';
      content.innerHTML = this.getInternetExplorerHTML();
      
      this.setupEventListeners(content);
      this.loadPage(this.currentUrl);
      return window;
    }

    getInternetExplorerHTML() {
      return `
        <div class="internet-explorer">
          <div class="menu-bar">
            <div class="menu-item">File</div>
            <div class="menu-item">Edit</div>
            <div class="menu-item">View</div>
            <div class="menu-item">Favorites</div>
            <div class="menu-item">Tools</div>
            <div class="menu-item">Help</div>
          </div>
          
          <div class="toolbar">
            <div class="nav-buttons">
              <button class="toolbar-btn" id="back-btn">
                <span class="btn-icon">←</span>
                <span class="btn-text">Back</span>
              </button>
              <button class="toolbar-btn" id="forward-btn">
                <span class="btn-icon">→</span>
                <span class="btn-text">Forward</span>
              </button>
              <button class="toolbar-btn" id="stop-btn">
                <span class="btn-icon">⏹</span>
                <span class="btn-text">Stop</span>
              </button>
              <button class="toolbar-btn" id="refresh-btn">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">Refresh</span>
              </button>
              <button class="toolbar-btn" id="home-btn">
                <span class="btn-icon">🏠</span>
                <span class="btn-text">Home</span>
              </button>
            </div>
            
            <div class="address-bar">
              <label>Address:</label>
              <input type="text" id="address-input" value="about:blank">
              <button class="go-btn" id="go-btn">Go</button>
            </div>
          </div>
          
          <div class="main-content">
            <div class="browser-area">
              <iframe id="browser-frame" src="about:blank" style="display: none;"></iframe>
              <div class="page-content" id="page-content">
                <div class="blank-page">
                  <div class="ie-logo">🌐</div>
                  <h1>Internet Explorer</h1>
                  <p>To browse the Web, type a Web address in the Address bar, and then click Go.</p>
                  <div class="quick-links">
                    <h3>Quick Links:</h3>
                    <ul>
                      <li><a href="#" data-url="http://www.msn.com">MSN.com</a></li>
                      <li><a href="#" data-url="http://www.microsoft.com">Microsoft.com</a></li>
                      <li><a href="#" data-url="http://www.windowsupdate.com">Windows Update</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="sidebar" id="sidebar" style="display: none;">
              <div class="sidebar-header">
                <span id="sidebar-title">Search</span>
                <button class="close-sidebar" id="close-sidebar">×</button>
              </div>
              <div class="sidebar-content" id="sidebar-content">
                <div class="search-panel">
                  <input type="text" placeholder="Enter search terms" class="search-input">
                  <button class="search-btn">Search</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="status-bar">
            <div class="status-text" id="status-text">Done</div>
            <div class="progress-area">
              <div class="progress-bar" id="progress-bar" style="display: none;">
                <div class="progress-fill"></div>
              </div>
            </div>
            <div class="zone-info">Internet</div>
          </div>
        </div>

        <style>
          .internet-explorer {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            background: #f0f0f0;
          }

          .menu-bar {
            display: flex;
            background: #f0f0f0;
            border-bottom: 1px solid #c0c0c0;
            padding: 2px 4px;
          }

          .menu-item {
            padding: 4px 8px;
            cursor: pointer;
            font-size: 11px;
          }

          .menu-item:hover {
            background: #e0e0e0;
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

          .nav-buttons {
            display: flex;
            gap: 4px;
          }

          .toolbar-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 4px 6px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            font-size: 10px;
            min-width: 45px;
          }

          .toolbar-btn:hover {
            border: 1px outset #e0e0e0;
            background: #f0f0f0;
          }

          .toolbar-btn:active {
            border: 1px inset #e0e0e0;
          }

          .btn-icon {
            font-size: 16px;
            margin-bottom: 2px;
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
            white-space: nowrap;
          }

          .address-bar input {
            flex: 1;
            padding: 2px 4px;
            border: 2px inset #f0f0f0;
            font-size: 11px;
            background: white;
          }

          .go-btn {
            padding: 2px 8px;
            border: 1px outset #e0e0e0;
            background: #e0e0e0;
            cursor: pointer;
            font-size: 11px;
          }

          .go-btn:hover {
            background: #f0f0f0;
          }

          .main-content {
            flex: 1;
            display: flex;
            min-height: 0;
          }

          .browser-area {
            flex: 1;
            background: white;
            border: 2px inset #f0f0f0;
            margin: 2px;
            position: relative;
          }

          #browser-frame {
            width: 100%;
            height: 100%;
            border: none;
          }

          .page-content {
            width: 100%;
            height: 100%;
            padding: 20px;
            overflow-y: auto;
          }

          .blank-page {
            text-align: center;
            color: #666;
            padding-top: 60px;
          }

          .ie-logo {
            font-size: 64px;
            margin-bottom: 20px;
          }

          .blank-page h1 {
            color: #000080;
            font-size: 24px;
            margin-bottom: 16px;
          }

          .blank-page p {
            font-size: 14px;
            margin-bottom: 30px;
            line-height: 1.4;
          }

          .quick-links {
            text-align: left;
            max-width: 300px;
            margin: 0 auto;
          }

          .quick-links h3 {
            color: #000080;
            font-size: 14px;
            margin-bottom: 10px;
          }

          .quick-links ul {
            list-style: none;
            padding: 0;
          }

          .quick-links li {
            margin-bottom: 8px;
          }

          .quick-links a {
            color: #0000ee;
            text-decoration: underline;
            cursor: pointer;
            font-size: 12px;
          }

          .quick-links a:hover {
            color: #ff0000;
          }

          .sidebar {
            width: 250px;
            background: #f0f0f0;
            border-left: 1px solid #c0c0c0;
            display: flex;
            flex-direction: column;
          }

          .sidebar-header {
            background: linear-gradient(to bottom, #0078d4, #005a9e);
            color: white;
            padding: 4px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
          }

          .close-sidebar {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 14px;
            padding: 0 4px;
          }

          .sidebar-content {
            flex: 1;
            padding: 8px;
          }

          .search-panel {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .search-input {
            padding: 4px;
            border: 2px inset #f0f0f0;
            font-size: 11px;
          }

          .search-btn {
            padding: 4px 8px;
            border: 1px outset #e0e0e0;
            background: #e0e0e0;
            cursor: pointer;
            font-size: 11px;
          }

          .status-bar {
            background: #f0f0f0;
            border-top: 1px solid #c0c0c0;
            padding: 2px 8px;
            display: flex;
            align-items: center;
            font-size: 11px;
            height: 20px;
          }

          .status-text {
            flex: 1;
          }

          .progress-area {
            width: 100px;
            margin: 0 8px;
          }

          .progress-bar {
            height: 16px;
            border: 1px inset #f0f0f0;
            background: white;
            position: relative;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(to right, #0078d4, #005a9e);
            width: 0%;
            transition: width 0.3s ease;
          }

          .zone-info {
            padding: 2px 8px;
            border: 1px inset #f0f0f0;
            font-size: 10px;
          }

          .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #666;
            font-size: 14px;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const backBtn = content.querySelector('#back-btn');
      const forwardBtn = content.querySelector('#forward-btn');
      const stopBtn = content.querySelector('#stop-btn');
      const refreshBtn = content.querySelector('#refresh-btn');
      const homeBtn = content.querySelector('#home-btn');
      const addressInput = content.querySelector('#address-input');
      const goBtn = content.querySelector('#go-btn');
      const quickLinks = content.querySelectorAll('.quick-links a');
      const closeSidebar = content.querySelector('#close-sidebar');

      backBtn.onclick = () => this.navigateBack();
      forwardBtn.onclick = () => this.navigateForward();
      stopBtn.onclick = () => this.stopLoading();
      refreshBtn.onclick = () => this.refreshPage();
      homeBtn.onclick = () => this.goHome();
      goBtn.onclick = () => this.navigate(addressInput.value);

      addressInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          this.navigate(addressInput.value);
        }
      };

      quickLinks.forEach(link => {
        link.onclick = (e) => {
          e.preventDefault();
          const url = link.dataset.url;
          this.navigate(url);
        };
      });

      if (closeSidebar) {
        closeSidebar.onclick = () => this.toggleSidebar(false);
      }

      this.updateNavigationButtons();
    }

    navigate(url) {
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
        url = 'http://' + url;
      }

      this.currentUrl = url;
      this.history.splice(this.historyIndex + 1);
      this.history.push(url);
      this.historyIndex = this.history.length - 1;

      const addressInput = this.window.querySelector('#address-input');
      addressInput.value = url;

      this.loadPage(url);
      this.updateNavigationButtons();
    }

    loadPage(url) {
      const pageContent = this.window.querySelector('#page-content');
      const statusText = this.window.querySelector('#status-text');
      const progressBar = this.window.querySelector('#progress-bar');

      statusText.textContent = 'Loading...';
      progressBar.style.display = 'block';
      
      // Simulate loading
      let progress = 0;
      const progressFill = progressBar.querySelector('.progress-fill');
      const loadInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(loadInterval);
          setTimeout(() => {
            progressBar.style.display = 'none';
            statusText.textContent = 'Done';
          }, 500);
        }
        progressFill.style.width = progress + '%';
      }, 200);

      // Show loading content
      setTimeout(() => {
        pageContent.innerHTML = this.getPageContent(url);
      }, 1000);
    }

    getPageContent(url) {
      if (url === 'about:blank') {
        return `
          <div class="blank-page">
            <div class="ie-logo">🌐</div>
            <h1>Internet Explorer</h1>
            <p>To browse the Web, type a Web address in the Address bar, and then click Go.</p>
            <div class="quick-links">
              <h3>Quick Links:</h3>
              <ul>
                <li><a href="#" data-url="http://www.msn.com">MSN.com</a></li>
                <li><a href="#" data-url="http://www.microsoft.com">Microsoft.com</a></li>
                <li><a href="#" data-url="http://www.windowsupdate.com">Windows Update</a></li>
              </ul>
            </div>
          </div>
        `;
      }

      // Simulate different website content
      if (url.includes('msn.com')) {
        return `
          <div style="padding: 20px;">
            <h1 style="color: #0078d4;">MSN.com</h1>
            <p>Welcome to MSN - your source for news, weather, sports, and entertainment.</p>
            <div style="margin-top: 20px;">
              <h3>Today's Headlines:</h3>
              <ul>
                <li>Technology advances in the new millennium</li>
                <li>Weather forecast for your area</li>
                <li>Sports updates and scores</li>
                <li>Entertainment news and reviews</li>
              </ul>
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              This is a simulated version of MSN.com for demonstration purposes.
            </p>
          </div>
        `;
      }

      if (url.includes('microsoft.com')) {
        return `
          <div style="padding: 20px;">
            <h1 style="color: #000080;">Microsoft Corporation</h1>
            <p>Microsoft is a leading technology company providing software, services, and solutions.</p>
            <div style="margin-top: 20px;">
              <h3>Our Products:</h3>
              <ul>
                <li>Windows Operating System</li>
                <li>Microsoft Office Suite</li>
                <li>Internet Explorer</li>
                <li>Visual Studio Development Tools</li>
              </ul>
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              This is a simulated version of Microsoft.com for demonstration purposes.
            </p>
          </div>
        `;
      }

      // Default content for unknown URLs
      return `
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #ff0000;">Page Not Available</h2>
          <p>Internet Explorer cannot display the webpage.</p>
          <div style="margin-top: 20px;">
            <h4>Most likely causes:</h4>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
              <li>You are not connected to the Internet</li>
              <li>The website is encountering problems</li>
              <li>There might be a typing error in the address</li>
            </ul>
          </div>
          <p style="margin-top: 20px;">
            <strong>What you can try:</strong><br>
            Check your Internet connection and try again.
          </p>
        </div>
      `;
    }

    navigateBack() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentUrl = this.history[this.historyIndex];
        const addressInput = this.window.querySelector('#address-input');
        addressInput.value = this.currentUrl;
        this.loadPage(this.currentUrl);
        this.updateNavigationButtons();
      }
    }

    navigateForward() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.currentUrl = this.history[this.historyIndex];
        const addressInput = this.window.querySelector('#address-input');
        addressInput.value = this.currentUrl;
        this.loadPage(this.currentUrl);
        this.updateNavigationButtons();
      }
    }

    stopLoading() {
      const statusText = this.window.querySelector('#status-text');
      const progressBar = this.window.querySelector('#progress-bar');
      statusText.textContent = 'Stopped';
      progressBar.style.display = 'none';
    }

    refreshPage() {
      this.loadPage(this.currentUrl);
    }

    goHome() {
      this.navigate('about:blank');
    }

    updateNavigationButtons() {
      const backBtn = this.window.querySelector('#back-btn');
      const forwardBtn = this.window.querySelector('#forward-btn');

      backBtn.style.opacity = this.historyIndex > 0 ? '1' : '0.5';
      forwardBtn.style.opacity = this.historyIndex < this.history.length - 1 ? '1' : '0.5';
    }

    toggleSidebar(show) {
      const sidebar = this.window.querySelector('#sidebar');
      sidebar.style.display = show ? 'flex' : 'none';
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('iexplore', InternetExplorer);
  }
})(window);