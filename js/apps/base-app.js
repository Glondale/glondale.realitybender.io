// Base app class
(function(global){
  class BaseApp {
    constructor(config){ this.id = config.id; this.name = config.name; }
    async initialize(){ }
    async open(){ }
    async close(){ }
  }
  global.BaseApp = BaseApp;
})(window);
