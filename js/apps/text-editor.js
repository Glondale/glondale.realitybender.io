// Enhanced Text Editor - Works as both Notepad and WordPad
(function(global) {
  class TextEditor extends BaseApp {
    constructor(appId = 'notepad', title = 'Notepad', icon = '📝', isWordPad = false) {
      super(appId, title, icon);
      this.isWordPad = isWordPad;
      this.fileName = 'Untitled';
      this.isModified = false;
      this.content = '';
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '600px';
      window.style.height = '400px';
      
      const content = window.querySelector('.content');
      content.style.padding = '0';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.innerHTML = this.getEditorHTML();
      
      this.setupEventListeners(content);
      this.updateTitle();
      return window;
    }

    getEditorHTML() {
      const toolbarHTML = this.isWordPad ? `
        <div class="formatting-toolbar">
          <div class="toolbar-group">
            <button class="format-btn" data-action="bold" title="Bold"><b>B</b></button>
            <button class="format-btn" data-action="italic" title="Italic"><i>I</i></button>
            <button class="format-btn" data-action="underline" title="Underline"><u>U</u></button>
          </div>
          <div class="toolbar-group">
            <select class="font-family">
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
              <option>MS Sans Serif</option>
            </select>
            <select class="font-size">
              <option>8</option>
              <option>10</option>
              <option>12</option>
              <option>14</option>
              <option>16</option>
              <option>18</option>
              <option>24</option>
            </select>
          </div>
          <div class="toolbar-group">
            <button class="format-btn" data-action="justifyLeft" title="Align Left">⬅️</button>
            <button class="format-btn" data-action="justifyCenter" title="Center">↔️</button>
            <button class="format-btn" data-action="justifyRight" title="Align Right">➡️</button>
          </div>
        </div>
      ` : '';

      return `
        <div class="text-editor">
          <div class="menu-bar">
            <div class="menu-item" data-menu="file">File</div>
            <div class="menu-item" data-menu="edit">Edit</div>
            ${this.isWordPad ? '<div class="menu-item" data-menu="format">Format</div>' : ''}
            <div class="menu-item" data-menu="view">View</div>
            <div class="menu-item" data-menu="help">Help</div>
          </div>

          ${toolbarHTML}

          <div class="editor-area">
            ${this.isWordPad ? 
              '<div class="rich-editor" contenteditable="true" spellcheck="false"></div>' :
              '<textarea class="plain-editor" spellcheck="false"></textarea>'
            }
          </div>

          <div class="status-bar">
            <div class="status-info">
              <span id="char-count">Characters: 0</span>
              <span class="separator">|</span>
              <span id="line-info">Line: 1, Column: 1</span>
            </div>
            <div class="status-right">
              <span id="mode-info">${this.isWordPad ? 'Rich Text' : 'Plain Text'}</span>
            </div>
          </div>

          <!-- Dropdown menus -->
          <div class="menu-dropdown hidden" id="file-menu">
            <div class="menu-option" data-action="new">New</div>
            <div class="menu-option" data-action="open">Open...</div>
            <div class="menu-option" data-action="save">Save</div>
            <div class="menu-option" data-action="save-as">Save As...</div>
            <div class="menu-separator"></div>
            <div class="menu-option" data-action="print">Print...</div>
            <div class="menu-separator"></div>
            <div class="menu-option" data-action="exit">Exit</div>
          </div>

          <div class="menu-dropdown hidden" id="edit-menu">
            <div class="menu-option" data-action="undo">Undo</div>
            <div class="menu-option" data-action="redo">Redo</div>
            <div class="menu-separator"></div>
            <div class="menu-option" data-action="cut">Cut</div>
            <div class="menu-option" data-action="copy">Copy</div>
            <div class="menu-option" data-action="paste">Paste</div>
            <div class="menu-option" data-action="select-all">Select All</div>
            <div class="menu-separator"></div>
            <div class="menu-option" data-action="find">Find...</div>
            <div class="menu-option" data-action="replace">Replace...</div>
          </div>
        </div>

        <style>
          .text-editor {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'MS Sans Serif', Arial, sans-serif;
          }

          .menu-bar {
            display: flex;
            background: #f0f0f0;
            border-bottom: 1px solid #c0c0c0;
            padding: 2px;
          }

          .menu-item {
            padding: 4px 8px;
            cursor: pointer;
            position: relative;
          }

          .menu-item:hover {
            background: #e0e0e0;
          }

          .menu-item.active {
            background: #0078d4;
            color: white;
          }

          .formatting-toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px;
            background: #f0f0f0;
            border-bottom: 1px solid #c0c0c0;
          }

          .toolbar-group {
            display: flex;
            gap: 2px;
            align-items: center;
          }

          .format-btn {
            width: 24px;
            height: 24px;
            border: 1px solid transparent;
            background: #f0f0f0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }

          .format-btn:hover {
            border: 1px outset #f0f0f0;
          }

          .format-btn.active {
            border: 1px inset #f0f0f0;
            background: #d0d0d0;
          }

          .font-family, .font-size {
            padding: 2px;
            border: 1px inset #f0f0f0;
            background: white;
            font-size: 11px;
          }

          .font-size {
            width: 50px;
          }

          .editor-area {
            flex: 1;
            position: relative;
          }

          .plain-editor {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 8px;
            resize: none;
            background: white;
          }

          .rich-editor {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            font-family: Arial, sans-serif;
            font-size: 12px;
            padding: 8px;
            background: white;
            overflow-y: auto;
          }

          .status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2px 8px;
            background: #f0f0f0;
            border-top: 1px solid #c0c0c0;
            font-size: 10px;
          }

          .status-info {
            display: flex;
            gap: 8px;
          }

          .separator {
            color: #c0c0c0;
          }

          .menu-dropdown {
            position: absolute;
            top: 24px;
            background: #f0f0f0;
            border: 2px outset #f0f0f0;
            z-index: 1000;
            min-width: 120px;
            box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .menu-option {
            padding: 4px 16px;
            cursor: pointer;
            font-size: 11px;
          }

          .menu-option:hover {
            background: #0078d4;
            color: white;
          }

          .menu-separator {
            height: 1px;
            background: #c0c0c0;
            margin: 2px 0;
          }

          .hidden {
            display: none;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const editor = content.querySelector(this.isWordPad ? '.rich-editor' : '.plain-editor');
      const menuItems = content.querySelectorAll('.menu-item');
      const menuOptions = content.querySelectorAll('.menu-option');

      // Menu bar
      menuItems.forEach(item => {
        item.onclick = () => this.toggleMenu(item.dataset.menu);
      });

      // Menu options
      menuOptions.forEach(option => {
        option.onclick = () => {
          this.executeAction(option.dataset.action);
          this.hideAllMenus();
        };
      });

      // Editor events
      editor.oninput = () => {
        this.content = this.isWordPad ? editor.innerHTML : editor.value;
        this.isModified = true;
        this.updateTitle();
        this.updateStatusBar();
      };

      editor.onkeyup = () => this.updateStatusBar();
      editor.onclick = () => this.updateStatusBar();

      // Formatting buttons (WordPad only)
      if (this.isWordPad) {
        const formatBtns = content.querySelectorAll('.format-btn');
        formatBtns.forEach(btn => {
          btn.onclick = () => {
            document.execCommand(btn.dataset.action, false, null);
            this.updateFormatButtons();
          };
        });

        const fontFamily = content.querySelector('.font-family');
        const fontSize = content.querySelector('.font-size');

        if (fontFamily) {
          fontFamily.onchange = () => {
            document.execCommand('fontName', false, fontFamily.value);
          };
        }

        if (fontSize) {
          fontSize.onchange = () => {
            document.execCommand('fontSize', false, fontSize.value);
          };
        }
      }

      // Click outside to close menus
      document.onclick = (e) => {
        if (!e.target.closest('.menu-item')) {
          this.hideAllMenus();
        }
      };

      this.editor = editor;
    }

    toggleMenu(menuType) {
      this.hideAllMenus();
      const menu = this.window.querySelector(`#${menuType}-menu`);
      if (menu) {
        menu.classList.remove('hidden');
        
        // Position menu
        const menuItem = this.window.querySelector(`[data-menu="${menuType}"]`);
        const rect = menuItem.getBoundingClientRect();
        menu.style.left = '0px';
        menu.style.top = '24px';
      }
    }

    hideAllMenus() {
      const menus = this.window.querySelectorAll('.menu-dropdown');
      menus.forEach(menu => menu.classList.add('hidden'));
    }

    executeAction(action) {
      switch (action) {
        case 'new':
          if (this.isModified && !confirm('Discard changes?')) return;
          this.newDocument();
          break;
        case 'open':
          this.openDocument();
          break;
        case 'save':
          this.saveDocument();
          break;
        case 'save-as':
          this.saveAsDocument();
          break;
        case 'print':
          this.printDocument();
          break;
        case 'exit':
          this.close();
          break;
        case 'undo':
          document.execCommand('undo');
          break;
        case 'redo':
          document.execCommand('redo');
          break;
        case 'cut':
          document.execCommand('cut');
          break;
        case 'copy':
          document.execCommand('copy');
          break;
        case 'paste':
          document.execCommand('paste');
          break;
        case 'select-all':
          document.execCommand('selectAll');
          break;
        case 'find':
          this.showFindDialog();
          break;
        case 'replace':
          this.showReplaceDialog();
          break;
      }
    }

    newDocument() {
      this.editor.value = '';
      if (this.isWordPad) this.editor.innerHTML = '';
      this.content = '';
      this.fileName = 'Untitled';
      this.isModified = false;
      this.updateTitle();
      this.updateStatusBar();
    }

    openDocument() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = this.isWordPad ? '.rtf,.html,.txt' : '.txt';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target.result;
            if (this.isWordPad) {
              this.editor.innerHTML = content.includes('<') ? content : content.replace(/\n/g, '<br>');
            } else {
              this.editor.value = content;
            }
            this.fileName = file.name;
            this.isModified = false;
            this.updateTitle();
            this.updateStatusBar();
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }

    saveDocument() {
      const content = this.isWordPad ? this.editor.innerHTML : this.editor.value;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName.includes('.') ? this.fileName : this.fileName + '.txt';
      a.click();
      URL.revokeObjectURL(url);
      this.isModified = false;
      this.updateTitle();
    }

    saveAsDocument() {
      const newName = prompt('Save as:', this.fileName);
      if (newName) {
        this.fileName = newName;
        this.saveDocument();
      }
    }

    printDocument() {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>Print - ${this.fileName}</title></head>
          <body style="font-family: ${this.isWordPad ? 'Arial' : 'Courier New'}; font-size: 12px;">
            ${this.isWordPad ? this.editor.innerHTML : '<pre>' + this.editor.value + '</pre>'}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    showFindDialog() {
      const searchText = prompt('Find:');
      if (searchText) {
        // Simple find implementation
        const content = this.isWordPad ? this.editor.innerHTML : this.editor.value;
        if (content.includes(searchText)) {
          alert(`Found "${searchText}"`);
        } else {
          alert(`Cannot find "${searchText}"`);
        }
      }
    }

    showReplaceDialog() {
      const searchText = prompt('Find:');
      if (searchText) {
        const replaceText = prompt('Replace with:');
        if (replaceText !== null) {
          if (this.isWordPad) {
            this.editor.innerHTML = this.editor.innerHTML.replace(new RegExp(searchText, 'g'), replaceText);
          } else {
            this.editor.value = this.editor.value.replace(new RegExp(searchText, 'g'), replaceText);
          }
          this.isModified = true;
          this.updateTitle();
        }
      }
    }

    updateTitle() {
      const titleElement = this.window.querySelector('.title-text');
      const modifiedIndicator = this.isModified ? '*' : '';
      titleElement.textContent = `${this.fileName}${modifiedIndicator} - ${this.title}`;
    }

    updateStatusBar() {
      const charCount = this.window.querySelector('#char-count');
      const lineInfo = this.window.querySelector('#line-info');
      
      const content = this.isWordPad ? this.editor.textContent : this.editor.value;
      const chars = content.length;
      
      if (charCount) charCount.textContent = `Characters: ${chars}`;
      
      if (!this.isWordPad && lineInfo) {
        const lines = this.editor.value.split('\n').length;
        const cursorPos = this.editor.selectionStart;
        const textBeforeCursor = this.editor.value.substring(0, cursorPos);
        const currentLine = textBeforeCursor.split('\n').length;
        const currentColumn = textBeforeCursor.split('\n').pop().length + 1;
        lineInfo.textContent = `Line: ${currentLine}, Column: ${currentColumn}`;
      }
    }

    updateFormatButtons() {
      if (!this.isWordPad) return;
      
      const formatBtns = this.window.querySelectorAll('.format-btn');
      formatBtns.forEach(btn => {
        const command = btn.dataset.action;
        if (document.queryCommandState(command)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    onClose() {
      if (this.isModified && !confirm('Discard changes?')) {
        return false;
      }
      return super.onClose();
    }
  }

  // Create separate classes for different apps
  class Notepad extends TextEditor {
    constructor() {
      super('notepad', 'Notepad', '📝', false);
    }
  }

  class WordPad extends TextEditor {
    constructor() {
      super('wordpad', 'WordPad', '📄', true);
    }
  }

  // Register the apps (notepad is registered by notepad.js, we only register wordpad)
  if (global.PluginManager) {
    global.PluginManager.register('wordpad', WordPad);
  }
})(window);