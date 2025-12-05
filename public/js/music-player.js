// Global Music Player with localStorage persistence

class MusicPlayer {
    constructor() {
        this.currentPlaylist = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        // Restore player state from localStorage
        const savedState = this.getState();
        if (savedState && savedState.playlist) {
            this.currentPlaylist = savedState.playlist;
            // Small delay to ensure DOM is ready
            setTimeout(() => this.loadPlaylist(savedState.playlist), 500);
        }
    }

    getState() {
        try {
            const state = localStorage.getItem('musicPlayerState');
            return state ? JSON.parse(state) : null;
        } catch (e) {
            return null;
        }
    }

    setState(playlist) {
        try {
            localStorage.setItem('musicPlayerState', JSON.stringify({
                playlist: playlist,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error('Failed to save music state:', e);
        }
    }

    clearState() {
        localStorage.removeItem('musicPlayerState');
    }

    togglePanel() {
        const panel = document.getElementById('musicPanel');
        const toggle = document.getElementById('musicToggle');

        if (!panel || !toggle) return;

        if (panel.classList.contains('active')) {
            panel.classList.remove('active');
            toggle.classList.remove('active');
        } else {
            panel.classList.add('active');
            toggle.classList.add('active');
        }
    }

    changePlaylist(value) {
        const container = document.getElementById('playerContainer');
        if (!container) return;

        if (!value) {
            container.innerHTML = `
                <div class="player-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polygon points="10 8 16 12 10 16 10 8"/>
                    </svg>
                    <p>Selecciona una playlist para comenzar</p>
                </div>
            `;
            this.clearState();
            return;
        }

        this.loadPlaylist(value);
        this.setState(value);
    }

    loadPlaylist(value) {
        const container = document.getElementById('playerContainer');
        if (!container) return;

        // Check if it's a video or playlist
        let embedUrl;
        if (value.startsWith('video:')) {
            const videoId = value.replace('video:', '');
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else {
            embedUrl = `https://www.youtube.com/embed/videoseries?list=${value}&autoplay=1`;
        }

        container.innerHTML = `
            <iframe 
                id="musicIframe"
                width="100%" 
                height="200" 
                src="${embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;

        // Update select if exists
        const select = document.getElementById('playlistSelect');
        if (select) {
            select.value = value;
        }

        this.currentPlaylist = value;
        this.isPlaying = true;
    }

    stop() {
        const container = document.getElementById('playerContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="player-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                <p>Selecciona una playlist para comenzar</p>
            </div>
        `;

        this.clearState();
        this.currentPlaylist = null;
        this.isPlaying = false;

        const select = document.getElementById('playlistSelect');
        if (select) {
            select.value = '';
        }
    }
}

// Initialize global music player
let musicPlayer;

document.addEventListener('DOMContentLoaded', () => {
    musicPlayer = new MusicPlayer();
});

// Global functions for HTML onclick handlers
function toggleMusic() {
    if (musicPlayer) {
        musicPlayer.togglePanel();
    }
}

function changePlaylist() {
    const select = document.getElementById('playlistSelect');
    if (select && musicPlayer) {
        musicPlayer.changePlaylist(select.value);
    }
}

function stopMusic() {
    if (musicPlayer) {
        musicPlayer.stop();
    }
}
