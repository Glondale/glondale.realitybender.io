// Windows Solitaire (Klondike) - Classic card game
(function(global) {
  class Solitaire extends BaseApp {
    constructor() {
      super('solitaire', 'Solitaire', '🃏');
      this.deck = [];
      this.waste = [];
      this.foundations = [[], [], [], []];
      this.tableau = [[], [], [], [], [], [], []];
      this.selectedCard = null;
      this.moves = 0;
      this.time = 0;
      this.score = 0;
      this.gameStarted = false;
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '640px';
      window.style.height = '480px';
      
      const content = window.querySelector('.content');
      content.style.padding = '8px';
      content.style.background = '#008000';
      content.innerHTML = this.getSolitaireHTML();
      
      this.setupEventListeners(content);
      this.newGame();
      return window;
    }

    getSolitaireHTML() {
      return `
        <div class="solitaire-game">
          <div class="game-header">
            <div class="stats">
              <span>Score: <span id="score">0</span></span>
              <span>Time: <span id="time">00:00</span></span>
              <span>Moves: <span id="moves">0</span></span>
            </div>
            <div class="controls">
              <button class="game-btn" id="new-game">New Game</button>
              <button class="game-btn" id="deal-cards">Deal</button>
            </div>
          </div>
          
          <div class="game-board">
            <div class="top-row">
              <div class="deck-area">
                <div class="deck-slot" id="deck">
                  <div class="card-back"></div>
                </div>
                <div class="waste-slot" id="waste"></div>
              </div>
              
              <div class="foundations">
                <div class="foundation-slot" id="foundation-0" data-suit="hearts">♥️</div>
                <div class="foundation-slot" id="foundation-1" data-suit="diamonds">♦️</div>
                <div class="foundation-slot" id="foundation-2" data-suit="clubs">♣️</div>
                <div class="foundation-slot" id="foundation-3" data-suit="spades">♠️</div>
              </div>
            </div>
            
            <div class="tableau">
              <div class="tableau-column" id="tableau-0"></div>
              <div class="tableau-column" id="tableau-1"></div>
              <div class="tableau-column" id="tableau-2"></div>
              <div class="tableau-column" id="tableau-3"></div>
              <div class="tableau-column" id="tableau-4"></div>
              <div class="tableau-column" id="tableau-5"></div>
              <div class="tableau-column" id="tableau-6"></div>
            </div>
          </div>
        </div>

        <style>
          .solitaire-game {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'MS Sans Serif', Arial, sans-serif;
          }
          
          .game-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #c0c0c0;
            padding: 8px;
            border: 2px inset #c0c0c0;
            margin-bottom: 8px;
          }
          
          .stats {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: #000;
          }
          
          .game-btn {
            padding: 4px 12px;
            border: 2px outset #c0c0c0;
            background: #c0c0c0;
            cursor: pointer;
            font-size: 11px;
            margin-left: 8px;
          }
          
          .game-btn:hover {
            background: #d0d0d0;
          }
          
          .game-btn:active {
            border: 2px inset #c0c0c0;
          }
          
          .game-board {
            flex: 1;
            padding: 8px;
          }
          
          .top-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          
          .deck-area {
            display: flex;
            gap: 8px;
          }
          
          .deck-slot, .waste-slot, .foundation-slot {
            width: 70px;
            height: 95px;
            border: 2px dashed #006600;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            position: relative;
          }
          
          .foundations {
            display: flex;
            gap: 8px;
          }
          
          .tableau {
            display: flex;
            gap: 8px;
            height: 300px;
          }
          
          .tableau-column {
            width: 70px;
            min-height: 95px;
            border: 2px dashed #006600;
            border-radius: 4px;
            position: relative;
          }
          
          .card {
            width: 66px;
            height: 91px;
            background: white;
            border: 1px solid #000;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 4px;
            cursor: pointer;
            position: absolute;
            font-size: 12px;
            font-weight: bold;
            user-select: none;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
          }
          
          .card.red {
            color: #ff0000;
          }
          
          .card.black {
            color: #000000;
          }
          
          .card.face-down {
            background: #000080;
            color: white;
          }
          
          .card.face-down::before {
            content: '🂠';
            font-size: 40px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          
          .card-back {
            width: 66px;
            height: 91px;
            background: #000080;
            border: 1px solid #000;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            cursor: pointer;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
          }
          
          .card-back::before {
            content: '🂠';
            color: white;
          }
          
          .card.selected {
            box-shadow: 0 0 0 3px #ffff00;
          }
          
          .card .top-left, .card .bottom-right {
            font-size: 14px;
            line-height: 1;
          }
          
          .card .bottom-right {
            transform: rotate(180deg);
            align-self: flex-end;
          }
          
          .card .center {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const newGameBtn = content.querySelector('#new-game');
      const dealBtn = content.querySelector('#deal-cards');
      const deckSlot = content.querySelector('#deck');
      
      newGameBtn.onclick = () => this.newGame();
      dealBtn.onclick = () => this.dealCards();
      deckSlot.onclick = () => this.dealCards();
      
      // Start timer
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.timer = setInterval(() => {
          this.time++;
          this.updateDisplay();
        }, 1000);
      }
    }

    newGame() {
      this.createDeck();
      this.shuffleDeck();
      this.dealInitialCards();
      this.score = 0;
      this.moves = 0;
      this.time = 0;
      this.updateDisplay();
    }

    createDeck() {
      this.deck = [];
      const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
      const symbols = ['♥️', '♦️', '♣️', '♠️'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      
      for (let s = 0; s < suits.length; s++) {
        for (let v = 0; v < values.length; v++) {
          this.deck.push({
            suit: suits[s],
            symbol: symbols[s],
            value: values[v],
            numValue: v + 1,
            color: suits[s] === 'hearts' || suits[s] === 'diamonds' ? 'red' : 'black',
            faceUp: false
          });
        }
      }
    }

    shuffleDeck() {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    }

    dealInitialCards() {
      // Clear all areas
      this.waste = [];
      this.foundations = [[], [], [], []];
      this.tableau = [[], [], [], [], [], [], []];
      
      // Deal cards to tableau
      for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= col; row++) {
          const card = this.deck.pop();
          if (row === col) {
            card.faceUp = true;
          }
          this.tableau[col].push(card);
        }
      }
      
      this.renderGame();
    }

    dealCards() {
      if (this.deck.length > 0) {
        const card = this.deck.pop();
        card.faceUp = true;
        this.waste.push(card);
        this.moves++;
      } else if (this.waste.length > 0) {
        // Reset deck from waste
        while (this.waste.length > 0) {
          const card = this.waste.pop();
          card.faceUp = false;
          this.deck.push(card);
        }
      }
      this.renderGame();
      this.updateDisplay();
    }

    renderGame() {
      const content = this.window.querySelector('.content');
      
      // Render deck
      const deckSlot = content.querySelector('#deck');
      deckSlot.innerHTML = this.deck.length > 0 ? '<div class="card-back"></div>' : '';
      
      // Render waste
      const wasteSlot = content.querySelector('#waste');
      wasteSlot.innerHTML = '';
      if (this.waste.length > 0) {
        const topCard = this.waste[this.waste.length - 1];
        wasteSlot.appendChild(this.createCardElement(topCard));
      }
      
      // Render foundations
      for (let i = 0; i < 4; i++) {
        const foundationSlot = content.querySelector(`#foundation-${i}`);
        foundationSlot.innerHTML = '';
        if (this.foundations[i].length > 0) {
          const topCard = this.foundations[i][this.foundations[i].length - 1];
          foundationSlot.appendChild(this.createCardElement(topCard));
        }
      }
      
      // Render tableau
      for (let col = 0; col < 7; col++) {
        const column = content.querySelector(`#tableau-${col}`);
        column.innerHTML = '';
        
        this.tableau[col].forEach((card, index) => {
          const cardElement = this.createCardElement(card);
          cardElement.style.top = `${index * 20}px`;
          cardElement.style.zIndex = index;
          column.appendChild(cardElement);
        });
      }
    }

    createCardElement(card) {
      const cardElement = document.createElement('div');
      cardElement.className = `card ${card.color}`;
      
      if (!card.faceUp) {
        cardElement.classList.add('face-down');
        return cardElement;
      }
      
      cardElement.innerHTML = `
        <div class="top-left">${card.value}${card.symbol}</div>
        <div class="center">${card.symbol}</div>
        <div class="bottom-right">${card.value}${card.symbol}</div>
      `;
      
      cardElement.onclick = (e) => {
        e.stopPropagation();
        this.selectCard(card, cardElement);
      };
      
      return cardElement;
    }

    selectCard(card, cardElement) {
      // Simple card selection for demo
      if (this.selectedCard) {
        this.selectedCard.element.classList.remove('selected');
      }
      
      this.selectedCard = { card, element: cardElement };
      cardElement.classList.add('selected');
    }

    updateDisplay() {
      const content = this.window.querySelector('.content');
      content.querySelector('#score').textContent = this.score;
      content.querySelector('#moves').textContent = this.moves;
      
      const minutes = Math.floor(this.time / 60);
      const seconds = this.time % 60;
      content.querySelector('#time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    global.PluginManager.register('solitaire', Solitaire);
  }
})(window);