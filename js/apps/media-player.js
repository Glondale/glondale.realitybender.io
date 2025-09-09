// Windows Media Player - Multimedia playback application
(function(global) {
  class MediaPlayer extends BaseApp {
    constructor() {
      super('mediaplayer', 'Windows Media Player', '🎵');
      this.playlist = [];
      this.currentTrack = -1;
      this.isPlaying = false;
      this.volume = 50;
      this.currentTime = 0;
      this.duration = 0;
      this.visualizationType = 'bars';
    }

    createWindow() {
      const window = super.createWindow();
      window.style.width = '580px';
      window.style.height = '450px';
      
      const content = window.querySelector('.content');
      content.style.padding = '0';
      content.style.background = 'linear-gradient(to bottom, #2d2d2d, #1a1a1a)';
      content.innerHTML = this.getMediaPlayerHTML();
      
      this.setupEventListeners(content);
      this.initializeVisualizer();
      return window;
    }

    getMediaPlayerHTML() {
      return `
        <div class="media-player">
          <div class="menu-bar">
            <div class="menu-item">File</div>
            <div class="menu-item">View</div>
            <div class="menu-item">Play</div>
            <div class="menu-item">Tools</div>
            <div class="menu-item">Help</div>
          </div>
          
          <div class="display-area">
            <div class="video-area">
              <canvas id="visualizer" width="400" height="200"></canvas>
              <div class="no-media-message">
                <div class="media-icon">🎵</div>
                <div>Ready to play media</div>
                <div class="media-info" id="track-info"></div>
              </div>
            </div>
            
            <div class="playlist-panel">
              <div class="playlist-header">
                <span>Now Playing</span>
                <div class="playlist-controls">
                  <button class="playlist-btn" id="add-media">+</button>
                  <button class="playlist-btn" id="clear-playlist">×</button>
                </div>
              </div>
              <div class="playlist-content" id="playlist"></div>
            </div>
          </div>
          
          <div class="controls-area">
            <div class="transport-controls">
              <button class="control-btn" id="prev-btn">⏮</button>
              <button class="control-btn play-btn" id="play-btn">▶️</button>
              <button class="control-btn" id="next-btn">⏭</button>
              <button class="control-btn" id="stop-btn">⏹</button>
            </div>
            
            <div class="progress-area">
              <span class="time-display" id="current-time">00:00</span>
              <div class="progress-bar">
                <input type="range" id="progress-slider" min="0" max="100" value="0">
              </div>
              <span class="time-display" id="total-time">00:00</span>
            </div>
            
            <div class="volume-area">
              <span class="volume-icon">🔊</span>
              <input type="range" id="volume-slider" min="0" max="100" value="50">
              <span class="volume-level">50</span>
            </div>
          </div>
          
          <div class="status-bar">
            <span id="status-text">Ready</span>
            <div class="visualization-controls">
              <select id="viz-selector">
                <option value="bars">Bars</option>
                <option value="wave">Waveform</option>
                <option value="scope">Oscilloscope</option>
              </select>
            </div>
          </div>
        </div>

        <style>
          .media-player {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            background: #2d2d2d;
            color: #ffffff;
          }

          .menu-bar {
            display: flex;
            background: linear-gradient(to bottom, #4a4a4a, #2d2d2d);
            border-bottom: 1px solid #1a1a1a;
            padding: 4px 8px;
          }

          .menu-item {
            padding: 4px 12px;
            cursor: pointer;
            font-size: 11px;
            border-radius: 2px;
          }

          .menu-item:hover {
            background: #3d3d3d;
          }

          .display-area {
            flex: 1;
            display: flex;
            min-height: 0;
          }

          .video-area {
            flex: 2;
            background: #000;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #1a1a1a;
          }

          #visualizer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .no-media-message {
            text-align: center;
            color: #666;
            z-index: 1;
          }

          .media-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }

          .media-info {
            margin-top: 16px;
            font-size: 12px;
          }

          .playlist-panel {
            flex: 1;
            background: #1a1a1a;
            border-left: 1px solid #333;
            display: flex;
            flex-direction: column;
          }

          .playlist-header {
            padding: 8px 12px;
            background: #2d2d2d;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
          }

          .playlist-controls {
            display: flex;
            gap: 4px;
          }

          .playlist-btn {
            width: 20px;
            height: 20px;
            border: 1px solid #666;
            background: #3d3d3d;
            color: white;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .playlist-btn:hover {
            background: #4a4a4a;
          }

          .playlist-content {
            flex: 1;
            overflow-y: auto;
            padding: 4px;
          }

          .playlist-item {
            padding: 6px 8px;
            font-size: 11px;
            cursor: pointer;
            border-radius: 2px;
            margin-bottom: 2px;
            display: flex;
            justify-content: space-between;
          }

          .playlist-item:hover {
            background: #2d2d2d;
          }

          .playlist-item.active {
            background: #0078d4;
          }

          .controls-area {
            background: linear-gradient(to bottom, #4a4a4a, #2d2d2d);
            padding: 12px;
            border-top: 1px solid #1a1a1a;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .transport-controls {
            display: flex;
            justify-content: center;
            gap: 8px;
          }

          .control-btn {
            width: 36px;
            height: 36px;
            border: 2px outset #666;
            background: linear-gradient(to bottom, #5a5a5a, #3d3d3d);
            color: white;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
          }

          .control-btn:hover {
            background: linear-gradient(to bottom, #6a6a6a, #4a4a4a);
          }

          .control-btn:active {
            border: 2px inset #666;
          }

          .play-btn {
            width: 44px;
            height: 44px;
            font-size: 20px;
          }

          .progress-area {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .time-display {
            font-size: 11px;
            min-width: 40px;
            text-align: center;
          }

          .progress-bar {
            flex: 1;
          }

          .volume-area {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
          }

          .volume-icon {
            font-size: 16px;
          }

          .volume-level {
            font-size: 11px;
            min-width: 24px;
          }

          input[type="range"] {
            background: #333;
            height: 6px;
            border-radius: 3px;
            outline: none;
            -webkit-appearance: none;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #0078d4;
            cursor: pointer;
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #0078d4;
            cursor: pointer;
            border: none;
          }

          #progress-slider {
            flex: 1;
          }

          #volume-slider {
            width: 80px;
          }

          .status-bar {
            background: #1a1a1a;
            padding: 4px 12px;
            border-top: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
          }

          .visualization-controls select {
            background: #2d2d2d;
            color: white;
            border: 1px solid #666;
            font-size: 10px;
            padding: 2px 4px;
          }
        </style>
      `;
    }

    setupEventListeners(content) {
      const playBtn = content.querySelector('#play-btn');
      const prevBtn = content.querySelector('#prev-btn');
      const nextBtn = content.querySelector('#next-btn');
      const stopBtn = content.querySelector('#stop-btn');
      const addMediaBtn = content.querySelector('#add-media');
      const clearPlaylistBtn = content.querySelector('#clear-playlist');
      const volumeSlider = content.querySelector('#volume-slider');
      const progressSlider = content.querySelector('#progress-slider');
      const vizSelector = content.querySelector('#viz-selector');

      playBtn.onclick = () => this.togglePlayback();
      prevBtn.onclick = () => this.previousTrack();
      nextBtn.onclick = () => this.nextTrack();
      stopBtn.onclick = () => this.stopPlayback();
      addMediaBtn.onclick = () => this.addMedia();
      clearPlaylistBtn.onclick = () => this.clearPlaylist();

      volumeSlider.oninput = (e) => {
        this.volume = parseInt(e.target.value);
        content.querySelector('.volume-level').textContent = this.volume;
      };

      progressSlider.oninput = (e) => {
        this.currentTime = (parseInt(e.target.value) / 100) * this.duration;
      };

      vizSelector.onchange = (e) => {
        this.visualizationType = e.target.value;
      };

      // Add some demo tracks
      this.addDemoTracks();
    }

    addDemoTracks() {
      const demoTracks = [
        { title: "Windows XP Startup Sound", artist: "Microsoft", duration: 4, type: "audio" },
        { title: "Windows 95 Startup Sound", artist: "Microsoft", duration: 3, type: "audio" },
        { title: "Sample Music Track", artist: "Demo Artist", duration: 180, type: "audio" },
        { title: "Nature Sounds", artist: "Relaxation", duration: 240, type: "audio" }
      ];

      demoTracks.forEach(track => this.playlist.push(track));
      this.updatePlaylistDisplay();
    }

    addMedia() {
      const trackName = prompt("Enter track name:", "New Track");
      if (trackName) {
        const track = {
          title: trackName,
          artist: "Unknown Artist",
          duration: Math.floor(Math.random() * 300) + 60,
          type: "audio"
        };
        this.playlist.push(track);
        this.updatePlaylistDisplay();
        this.updateStatus(`Added: ${track.title}`);
      }
    }

    clearPlaylist() {
      this.playlist = [];
      this.currentTrack = -1;
      this.stopPlayback();
      this.updatePlaylistDisplay();
      this.updateStatus("Playlist cleared");
    }

    updatePlaylistDisplay() {
      const playlistContent = this.window.querySelector('#playlist');
      playlistContent.innerHTML = '';

      this.playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === this.currentTrack) {
          item.classList.add('active');
        }

        item.innerHTML = `
          <div>
            <div>${track.title}</div>
            <div style="font-size: 9px; color: #aaa;">${track.artist}</div>
          </div>
          <div>${this.formatTime(track.duration)}</div>
        `;

        item.onclick = () => {
          this.currentTrack = index;
          this.loadTrack();
          this.updatePlaylistDisplay();
        };

        playlistContent.appendChild(item);
      });
    }

    togglePlayback() {
      if (this.playlist.length === 0) {
        this.updateStatus("No media in playlist");
        return;
      }

      if (this.currentTrack === -1) {
        this.currentTrack = 0;
        this.loadTrack();
      }

      this.isPlaying = !this.isPlaying;
      const playBtn = this.window.querySelector('#play-btn');
      
      if (this.isPlaying) {
        playBtn.textContent = '⏸';
        this.startPlayback();
        this.updateStatus(`Playing: ${this.playlist[this.currentTrack].title}`);
      } else {
        playBtn.textContent = '▶️';
        this.pausePlayback();
        this.updateStatus("Paused");
      }
    }

    startPlayback() {
      if (this.playbackTimer) {
        clearInterval(this.playbackTimer);
      }

      this.playbackTimer = setInterval(() => {
        if (this.isPlaying) {
          this.currentTime++;
          if (this.currentTime >= this.duration) {
            this.nextTrack();
          }
          this.updateTimeDisplay();
          this.updateVisualizer();
        }
      }, 1000);
    }

    pausePlayback() {
      if (this.playbackTimer) {
        clearInterval(this.playbackTimer);
      }
    }

    stopPlayback() {
      this.isPlaying = false;
      this.currentTime = 0;
      const playBtn = this.window.querySelector('#play-btn');
      playBtn.textContent = '▶️';
      this.pausePlayback();
      this.updateTimeDisplay();
      this.updateStatus("Stopped");
    }

    previousTrack() {
      if (this.currentTrack > 0) {
        this.currentTrack--;
        this.loadTrack();
        if (this.isPlaying) {
          this.startPlayback();
        }
      }
    }

    nextTrack() {
      if (this.currentTrack < this.playlist.length - 1) {
        this.currentTrack++;
        this.loadTrack();
        if (this.isPlaying) {
          this.startPlayback();
        }
      } else {
        this.stopPlayback();
        this.currentTrack = -1;
      }
    }

    loadTrack() {
      if (this.currentTrack >= 0 && this.currentTrack < this.playlist.length) {
        const track = this.playlist[this.currentTrack];
        this.duration = track.duration;
        this.currentTime = 0;
        
        const trackInfo = this.window.querySelector('#track-info');
        trackInfo.innerHTML = `
          <strong>${track.title}</strong><br>
          <span style="font-size: 10px;">${track.artist}</span>
        `;
        
        this.updateTimeDisplay();
        this.updatePlaylistDisplay();
      }
    }

    updateTimeDisplay() {
      const currentTimeEl = this.window.querySelector('#current-time');
      const totalTimeEl = this.window.querySelector('#total-time');
      const progressSlider = this.window.querySelector('#progress-slider');

      currentTimeEl.textContent = this.formatTime(this.currentTime);
      totalTimeEl.textContent = this.formatTime(this.duration);
      
      if (this.duration > 0) {
        const progress = (this.currentTime / this.duration) * 100;
        progressSlider.value = progress;
      }
    }

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    initializeVisualizer() {
      this.canvas = this.window.querySelector('#visualizer');
      this.ctx = this.canvas.getContext('2d');
      this.animationData = new Array(32).fill(0);
    }

    updateVisualizer() {
      if (!this.ctx || !this.isPlaying) return;

      const { width, height } = this.canvas;
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, width, height);

      // Generate random visualization data
      for (let i = 0; i < this.animationData.length; i++) {
        this.animationData[i] = Math.random() * (this.volume / 100);
      }

      switch (this.visualizationType) {
        case 'bars':
          this.drawBars();
          break;
        case 'wave':
          this.drawWaveform();
          break;
        case 'scope':
          this.drawOscilloscope();
          break;
      }
    }

    drawBars() {
      const { width, height } = this.canvas;
      const barWidth = width / this.animationData.length;
      
      this.ctx.fillStyle = '#00ff00';
      this.animationData.forEach((value, index) => {
        const barHeight = value * height * 0.8;
        const x = index * barWidth;
        const y = height - barHeight;
        this.ctx.fillRect(x, y, barWidth - 2, barHeight);
      });
    }

    drawWaveform() {
      const { width, height } = this.canvas;
      this.ctx.strokeStyle = '#00ff00';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      
      const centerY = height / 2;
      this.animationData.forEach((value, index) => {
        const x = (index / this.animationData.length) * width;
        const y = centerY + (value - 0.5) * height * 0.6;
        
        if (index === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      
      this.ctx.stroke();
    }

    drawOscilloscope() {
      const { width, height } = this.canvas;
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 1;
      
      for (let i = 0; i < 8; i++) {
        this.ctx.beginPath();
        const radius = (i + 1) * 20 + this.animationData[i] * 30;
        this.ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }

    updateStatus(message) {
      const statusText = this.window.querySelector('#status-text');
      statusText.textContent = message;
    }

    onClose() {
      this.stopPlayback();
      if (this.playbackTimer) {
        clearInterval(this.playbackTimer);
      }
      super.onClose();
    }
  }

  // Register the app
  if (global.PluginManager) {
    global.PluginManager.register('mediaplayer', MediaPlayer);
  }
})(window);