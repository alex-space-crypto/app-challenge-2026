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

export function playEggTapSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

export function playBeastRevealSound(tierIndex: number) {
  const baseFreq = 400 + tierIndex * 80;
  playTone(baseFreq, 0.1, 0, 'sine', 0.12);
  playTone(baseFreq * 1.5, 0.1, 0.06, 'sine', 0.12);
  playTone(baseFreq * 2, 0.3, 0.12, 'sine', 0.14);
  if (tierIndex >= 5) {
    playTone(baseFreq * 3, 0.5, 0.18, 'sine', 0.1);
    playTone(baseFreq * 4, 0.5, 0.18, 'sine', 0.06);
  }
}

export function playEggCrackSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}
