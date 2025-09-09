// Windows Calculator App - Works across all OS versions
(function(global) {
  class Calculator extends BaseApp {
    constructor() {
      super('calc', 'Calculator', '🧮');
      this.display = '0';
      this.operator = null;
      this.operand = null;
      this.waitingForOperand = false;
      this.memory = 0;
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '320px';
      window.style.height = '420px';
      window.style.resize = 'none';
      
      const content = window.querySelector('.content');
      content.style.padding = '8px';
      content.style.background = '#f0f0f0';
      content.innerHTML = this.getCalculatorHTML();
      
      this.setupEventListeners(content);
      return window;
    }

    getCalculatorHTML() {
      return `
        <div class="calculator">
          <div class="display-container">
            <div class="display" id="calc-display">${this.display}</div>
          </div>
          <div class="button-grid">
            <button class="btn memory" data-action="memory-clear">MC</button>
            <button class="btn memory" data-action="memory-recall">MR</button>
            <button class="btn memory" data-action="memory-store">MS</button>
            <button class="btn memory" data-action="memory-add">M+</button>
            
            <button class="btn function" data-action="clear">C</button>
            <button class="btn function" data-action="clear-entry">CE</button>
            <button class="btn function" data-action="backspace">←</button>
            <button class="btn operator" data-action="divide">÷</button>
            
            <button class="btn number" data-number="7">7</button>
            <button class="btn number" data-number="8">8</button>
            <button class="btn number" data-number="9">9</button>
            <button class="btn operator" data-action="multiply">×</button>
            
            <button class="btn number" data-number="4">4</button>
            <button class="btn number" data-number="5">5</button>
            <button class="btn number" data-number="6">6</button>
            <button class="btn operator" data-action="subtract">−</button>
            
            <button class="btn number" data-number="1">1</button>
            <button class="btn number" data-number="2">2</button>
            <button class="btn number" data-number="3">3</button>
            <button class="btn operator" data-action="add">+</button>
            
            <button class="btn function" data-action="sign">±</button>
            <button class="btn number" data-number="0">0</button>
            <button class="btn function" data-action="decimal">.</button>
            <button class="btn equals" data-action="equals">=</button>
          </div>
        </div>

        <style>
          .calculator {
            font-family: 'MS Sans Serif', Arial, sans-serif;
            background: #f0f0f0;
          }
          
          .display-container {
            margin-bottom: 8px;
            border: 2px inset #f0f0f0;
            background: white;
            padding: 4px;
          }
          
          .display {
            text-align: right;
            font-size: 20px;
            font-weight: bold;
            padding: 8px;
            min-height: 30px;
            line-height: 30px;
            background: white;
            border: 1px solid #808080;
          }
          
          .button-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
          }
          
          .btn {
            height: 35px;
            font-size: 14px;
            font-weight: bold;
            border: 2px outset #f0f0f0;
            background: #f0f0f0;
            cursor: pointer;
            font-family: 'MS Sans Serif', Arial, sans-serif;
          }
          
          .btn:hover {
            background: #e0e0e0;
          }
          
          .btn:active {
            border: 2px inset #f0f0f0;
            background: #d0d0d0;
          }
          
          .btn.number {
            background: white;
          }
          
          .btn.operator {
            background: #d0d0d0;
          }
          
          .btn.equals {
            background: #0078d4;
            color: white;
          }
          
          .btn.memory {
            background: #c0c0c0;
            font-size: 12px;
          }
          
          .btn.function {
            background: #e0e0e0;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const display = content.querySelector('#calc-display');
      const buttons = content.querySelectorAll('.btn');
      
      buttons.forEach(button => {
        button.onclick = (e) => {
          e.preventDefault();
          
          if (button.dataset.number !== undefined) {
            this.inputNumber(button.dataset.number);
          } else if (button.dataset.action) {
            this.performAction(button.dataset.action);
          }
          
          display.textContent = this.display;
        };
      });
    }

    inputNumber(number) {
      if (this.waitingForOperand) {
        this.display = number;
        this.waitingForOperand = false;
      } else {
        this.display = this.display === '0' ? number : this.display + number;
      }
    }

    performAction(action) {
      const inputValue = parseFloat(this.display);

      switch (action) {
        case 'clear':
          this.display = '0';
          this.operator = null;
          this.operand = null;
          this.waitingForOperand = false;
          break;

        case 'clear-entry':
          this.display = '0';
          break;

        case 'backspace':
          if (this.display.length > 1) {
            this.display = this.display.slice(0, -1);
          } else {
            this.display = '0';
          }
          break;

        case 'decimal':
          if (this.display.indexOf('.') === -1) {
            this.display += '.';
          }
          break;

        case 'sign':
          if (this.display !== '0') {
            this.display = this.display.charAt(0) === '-' ? this.display.slice(1) : '-' + this.display;
          }
          break;

        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          if (this.operand == null) {
            this.operand = inputValue;
          } else if (this.operator) {
            const currentValue = this.operand || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operator);
            
            this.display = String(newValue);
            this.operand = newValue;
          }

          this.waitingForOperand = true;
          this.operator = action;
          break;

        case 'equals':
          if (this.operator && this.operand != null) {
            const newValue = this.calculate(this.operand, inputValue, this.operator);
            this.display = String(newValue);
            this.operand = null;
            this.operator = null;
            this.waitingForOperand = true;
          }
          break;

        case 'memory-clear':
          this.memory = 0;
          break;

        case 'memory-recall':
          this.display = String(this.memory);
          break;

        case 'memory-store':
          this.memory = inputValue;
          break;

        case 'memory-add':
          this.memory += inputValue;
          break;
      }
    }

    calculate(firstOperand, secondOperand, operator) {
      switch (operator) {
        case 'add':
          return firstOperand + secondOperand;
        case 'subtract':
          return firstOperand - secondOperand;
        case 'multiply':
          return firstOperand * secondOperand;
        case 'divide':
          return secondOperand !== 0 ? firstOperand / secondOperand : 0;
        default:
          return secondOperand;
      }
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('calc', Calculator);
  }
})(window);