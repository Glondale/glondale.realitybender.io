// Minimal game engine
(function(global){
  const GameEngine = {
    started: false,
    start() {
      if(this.started) return;
      console.log('GameEngine: starting');
      this.started = true;
      EventSystem.emit('engine:start');
      // Load default OS
      contentLoader.loadOSVersion('windows95').then(osEnv=>{
        global.OSManager.initialize(osEnv);
        EventSystem.emit('engine:ready');
      }).catch(err=>{
        console.error('Failed to load OS config',err);
      });
    }
  };
  global.GameEngine = GameEngine;
})(window);
