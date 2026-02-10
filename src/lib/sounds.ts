// Sound effect URLs (using Web Audio API for generated sounds)
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const playDiceRollSound = () => {
  // Quick succession of clicks for dice roll
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      playTone(200 + Math.random() * 100, 0.05, 'square', 0.1);
    }, i * 50);
  }
};

export const playMoveSound = () => {
  playTone(440, 0.1, 'sine', 0.2);
};

export const playSnakeSound = () => {
  // Descending tone for snake bite
  playTone(600, 0.1, 'sawtooth', 0.3);
  setTimeout(() => playTone(400, 0.1, 'sawtooth', 0.3), 100);
  setTimeout(() => playTone(200, 0.2, 'sawtooth', 0.3), 200);
};

export const playLadderSound = () => {
  // Ascending tone for ladder climb
  playTone(300, 0.1, 'sine', 0.3);
  setTimeout(() => playTone(400, 0.1, 'sine', 0.3), 100);
  setTimeout(() => playTone(500, 0.1, 'sine', 0.3), 200);
  setTimeout(() => playTone(600, 0.15, 'sine', 0.3), 300);
};

export const playWinSound = () => {
  // Victory fanfare
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.4), i * 150);
  });
};

export const playButtonSound = () => {
  playTone(800, 0.05, 'sine', 0.1);
};