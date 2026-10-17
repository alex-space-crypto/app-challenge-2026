import type { Rarity } from './collectibles';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq: number, duration: number, delay: number, type: OscillatorType = 'sine', volume = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const startTime = ctx.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

export function playRewardSound(rarity: Rarity) {
  switch (rarity) {
    case 'common':
      playTone(523, 0.15, 0, 'sine', 0.12);
      playTone(659, 0.15, 0.08, 'sine', 0.12);
      break;
    case 'rare':
      playTone(523, 0.12, 0, 'sine', 0.14);
      playTone(659, 0.12, 0.08, 'sine', 0.14);
      playTone(784, 0.25, 0.16, 'sine', 0.14);
      break;
    case 'epic':
      playTone(523, 0.1, 0, 'triangle', 0.15);
      playTone(659, 0.1, 0.06, 'triangle', 0.15);
      playTone(784, 0.1, 0.12, 'triangle', 0.15);
      playTone(1047, 0.3, 0.18, 'triangle', 0.15);
      break;
    case 'legendary':
      playTone(523, 0.12, 0, 'sawtooth', 0.1);
      playTone(659, 0.12, 0.08, 'sawtooth', 0.1);
      playTone(784, 0.12, 0.16, 'sawtooth', 0.1);
      playTone(1047, 0.12, 0.24, 'sawtooth', 0.12);
      playTone(1319, 0.5, 0.32, 'sine', 0.16);
      playTone(1568, 0.5, 0.32, 'sine', 0.08);
      break;
  }
}

export function playClickSound() {
  playTone(800, 0.05, 0, 'square', 0.06);
}
