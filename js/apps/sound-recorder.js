// Sound Recorder - Audio recording utility
(function(global) {
  class SoundRecorder extends BaseApp {
    constructor() {
      super('soundrecorder', 'Sound Recorder', '🎙️');
      this.isRecording = false;
      this.isPaused = false;
      this.recordingTime = 0;
      this.recordings = [];
      this.currentRecording = null;
      this.audioContext = null;
      this.mediaRecorder = null;
      this.audioChunks = [];
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '420px';
      window.style.height = '350px';
      
      const content = window.querySelector('.content');
      content.style.padding = '8px';
      content.style.background = '#f0f0f0';
      content.innerHTML = this.getSoundRecorderHTML();
      
      this.setupEventListeners(content);
      this.initializeAudio();
      return window;
    }

    getSoundRecorderHTML() {
      return `
        <div class="sound-recorder">
          <div class="main-controls">
            <div class="recording-display">
              <div class="level-meter">
                <div class="level-bar" id="level-bar"></div>
              </div>
              <div class="recording-info">
                <div class="time-display" id="time-display">00:00</div>
                <div class="status-text" id="status-text">Ready to record</div>
              </div>
            </div>
            
            <div class="control-buttons">
              <button class="record-btn" id="record-btn">
                <span class="btn-icon">⏺</span>
                <span class="btn-text">Record</span>
              </button>
              <button class="control-btn" id="stop-btn" disabled>
                <span class="btn-icon">⏹</span>
                <span class="btn-text">Stop</span>
              </button>
              <button class="control-btn" id="play-btn" disabled>
                <span class="btn-icon">▶️</span>
                <span class="btn-text">Play</span>
              </button>
            </div>
          </div>
          
          <div class="recordings-section">
            <div class="section-header">
              <span>Recordings</span>
              <button class="small-btn" id="clear-all">Clear All</button>
            </div>
            
            <div class="recordings-list" id="recordings-list">
              <div class="no-recordings">No recordings yet</div>
            </div>
          </div>
          
          <div class="settings-section">
            <div class="setting-group">
              <label>Quality:</label>
              <select id="quality-select">
                <option value="low">Telephone (8 kHz)</option>
                <option value="medium" selected>Radio (22 kHz)</option>
                <option value="high">CD Quality (44 kHz)</option>
              </select>
            </div>
            
            <div class="setting-group">
              <label>Format:</label>
              <select id="format-select">
                <option value="wav">WAV</option>
                <option value="mp3">MP3</option>
                <option value="wma" selected>WMA</option>
              </select>
            </div>
          </div>
        </div>

        <style>
          .sound-recorder {
            height: 100%;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .main-controls {
            border: 2px inset #f0f0f0;
            padding: 16px;
            background: #e0e0e0;
          }

          .recording-display {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
          }

          .level-meter {
            width: 200px;
            height: 20px;
            border: 2px inset #f0f0f0;
            background: #000;
            position: relative;
            overflow: hidden;
          }

          .level-bar {
            height: 100%;
            background: linear-gradient(to right, #00ff00 0%, #ffff00 70%, #ff0000 100%);
            width: 0%;
            transition: width 0.1s ease;
          }

          .recording-info {
            text-align: center;
          }

          .time-display {
            font-size: 24px;
            font-weight: bold;
            color: #000080;
            font-family: 'Courier New', monospace;
            margin-bottom: 4px;
          }

          .status-text {
            font-size: 11px;
            color: #666;
          }

          .control-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
          }

          .record-btn, .control-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 12px;
            border: 2px outset #f0f0f0;
            background: #f0f0f0;
            cursor: pointer;
            min-width: 60px;
            font-size: 11px;
          }

          .record-btn {
            background: #ff4444;
            color: white;
          }

          .record-btn.recording {
            background: #cc0000;
            border: 2px inset #f0f0f0;
          }

          .control-btn:disabled {
            background: #d0d0d0;
            color: #999;
            cursor: not-allowed;
            border: 2px inset #f0f0f0;
          }

          .control-btn:not(:disabled):hover {
            background: #e0e0e0;
          }

          .btn-icon {
            font-size: 16px;
            margin-bottom: 2px;
          }

          .btn-text {
            font-size: 10px;
          }

          .recordings-section {
            flex: 1;
            border: 2px inset #f0f0f0;
            display: flex;
            flex-direction: column;
            min-height: 100px;
          }

          .section-header {
            background: #d0d0d0;
            padding: 4px 8px;
            border-bottom: 1px solid #999;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            font-weight: bold;
          }

          .small-btn {
            padding: 2px 8px;
            border: 1px outset #d0d0d0;
            background: #d0d0d0;
            cursor: pointer;
            font-size: 10px;
          }

          .small-btn:hover {
            background: #e0e0e0;
          }

          .recordings-list {
            flex: 1;
            padding: 8px;
            overflow-y: auto;
            background: white;
          }

          .no-recordings {
            text-align: center;
            color: #999;
            font-style: italic;
            font-size: 11px;
            padding: 20px;
          }

          .recording-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            border: 1px solid #d0d0d0;
            background: #f8f8f8;
            margin-bottom: 4px;
            font-size: 11px;
          }

          .recording-item:hover {
            background: #e8e8f8;
          }

          .recording-item.selected {
            background: #0078d4;
            color: white;
          }

          .recording-details {
            flex: 1;
          }

          .recording-name {
            font-weight: bold;
            margin-bottom: 2px;
          }

          .recording-meta {
            color: #666;
            font-size: 10px;
          }

          .recording-controls {
            display: flex;
            gap: 4px;
          }

          .mini-btn {
            width: 20px;
            height: 20px;
            border: 1px outset #d0d0d0;
            background: #d0d0d0;
            cursor: pointer;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mini-btn:hover {
            background: #e0e0e0;
          }

          .settings-section {
            border: 2px inset #f0f0f0;
            padding: 8px;
            background: #e0e0e0;
            display: flex;
            gap: 16px;
          }

          .setting-group {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
          }

          .setting-group select {
            border: 2px inset #f0f0f0;
            background: white;
            font-size: 11px;
            padding: 2px;
          }

          .recording {
            animation: pulse 1s infinite;
          }

          @keyframes pulse {
            0%, 50% { opacity: 1; }
            25%, 75% { opacity: 0.7; }
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const recordBtn = content.querySelector('#record-btn');
      const stopBtn = content.querySelector('#stop-btn');
      const playBtn = content.querySelector('#play-btn');
      const clearAllBtn = content.querySelector('#clear-all');

      recordBtn.onclick = () => this.toggleRecording();
      stopBtn.onclick = () => this.stopRecording();
      playBtn.onclick = () => this.playCurrentRecording();
      clearAllBtn.onclick = () => this.clearAllRecordings();

      // Add demo recordings
      this.addDemoRecordings();
    }

    async initializeAudio() {
      try {
        // For demo purposes, we'll simulate audio recording
        this.updateStatus('Ready to record');
      } catch (error) {
        this.updateStatus('Microphone access denied');
      }
    }

    addDemoRecordings() {
      const demoRecordings = [
        {
          name: 'Recording 1',
          duration: 15,
          size: '240 KB',
          date: new Date(Date.now() - 86400000).toLocaleString(),
          quality: 'Medium'
        },
        {
          name: 'Voice Note',
          duration: 8,
          size: '128 KB',
          date: new Date(Date.now() - 172800000).toLocaleString(),
          quality: 'High'
        }
      ];

      this.recordings = demoRecordings;
      this.updateRecordingsList();
    }

    toggleRecording() {
      if (this.isRecording) {
        this.pauseRecording();
      } else {
        this.startRecording();
      }
    }

    startRecording() {
      this.isRecording = true;
      this.isPaused = false;
      this.recordingTime = 0;
      
      const recordBtn = this.window.querySelector('#record-btn');
      const stopBtn = this.window.querySelector('#stop-btn');
      const playBtn = this.window.querySelector('#play-btn');

      recordBtn.classList.add('recording');
      recordBtn.querySelector('.btn-text').textContent = 'Pause';
      stopBtn.disabled = false;
      playBtn.disabled = true;

      this.updateStatus('Recording...');
      this.startTimer();
      this.simulateRecording();
    }

    pauseRecording() {
      this.isRecording = false;
      this.isPaused = true;

      const recordBtn = this.window.querySelector('#record-btn');
      recordBtn.classList.remove('recording');
      recordBtn.querySelector('.btn-text').textContent = 'Resume';

      this.updateStatus('Recording paused');
      this.stopTimer();
    }

    stopRecording() {
      this.isRecording = false;
      this.isPaused = false;

      const recordBtn = this.window.querySelector('#record-btn');
      const stopBtn = this.window.querySelector('#stop-btn');
      const playBtn = this.window.querySelector('#play-btn');

      recordBtn.classList.remove('recording');
      recordBtn.querySelector('.btn-text').textContent = 'Record';
      stopBtn.disabled = true;
      playBtn.disabled = false;

      this.stopTimer();
      this.saveRecording();
      this.updateStatus('Recording stopped');

      // Reset level meter
      const levelBar = this.window.querySelector('#level-bar');
      levelBar.style.width = '0%';
    }

    saveRecording() {
      if (this.recordingTime > 0) {
        const recording = {
          name: `Recording ${this.recordings.length + 1}`,
          duration: this.recordingTime,
          size: Math.floor(this.recordingTime * 16) + ' KB',
          date: new Date().toLocaleString(),
          quality: this.getSelectedQuality()
        };

        this.recordings.push(recording);
        this.updateRecordingsList();
        this.updateStatus(`Saved: ${recording.name}`);
        
        // Select the new recording
        this.currentRecording = this.recordings.length - 1;
        this.updateRecordingSelection();
      }
    }

    playCurrentRecording() {
      if (this.currentRecording !== null && this.recordings[this.currentRecording]) {
        const recording = this.recordings[this.currentRecording];
        this.updateStatus(`Playing: ${recording.name}`);
        
        // Simulate playback
        setTimeout(() => {
          this.updateStatus('Playback finished');
        }, 2000);
      } else {
        this.updateStatus('No recording selected');
      }
    }

    clearAllRecordings() {
      if (confirm('Delete all recordings?')) {
        this.recordings = [];
        this.currentRecording = null;
        this.updateRecordingsList();
        this.updateStatus('All recordings deleted');
        
        const playBtn = this.window.querySelector('#play-btn');
        playBtn.disabled = true;
      }
    }

    startTimer() {
      this.recordingTimer = setInterval(() => {
        this.recordingTime++;
        this.updateTimeDisplay();
      }, 1000);
    }

    stopTimer() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
    }

    simulateRecording() {
      if (!this.isRecording) return;

      // Simulate audio level
      const levelBar = this.window.querySelector('#level-bar');
      const level = Math.random() * 80 + 10; // 10-90%
      levelBar.style.width = level + '%';

      setTimeout(() => this.simulateRecording(), 100);
    }

    updateTimeDisplay() {
      const timeDisplay = this.window.querySelector('#time-display');
      const minutes = Math.floor(this.recordingTime / 60);
      const seconds = this.recordingTime % 60;
      timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateStatus(message) {
      const statusText = this.window.querySelector('#status-text');
      statusText.textContent = message;
    }

    updateRecordingsList() {
      const recordingsList = this.window.querySelector('#recordings-list');
      
      if (this.recordings.length === 0) {
        recordingsList.innerHTML = '<div class="no-recordings">No recordings yet</div>';
        return;
      }

      recordingsList.innerHTML = '';
      this.recordings.forEach((recording, index) => {
        const item = document.createElement('div');
        item.className = 'recording-item';
        if (index === this.currentRecording) {
          item.classList.add('selected');
        }

        item.innerHTML = `
          <div class="recording-details">
            <div class="recording-name">${recording.name}</div>
            <div class="recording-meta">${recording.duration}s • ${recording.size} • ${recording.date}</div>
          </div>
          <div class="recording-controls">
            <button class="mini-btn" title="Play" onclick="event.stopPropagation(); /* Play recording */">▶️</button>
            <button class="mini-btn" title="Delete" onclick="event.stopPropagation(); /* Delete recording */">🗑</button>
          </div>
        `;

        item.onclick = () => {
          this.currentRecording = index;
          this.updateRecordingSelection();
          const playBtn = this.window.querySelector('#play-btn');
          playBtn.disabled = false;
        };

        recordingsList.appendChild(item);
      });
    }

    updateRecordingSelection() {
      const items = this.window.querySelectorAll('.recording-item');
      items.forEach((item, index) => {
        if (index === this.currentRecording) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    }

    getSelectedQuality() {
      const qualitySelect = this.window.querySelector('#quality-select');
      const qualityMap = {
        'low': 'Telephone',
        'medium': 'Radio',
        'high': 'CD Quality'
      };
      return qualityMap[qualitySelect.value] || 'Medium';
    }

    onClose() {
      this.stopRecording();
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
      }
      super.onClose();
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('soundrec', SoundRecorder);
  }
})(window);