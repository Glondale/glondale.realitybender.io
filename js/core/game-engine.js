// Minimal game engine
(function(global){
  const GameEngine = {
    started: false,
    start() {
      if(this.started) return;
      this.started = true;

      // pick configured osVersion or default to windows95
      const osVersion = (this.config && this.config.osVersion) ? this.config.osVersion : 'windows95';
      console.log('GameEngine: starting, osVersion=', osVersion);

  contentLoader.loadOSVersion(osVersion).then(cfg=>{
        try{
          OSManager.initialize(cfg);
        }catch(initErr){
          console.error('GameEngine: OSManager.initialize failed', initErr);
        }

        // --- Debug smoke-test: attempt to create key plugins after OS init ---
        try{
          console.log('SmokeTest: attempting to create explorer/email plugins');
          const ex = window.PluginManager && window.PluginManager.create('explorer');
          console.log('SmokeTest: explorer create ->', ex);
          if(ex && typeof ex.open === 'function'){
            console.log('SmokeTest: explorer.open available');
          }
          const em = window.PluginManager && window.PluginManager.create('email');
          console.log('SmokeTest: email create ->', em);
        }catch(err){
          console.error('SmokeTest error', err);
        }
        // --- end smoke-test ---

        EventSystem.emit('engine:ready');
      }).catch(err=>{
        console.error('Failed to load OS config',err);
      });
    }
  };
  global.GameEngine = GameEngine;
})(window);
