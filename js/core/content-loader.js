// Load JSON config for OS versions and provide simple environment object
(function(global){
  const contentLoader = {
    async loadOSVersion(version){
      const url = `config/os/${version}.json`;
      const res = await fetch(url);
      if(!res.ok) throw new Error('OS config not found: '+url);
      const cfg = await res.json();
      return Object.assign({version}, cfg);
    }
  };
  global.contentLoader = contentLoader;
})(window);
