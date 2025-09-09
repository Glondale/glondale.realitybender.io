// Minimal plugin registry
(function(global){
  const plugins = {};
  const PluginManager = {
    register(id, factory){
      plugins[id]=factory;
      try{ console.log('Plugin registered',id); }catch(e){}
    },
    create(id, opts){
      try{
        console.log('PluginManager.create requested id=', id, 'registered=', Object.keys(plugins));
        const f = plugins[id];
        if(!f){ console.warn('PluginManager: no plugin factory for', id); return null; }

        // First try to call as a factory function
        try{
          const result = f(opts);
          console.log('PluginManager: created instance for', id, 'via factory ->', result && result.id ? result.id : typeof result);
          return result;
        }catch(callErr){
          // If calling failed, attempt to treat f as a constructor (class)
          console.warn('PluginManager: factory call failed for', id, 'trying constructor fallback', callErr);
          try{
            const inst = new f(opts);
            console.log('PluginManager: created instance for', id, 'via constructor ->', inst && inst.id ? inst.id : typeof inst);
            return inst;
          }catch(ctorErr){
            console.error('PluginManager: constructor fallback failed for', id, ctorErr);
            return null;
          }
        }
      }catch(err){
        console.error('PluginManager.create error for', id, err);
        return null;
      }
    }
  };
  // helper: return list of registered plugin ids (safe for debug/UI)
  PluginManager.list = function(){
    try{ return Object.keys(plugins); }catch(e){ return []; }
  };
  global.PluginManager = PluginManager;
})(window);
