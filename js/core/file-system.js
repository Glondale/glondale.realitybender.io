// Minimal virtual filesystem that maps simple C:/ paths to data files
(function(global){
  const mapPathToUrl = (path)=>{
    // example: C:/README.txt -> data/virtual-files/c-drive/README.txt
    const p = path.replace(/^C:\\?/i,'').replace(/^[\\\/]/,'');
    return `data/virtual-files/c-drive/${p}`;
  };

  const FileSystem = {
    async readFile(path){
      try{
        const url = mapPathToUrl(path);
        const res = await fetch(url);
        if(!res.ok) throw new Error('Not found');
        const text = await res.text();
        return text;
      }catch(e){
        console.warn('FileSystem.readFile failed',path,e);
        throw e;
      }
    }
  };

  global.FileSystem = FileSystem;
})(window);
