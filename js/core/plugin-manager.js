// Minimal plugin registry
(function(global){
  const plugins = {};
  const PluginManager = {
    register(id, factory){ plugins[id]=factory; console.log('Plugin registered',id); },
    create(id, opts){ const f = plugins[id]; return f?f(opts):null; }
  };
  global.PluginManager = PluginManager;
})(window);
