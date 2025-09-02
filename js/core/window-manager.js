// Very small window manager with draggable chrome and close button
(function(global){
  const root = document.getElementById('desktop-root');
  if(!root) throw new Error('desktop-root not found');
  let z = 10;

  function makeTitleBar(titleText, winEl){
    const title = document.createElement('div');
    title.className = 'title';
    // layout: title text + close button
    const t = document.createElement('div');
    t.className = 'title-text';
    t.textContent = titleText;
    const close = document.createElement('button');
    close.className = 'close-button';
    close.innerHTML = '\u00D7'; // multiplication sign (×)
    close.title = 'Close';
    close.onclick = (e)=>{ e.stopPropagation(); winEl.remove(); };

    title.appendChild(t);
    title.appendChild(close);
    return title;
  }

  const WindowManager = {
    createWindow(title, contentHtml, opts={width:400,height:240,x:50,y:50}){
      const el = document.createElement('div');
      el.className = 'window';
      el.style.left = opts.x+'px';
      el.style.top = opts.y+'px';
      el.style.width = opts.width+'px';
      el.style.height = opts.height+'px';
      el.style.zIndex = ++z;

      // title bar with close
      const titleBar = makeTitleBar(title, el);
      const content = document.createElement('div');
      content.className = 'content';
      content.innerHTML = contentHtml;

      el.appendChild(titleBar);
      el.appendChild(content);
      root.appendChild(el);

      // Bring to front on mousedown
      el.addEventListener('mousedown', ()=>{ el.style.zIndex = ++z; });

      // Dragging
      let dragging = false;
      let offsetX = 0, offsetY = 0;

      const onMouseMove = (e)=>{
        if(!dragging) return;
        el.style.left = (e.clientX - offsetX) + 'px';
        el.style.top = (e.clientY - offsetY) + 'px';
      };
      const onMouseUp = ()=>{ dragging = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };

      titleBar.addEventListener('mousedown', (e)=>{
        // don't start drag if clicked the close button
        if(e.target && e.target.classList && e.target.classList.contains('close-button')) return;
        dragging = true;
        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      });

      return el;
    }
  };
  global.WindowManager = WindowManager;
})(window);
