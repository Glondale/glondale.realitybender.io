// Minesweeper - Classic Windows game
(function(global) {
  class Minesweeper extends BaseApp {
    constructor() {
      super('minesweeper', 'Minesweeper', '💣');
      this.width = 9;
      this.height = 9;
      this.mineCount = 10;
      this.board = [];
      this.gameState = 'ready'; // ready, playing, won, lost
      this.flagCount = 0;
      this.timeElapsed = 0;
      this.timer = null;
      this.firstClick = true;
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '320px';
      window.style.height = '400px';
      
      const content = window.querySelector('.content');
      content.style.padding = '8px';
      content.style.background = '#c0c0c0';
      content.innerHTML = this.getMinesweeperHTML();
      
      this.setupEventListeners(content);
      this.newGame();
      return window;
    }

    getMinesweeperHTML() {
      return `
        <div class="minesweeper-game">
          <div class="game-menu">
            <div class="menu-item" onclick="this.closest('.minesweeper-game').dispatchEvent(new CustomEvent('newgame'))">Game</div>
            <div class="menu-item">Help</div>
          </div>
          
          <div class="game-header">
            <div class="mine-counter">
              <div class="digit-display" id="mine-display">010</div>
            </div>
            
            <div class="smiley-button" id="smiley-btn">🙂</div>
            
            <div class="timer-counter">
              <div class="digit-display" id="timer-display">000</div>
            </div>
          </div>
          
          <div class="game-board" id="game-board"></div>
          
          <div class="difficulty-panel">
            <button class="difficulty-btn active" data-difficulty="beginner">Beginner</button>
            <button class="difficulty-btn" data-difficulty="intermediate">Intermediate</button>
            <button class="difficulty-btn" data-difficulty="expert">Expert</button>
          </div>
        </div>

        <style>
          .minesweeper-game {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'MS Sans Serif', Arial, sans-serif;
          }

          .game-menu {
            display: flex;
            background: #c0c0c0;
            border-bottom: 1px solid #808080;
            padding: 2px 4px;
          }

          .menu-item {
            padding: 4px 8px;
            cursor: pointer;
            font-size: 11px;
          }

          .menu-item:hover {
            background: #e0e0e0;
          }

          .game-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            background: #c0c0c0;
            border: 2px inset #c0c0c0;
            margin-bottom: 8px;
          }

          .mine-counter, .timer-counter {
            border: 2px inset #c0c0c0;
            background: #000;
            padding: 4px;
          }

          .digit-display {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
            color: #ff0000;
            background: #000;
            padding: 2px 6px;
            min-width: 40px;
            text-align: center;
          }

          .smiley-button {
            width: 32px;
            height: 32px;
            border: 2px outset #c0c0c0;
            background: #c0c0c0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
          }

          .smiley-button:active {
            border: 2px inset #c0c0c0;
          }

          .smiley-button.worried {
            content: '😨';
          }

          .smiley-button.dead {
            content: '😵';
          }

          .smiley-button.cool {
            content: '😎';
          }

          .game-board {
            flex: 1;
            border: 2px inset #c0c0c0;
            background: #c0c0c0;
            padding: 4px;
            display: inline-block;
            max-width: fit-content;
            margin: 0 auto;
          }

          .board-grid {
            display: grid;
            gap: 0;
            border: 2px outset #c0c0c0;
            background: #c0c0c0;
          }

          .cell {
            width: 20px;
            height: 20px;
            border: 2px outset #c0c0c0;
            background: #c0c0c0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            user-select: none;
          }

          .cell:active {
            border: 2px inset #c0c0c0;
          }

          .cell.revealed {
            border: 1px solid #808080;
            background: #e0e0e0;
            cursor: default;
          }

          .cell.mine {
            background: #ff0000;
          }

          .cell.flagged {
            background: #c0c0c0;
          }

          .cell.flagged::before {
            content: '🚩';
            font-size: 12px;
          }

          .cell.mine.revealed::before {
            content: '💣';
            font-size: 14px;
          }

          .cell.wrong-flag {
            background: #ff0000;
          }

          .cell.wrong-flag::before {
            content: '❌';
            font-size: 10px;
          }

          .cell.number-1 { color: #0000ff; }
          .cell.number-2 { color: #008000; }
          .cell.number-3 { color: #ff0000; }
          .cell.number-4 { color: #000080; }
          .cell.number-5 { color: #800000; }
          .cell.number-6 { color: #008080; }
          .cell.number-7 { color: #000000; }
          .cell.number-8 { color: #808080; }

          .difficulty-panel {
            display: flex;
            justify-content: center;
            gap: 4px;
            padding: 8px;
            background: #c0c0c0;
            border-top: 1px solid #808080;
          }

          .difficulty-btn {
            padding: 4px 8px;
            border: 2px outset #c0c0c0;
            background: #c0c0c0;
            cursor: pointer;
            font-size: 11px;
          }

          .difficulty-btn.active {
            border: 2px inset #c0c0c0;
            background: #a0a0a0;
          }

          .difficulty-btn:hover {
            background: #d0d0d0;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const smileyBtn = content.querySelector('#smiley-btn');
      const difficultyBtns = content.querySelectorAll('.difficulty-btn');

      smileyBtn.onclick = () => this.newGame();

      difficultyBtns.forEach(btn => {
        btn.onclick = () => this.changeDifficulty(btn.dataset.difficulty);
      });

      content.addEventListener('newgame', () => this.newGame());
    }

    changeDifficulty(difficulty) {
      const settings = {
        beginner: { width: 9, height: 9, mines: 10 },
        intermediate: { width: 16, height: 16, mines: 40 },
        expert: { width: 30, height: 16, mines: 99 }
      };

      if (settings[difficulty]) {
        this.width = settings[difficulty].width;
        this.height = settings[difficulty].height;
        this.mineCount = settings[difficulty].mines;

        // Update active button
        const difficultyBtns = this.window.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
          if (btn.dataset.difficulty === difficulty) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        this.newGame();
      }
    }

    newGame() {
      this.gameState = 'ready';
      this.flagCount = 0;
      this.timeElapsed = 0;
      this.firstClick = true;

      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      this.createBoard();
      this.renderBoard();
      this.updateDisplay();
      
      const smileyBtn = this.window.querySelector('#smiley-btn');
      smileyBtn.textContent = '🙂';
    }

    createBoard() {
      this.board = [];
      for (let y = 0; y < this.height; y++) {
        this.board[y] = [];
        for (let x = 0; x < this.width; x++) {
          this.board[y][x] = {
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborCount: 0
          };
        }
      }
    }

    placeMines(excludeX, excludeY) {
      let minesPlaced = 0;
      while (minesPlaced < this.mineCount) {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);
        
        // Don't place mine on first click or if already a mine
        if ((x === excludeX && y === excludeY) || this.board[y][x].isMine) {
          continue;
        }
        
        this.board[y][x].isMine = true;
        minesPlaced++;
      }

      this.calculateNeighborCounts();
    }

    calculateNeighborCounts() {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (!this.board[y][x].isMine) {
            this.board[y][x].neighborCount = this.countNeighborMines(x, y);
          }
        }
      }
    }

    countNeighborMines(x, y) {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
            if (this.board[ny][nx].isMine) {
              count++;
            }
          }
        }
      }
      return count;
    }

    renderBoard() {
      const gameBoard = this.window.querySelector('#game-board');
      
      const grid = document.createElement('div');
      grid.className = 'board-grid';
      grid.style.gridTemplateColumns = `repeat(${this.width}, 20px)`;
      grid.style.gridTemplateRows = `repeat(${this.height}, 20px)`;

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.x = x;
          cell.dataset.y = y;

          cell.onclick = (e) => this.handleCellClick(x, y, e);
          cell.oncontextmenu = (e) => {
            e.preventDefault();
            this.handleCellRightClick(x, y);
          };

          grid.appendChild(cell);
        }
      }

      gameBoard.innerHTML = '';
      gameBoard.appendChild(grid);
    }

    handleCellClick(x, y, event) {
      if (this.gameState === 'won' || this.gameState === 'lost') return;
      
      const cell = this.board[y][x];
      if (cell.isRevealed || cell.isFlagged) return;

      if (this.firstClick) {
        this.placeMines(x, y);
        this.firstClick = false;
        this.gameState = 'playing';
        this.startTimer();
      }

      if (cell.isMine) {
        this.gameOver(false);
      } else {
        this.revealCell(x, y);
        this.checkWinCondition();
      }

      this.updateBoard();
    }

    handleCellRightClick(x, y) {
      if (this.gameState === 'won' || this.gameState === 'lost') return;
      
      const cell = this.board[y][x];
      if (cell.isRevealed) return;

      if (cell.isFlagged) {
        cell.isFlagged = false;
        this.flagCount--;
      } else {
        cell.isFlagged = true;
        this.flagCount++;
      }

      this.updateBoard();
      this.updateDisplay();
    }

    revealCell(x, y) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
      
      const cell = this.board[y][x];
      if (cell.isRevealed || cell.isFlagged || cell.isMine) return;

      cell.isRevealed = true;

      // If cell has no neighboring mines, reveal all neighbors
      if (cell.neighborCount === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            this.revealCell(x + dx, y + dy);
          }
        }
      }
    }

    updateBoard() {
      const cells = this.window.querySelectorAll('.cell');
      
      cells.forEach(cellElement => {
        const x = parseInt(cellElement.dataset.x);
        const y = parseInt(cellElement.dataset.y);
        const cell = this.board[y][x];

        // Clear previous classes
        cellElement.className = 'cell';
        cellElement.textContent = '';

        if (cell.isFlagged) {
          cellElement.classList.add('flagged');
        } else if (cell.isRevealed) {
          cellElement.classList.add('revealed');
          
          if (cell.isMine) {
            cellElement.classList.add('mine');
          } else if (cell.neighborCount > 0) {
            cellElement.textContent = cell.neighborCount;
            cellElement.classList.add(`number-${cell.neighborCount}`);
          }
        }
      });
    }

    checkWinCondition() {
      let revealedCells = 0;
      let totalSafeCells = this.width * this.height - this.mineCount;

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (this.board[y][x].isRevealed && !this.board[y][x].isMine) {
            revealedCells++;
          }
        }
      }

      if (revealedCells === totalSafeCells) {
        this.gameOver(true);
      }
    }

    gameOver(won) {
      this.gameState = won ? 'won' : 'lost';
      
      if (this.timer) {
        clearInterval(this.timer);
      }

      const smileyBtn = this.window.querySelector('#smiley-btn');
      smileyBtn.textContent = won ? '😎' : '😵';

      // Reveal all mines
      if (!won) {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const cell = this.board[y][x];
            if (cell.isMine && !cell.isFlagged) {
              cell.isRevealed = true;
            } else if (!cell.isMine && cell.isFlagged) {
              // Mark wrong flags
              const cellElement = this.window.querySelector(`[data-x="${x}"][data-y="${y}"]`);
              cellElement.classList.add('wrong-flag');
            }
          }
        }
        this.updateBoard();
      }
    }

    startTimer() {
      this.timer = setInterval(() => {
        this.timeElapsed++;
        this.updateDisplay();
      }, 1000);
    }

    updateDisplay() {
      const mineDisplay = this.window.querySelector('#mine-display');
      const timerDisplay = this.window.querySelector('#timer-display');

      const remainingMines = Math.max(0, this.mineCount - this.flagCount);
      mineDisplay.textContent = remainingMines.toString().padStart(3, '0');
      timerDisplay.textContent = Math.min(999, this.timeElapsed).toString().padStart(3, '0');
    }

    onClose() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      super.onClose();
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('minesweeper', Minesweeper);
  }
})(window);