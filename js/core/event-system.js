// Simple event bus
(function(global){
  const listeners = {};
  const EventSystem = {
    on(event, cb) { (listeners[event] = listeners[event] || []).push(cb); },
    off(event, cb) { if(!listeners[event]) return; listeners[event] = listeners[event].filter(f=>f!==cb); },
    emit(event, payload){ (listeners[event]||[]).slice().forEach(cb=>{ try{ cb(payload); }catch(e){ console.error('Event handler error',e);} }); }
  };
  global.EventSystem = EventSystem;
})(window);
