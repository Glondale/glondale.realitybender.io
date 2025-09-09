// Base app class for modern Windows applications
(function(global){
  class BaseApp {
    constructor(id, name, icon) { 
      this.id = id; 
      this.name = name; 
      this.icon = icon;
      this.window = null;
    }

    // Create and return a window element
    createWindow() {
      if (this.window) {
        // If window already exists, bring it to front
        this.window.style.zIndex = ++global.windowZIndex || 1000;
        return this.window;
      }

      // Create window using WindowManager
      this.window = global.WindowManager.createWindow(
        this.name,
        '<div class="content"></div>',
        { width: 400, height: 300, x: 100, y: 100 }
      );

      // Store reference to this app instance in the window
      this.window._appInstance = this;

      // Set up close handler
      const closeBtn = this.window.querySelector('.close-btn');
      if (closeBtn) {
        const originalClose = closeBtn.onclick;
        closeBtn.onclick = () => {
          this.onClose();
          if (originalClose) originalClose();
        };
      }

      return this.window;
    }

    // Open the application (called by start menu)
    open() {
      if (!this.window) {
        this.createWindow();
      } else {
        // Bring existing window to front
        this.window.style.zIndex = ++global.windowZIndex || 1000;
      }
      return this;
    }

    // Close handler
    onClose() {
      this.window = null;
    }

    // Legacy methods for compatibility
    async initialize(){ }
    async close(){ this.onClose(); }
  }

  // Ensure window z-index tracking
  if (!global.windowZIndex) {
    global.windowZIndex = 1000;
  }

  global.BaseApp = BaseApp;
})(window);
