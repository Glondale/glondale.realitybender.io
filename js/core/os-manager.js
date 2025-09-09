// Simple OS manager
(function(global){
  const OSManager = {
    currentVersion: null,
    env: null,
    initialize(osEnv){
      this.env = osEnv;
      this.currentVersion = osEnv.version || 'windows95';
      console.log('OSManager: initialized', this.currentVersion);
      // Load appropriate theme
      const themeName = (osEnv && osEnv.ui && osEnv.ui.theme) || this.currentVersion;
      if(global.loadTheme) global.loadTheme(themeName);
      EventSystem.emit('os:initialized', this.env);
      // render desktop
      if(global.UIManager && global.UIManager.renderDesktop) global.UIManager.renderDesktop(this.env);
    },
    upgrade(newVersion){
      console.log('OSManager: upgrading to', newVersion);
      EventSystem.emit('os:upgrade:start', {from:this.currentVersion, to:newVersion});
      contentLoader.loadOSVersion(newVersion).then(osEnv=>{
        this.env = osEnv;
        this.currentVersion = newVersion;
        // Load new theme
        const themeName = (osEnv && osEnv.ui && osEnv.ui.theme) || newVersion;
        if(global.loadTheme) global.loadTheme(themeName);
        EventSystem.emit('os:upgrade:complete', this.env);
        if(global.UIManager && global.UIManager.upgradeInterface) global.UIManager.upgradeInterface(this.currentVersion, newVersion);
      });
    }
  };
  global.OSManager = OSManager;
})(window);
