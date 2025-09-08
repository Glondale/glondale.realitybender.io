// Enhanced virtual filesystem with progressive unlocking
(function(global){
  const mapPathToUrl = (path)=>{
    // Handle multiple drives: C:/, D:/, E:/, Z:/, QUANTUM:/, NEURAL:/
    let drive, relativePath;
    
    if (path.match(/^[A-Z]+:\\?/i)) {
      const match = path.match(/^([A-Z]+):\\?(.*)/i);
      drive = match[1].toLowerCase();
      relativePath = match[2].replace(/^[\\\/]/, '');
    } else {
      drive = 'c';
      relativePath = path.replace(/^[\\\/]/, '');
    }
    
    const driveMap = {
      'c': 'c-drive',
      'd': 'd-drive', 
      'e': 'e-drive',
      'z': 'network-drive',
      'quantum': 'quantum-drive',
      'neural': 'neural-drive'
    };
    
    const driveFolder = driveMap[drive] || 'c-drive';
    return `data/virtual-files/${driveFolder}/${relativePath}`;
  };

  const FileSystem = {
    currentOS: 'windows95',
    
    setCurrentOS(osVersion) {
      this.currentOS = osVersion;
      console.log('FileSystem: OS version set to', osVersion);
    },
    
    async getOSConfig() {
      if (!this.currentOS) return {};
      try {
        const res = await fetch(`config/os/${this.currentOS}.json`);
        if (!res.ok) return {};
        return await res.json();
      } catch (e) {
        console.warn('Failed to load OS config:', e);
        return {};
      }
    },
    
    async isAccessible(path) {
      const config = await this.getOSConfig();
      const unlocks = config.unlocks || {};
      
      // Check drive access
      if (path.match(/^D:\\?/i) && !unlocks.drives?.includes('D:\\')) {
        return false;
      }
      if (path.match(/^E:\\?/i) && !unlocks.drives?.includes('E:\\')) {
        return false;
      }
      if (path.match(/^Z:\\?/i) && !unlocks.drives?.includes('Z:\\')) {
        return false;
      }
      if (path.match(/^QUANTUM:\\?/i) && !unlocks.drives?.includes('QUANTUM:\\')) {
        return false;
      }
      if (path.match(/^NEURAL:\\?/i) && !unlocks.drives?.includes('NEURAL:\\')) {
        return false;
      }
      
      // Check file type restrictions
      if (path.includes('ENCRYPTED') && this.currentOS === 'windows95') {
        return false;
      }
      if (path.includes('TEMPORAL') && config.restrictions?.temporal_files) {
        return false;
      }
      if (path.includes('QUANTUM') && config.restrictions?.quantum_encryption) {
        return false;
      }
      
      return true;
    },
    
    async listDirectory(path = 'C:/') {
      try {
        const accessible = await this.isAccessible(path);
        if (!accessible) {
          throw new Error('Access denied - requires OS upgrade');
        }
        
        // For now, return a simple directory listing
        // This would be enhanced with actual directory scanning
        const config = await this.getOSConfig();
        const baseFiles = ['README.txt', 'NOTE.txt'];
        
        // Add files based on OS capabilities
        if (config.unlocks?.hidden_files) {
          baseFiles.push('SYSTEM.LOG', 'TEMP_DATA.tmp');
        }
        if (config.unlocks?.future_executables === 'partial') {
          baseFiles.push('LEGACY_COMPAT.exe');
        }
        if (config.unlocks?.temporal_cache === 'full') {
          baseFiles.push('TEMPORAL_CACHE/', 'PROJECT_CHRONOS/');
        }
        
        return baseFiles;
      } catch (e) {
        console.warn('FileSystem.listDirectory failed', path, e);
        throw e;
      }
    },
    
    async readFile(path){
      try{
        const accessible = await this.isAccessible(path);
        if (!accessible) {
          throw new Error('Access denied - file requires higher OS version');
        }
        
        const url = mapPathToUrl(path);
        const res = await fetch(url);
        if(!res.ok) throw new Error('File not found');
        
        let text = await res.text();
        
        // Apply OS-specific filtering/corruption
        const config = await this.getOSConfig();
        if (config.glitches?.future_apps === 'glitched' && path.includes('.exe')) {
          text = text.replace(/\w/g, (c, i) => i % 7 === 0 ? '█' : c);
        }
        
        return text;
      }catch(e){
        console.warn('FileSystem.readFile failed',path,e);
        throw e;
      }
    },
    
    async fileExists(path) {
      try {
        const accessible = await this.isAccessible(path);
        if (!accessible) return false;
        
        const url = mapPathToUrl(path);
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
      } catch (e) {
        return false;
      }
    }
  };

  global.FileSystem = FileSystem;
  
  // Listen for OS changes
  if (global.EventSystem) {
    EventSystem.on('os:initialized', (env) => {
      FileSystem.setCurrentOS(env.version || 'windows95');
    });
    
    EventSystem.on('os:upgrade:complete', (env) => {
      FileSystem.setCurrentOS(env.version);
    });
  }
})(window);
