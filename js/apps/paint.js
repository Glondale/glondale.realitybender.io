// Windows Paint App - Drawing application
(function(global) {
  class Paint extends BaseApp {
    constructor() {
      super('paint', 'Paint', '🎨');
      this.isDrawing = false;
      this.tool = 'brush';
      this.color = '#000000';
      this.brushSize = 2;
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '640px';
      window.style.height = '480px';
      
      const content = window.querySelector('.content');
      content.style.padding = '0';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.innerHTML = this.getPaintHTML();
      
      this.setupEventListeners(content);
      return window;
    }

    getPaintHTML() {
      return `
        <div class="paint-app">
          <div class="toolbar">
            <div class="tool-group">
              <button class="tool-btn active" data-tool="brush" title="Brush">🖌️</button>
              <button class="tool-btn" data-tool="pencil" title="Pencil">✏️</button>
              <button class="tool-btn" data-tool="eraser" title="Eraser">🧽</button>
              <button class="tool-btn" data-tool="bucket" title="Fill">🪣</button>
              <button class="tool-btn" data-tool="eyedropper" title="Color Picker">💉</button>
            </div>
            
            <div class="tool-group">
              <button class="tool-btn" data-tool="line" title="Line">📏</button>
              <button class="tool-btn" data-tool="rectangle" title="Rectangle">▭</button>
              <button class="tool-btn" data-tool="circle" title="Circle">⭕</button>
              <button class="tool-btn" data-tool="text" title="Text">T</button>
            </div>
            
            <div class="color-group">
              <div class="color-display">
                <div class="current-color" style="background: ${this.color}"></div>
              </div>
              <div class="color-palette">
                <div class="color-btn" style="background: #000000" data-color="#000000"></div>
                <div class="color-btn" style="background: #ffffff" data-color="#ffffff"></div>
                <div class="color-btn" style="background: #ff0000" data-color="#ff0000"></div>
                <div class="color-btn" style="background: #00ff00" data-color="#00ff00"></div>
                <div class="color-btn" style="background: #0000ff" data-color="#0000ff"></div>
                <div class="color-btn" style="background: #ffff00" data-color="#ffff00"></div>
                <div class="color-btn" style="background: #ff00ff" data-color="#ff00ff"></div>
                <div class="color-btn" style="background: #00ffff" data-color="#00ffff"></div>
              </div>
            </div>
            
            <div class="brush-size">
              <label>Size: </label>
              <input type="range" min="1" max="20" value="${this.brushSize}" class="size-slider">
              <span class="size-display">${this.brushSize}</span>
            </div>
            
            <div class="action-group">
              <button class="action-btn" data-action="clear">Clear</button>
              <button class="action-btn" data-action="undo">Undo</button>
            </div>
          </div>
          
          <div class="canvas-container">
            <canvas class="paint-canvas" width="620" height="400"></canvas>
          </div>
        </div>

        <style>
          .paint-app {
            display: flex;
            flex-direction: column;
            height: 100%;
            font-family: 'MS Sans Serif', Arial, sans-serif;
          }
          
          .toolbar {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            background: #f0f0f0;
            border-bottom: 2px inset #f0f0f0;
            flex-wrap: wrap;
          }
          
          .tool-group, .color-group, .action-group, .brush-size {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px;
            border: 1px solid #c0c0c0;
            background: #e0e0e0;
          }
          
          .tool-btn, .action-btn {
            width: 32px;
            height: 32px;
            border: 2px outset #f0f0f0;
            background: #f0f0f0;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .tool-btn:hover, .action-btn:hover {
            background: #e0e0e0;
          }
          
          .tool-btn.active {
            border: 2px inset #f0f0f0;
            background: #d0d0d0;
          }
          
          .color-display {
            width: 32px;
            height: 32px;
            border: 2px inset #f0f0f0;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .current-color {
            width: 24px;
            height: 24px;
            border: 1px solid #000;
          }
          
          .color-palette {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
          }
          
          .color-btn {
            width: 20px;
            height: 20px;
            border: 2px outset #f0f0f0;
            cursor: pointer;
          }
          
          .color-btn:hover {
            border: 2px inset #f0f0f0;
          }
          
          .size-slider {
            width: 60px;
          }
          
          .size-display {
            min-width: 20px;
            text-align: center;
            font-size: 11px;
          }
          
          .canvas-container {
            flex: 1;
            padding: 8px;
            background: #c0c0c0;
            overflow: auto;
          }
          
          .paint-canvas {
            background: white;
            border: 2px inset #c0c0c0;
            cursor: crosshair;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const canvas = content.querySelector('.paint-canvas');
      const ctx = canvas.getContext('2d');
      const toolButtons = content.querySelectorAll('.tool-btn');
      const colorButtons = content.querySelectorAll('.color-btn');
      const actionButtons = content.querySelectorAll('.action-btn');
      const sizeSlider = content.querySelector('.size-slider');
      const sizeDisplay = content.querySelector('.size-display');
      const currentColorDisplay = content.querySelector('.current-color');
      
      this.canvas = canvas;
      this.ctx = ctx;
      this.undoStack = [];
      
      // Set initial canvas state
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.brushSize;
      
      // Save initial state
      this.saveState();

      // Tool selection
      toolButtons.forEach(btn => {
        btn.onclick = () => {
          toolButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.tool = btn.dataset.tool;
          this.updateCursor();
        };
      });

      // Color selection
      colorButtons.forEach(btn => {
        btn.onclick = () => {
          this.color = btn.dataset.color;
          currentColorDisplay.style.background = this.color;
          ctx.strokeStyle = this.color;
          ctx.fillStyle = this.color;
        };
      });

      // Brush size
      sizeSlider.oninput = () => {
        this.brushSize = parseInt(sizeSlider.value);
        sizeDisplay.textContent = this.brushSize;
        ctx.lineWidth = this.brushSize;
      };

      // Actions
      actionButtons.forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.action === 'clear') {
            this.clearCanvas();
          } else if (btn.dataset.action === 'undo') {
            this.undo();
          }
        };
      });

      // Canvas drawing events
      canvas.onmousedown = (e) => this.startDrawing(e);
      canvas.onmousemove = (e) => this.draw(e);
      canvas.onmouseup = () => this.stopDrawing();
      canvas.onmouseleave = () => this.stopDrawing();
    }

    startDrawing(e) {
      this.isDrawing = true;
      const rect = this.canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;

      if (this.tool === 'brush' || this.tool === 'pencil' || this.tool === 'eraser') {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
      }
    }

    draw(e) {
      if (!this.isDrawing) return;

      const rect = this.canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      switch (this.tool) {
        case 'brush':
        case 'pencil':
          this.ctx.globalCompositeOperation = 'source-over';
          this.ctx.lineTo(currentX, currentY);
          this.ctx.stroke();
          break;

        case 'eraser':
          this.ctx.globalCompositeOperation = 'destination-out';
          this.ctx.lineTo(currentX, currentY);
          this.ctx.stroke();
          break;
      }
    }

    stopDrawing() {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.ctx.globalCompositeOperation = 'source-over';
        this.saveState();
      }
    }

    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.saveState();
    }

    saveState() {
      if (this.undoStack.length > 10) {
        this.undoStack.shift();
      }
      this.undoStack.push(this.canvas.toDataURL());
    }

    undo() {
      if (this.undoStack.length > 1) {
        this.undoStack.pop(); // Remove current state
        const previousState = this.undoStack[this.undoStack.length - 1];
        const img = new Image();
        img.onload = () => {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0);
        };
        img.src = previousState;
      }
    }

    updateCursor() {
      const cursors = {
        brush: 'crosshair',
        pencil: 'crosshair',
        eraser: 'crosshair',
        bucket: 'pointer',
        eyedropper: 'pointer',
        line: 'crosshair',
        rectangle: 'crosshair',
        circle: 'crosshair',
        text: 'text'
      };
      this.canvas.style.cursor = cursors[this.tool] || 'default';
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('paint', Paint);
  }
})(window);