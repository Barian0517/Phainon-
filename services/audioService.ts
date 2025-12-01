
/**
 * Plays the ambient background music from /music.mp3.
 * Replaces the previous generative synthesizer for a specific audio asset.
 */
export class AudioService {
    private audio: HTMLAudioElement | null = null;
    private isPlaying: boolean = false;
  
    constructor() {
      // Lazy initialization is handled in start()
    }
  
    public start() {
      if (this.isPlaying) return;
  
      try {
        // In standard React/Vite setups, files in 'public/' are served at the root path.
        this.audio = new Audio('/music.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.5; // Set a reasonable background volume
  
        const playPromise = this.audio.play();
  
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
            })
            .catch((error) => {
              console.warn("Audio playback failed (likely autoplay policy):", error);
            });
        }
  
        this.isPlaying = true;
      } catch (err) {
        console.error("Error initializing audio service:", err);
      }
    }
  
    public stop() {
      if (!this.audio) return;
  
      // Smooth fade out
      const fadeInterval = setInterval(() => {
        if (this.audio && this.audio.volume > 0.05) {
          this.audio.volume -= 0.05;
        } else {
          clearInterval(fadeInterval);
          if (this.audio) {
            this.audio.pause();
            this.audio = null;
          }
          this.isPlaying = false;
        }
      }, 100);
    }
  }
  
  export const audioService = new AudioService();
