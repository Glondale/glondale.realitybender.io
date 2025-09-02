// Very small window manager
(function(global){
  const root = document.getElementById('desktop-root');
  let z = 10;
  const WindowManager = {
    createWindow(title, contentHtml, opts={width:400,height:240,x:50,y:50}){
      const el = document.createElement('div');
      el.className = 'window';
      el.style.left = opts.x+'px'; el.style.top = opts.y+'px'; el.style.width = opts.width+'px'; el.style.height = opts.height+'px';
      el.style.zIndex = ++z;
      el.innerHTML = `<div class="title">${title}</div><div class="content">${contentHtml}</div>`;
      root.appendChild(el);
      return el;
    }
  };
  global.WindowManager = WindowManager;
})(window);
