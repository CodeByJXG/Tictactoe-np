// src/hooks/useSound.js
import { useCallback } from 'react';

// ── Shared Audio Context for SFX ──
let sharedCtx = null;

function getCtx() {
  if (!sharedCtx) sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (sharedCtx.state === 'suspended') sharedCtx.resume();
  return sharedCtx;
}

// ── Single shared Audio element for BGM ──
let bgAudio = null;

function getBgAudio() {
  if (!bgAudio) {
    bgAudio = new Audio('/music.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.1;
  }
  return bgAudio;
}

// ── SFX ──
function playClick() {
  const ctx = getCtx();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.frequency.setValueAtTime(800, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  o.start(); o.stop(ctx.currentTime + 0.08);
}

function playPlaceX() {
  const ctx = getCtx();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'square';
  o.frequency.setValueAtTime(440, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
  g.gain.setValueAtTime(0.2, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  o.start(); o.stop(ctx.currentTime + 0.15);
}

function playPlaceO() {
  const ctx = getCtx();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'sine';
  o.frequency.setValueAtTime(550, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.12);
  g.gain.setValueAtTime(0.2, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  o.start(); o.stop(ctx.currentTime + 0.15);
}

function playWin() {
  const ctx = getCtx();
  [523, 659, 784, 1047].forEach((freq, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'square';
    o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
    o.start(ctx.currentTime + i * 0.12);
    o.stop(ctx.currentTime + i * 0.12 + 0.25);
  });
}

function playLose() {
  const ctx = getCtx();
  [400, 350, 280, 220].forEach((freq, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.13);
    g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.13);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.2);
    o.start(ctx.currentTime + i * 0.13);
    o.stop(ctx.currentTime + i * 0.13 + 0.2);
  });
}

function playDraw() {
  const ctx = getCtx();
  [440, 440, 330].forEach((freq, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
    g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.2);
    o.start(ctx.currentTime + i * 0.15);
    o.stop(ctx.currentTime + i * 0.15 + 0.2);
  });
}

// ── Hook ──
export function useSound() {
  const startMusic = useCallback(() => {
    try {
      const a = getBgAudio();
      a.play().catch(() => {});
    } catch(e) {}
  }, []);

  const stopMusic = useCallback(() => {
    try {
      const a = getBgAudio();
      a.pause();
      a.currentTime = 0;
    } catch(e) {}
  }, []);

  const pauseMusic = useCallback(() => {
    try { getBgAudio().pause(); } catch(e) {}
  }, []);

  const resumeMusic = useCallback(() => {
    try { getBgAudio().play().catch(() => {}); } catch(e) {}
  }, []);

  const isMusicPlaying = useCallback(() => {
    try {
      const a = getBgAudio();
      return !a.paused && !a.ended && a.readyState > 2;
    } catch(e) { return false; }
  }, []);

  return {
    click:         useCallback(() => { try { playClick();   } catch(e){} }, []),
    placeX:        useCallback(() => { try { playPlaceX();  } catch(e){} }, []),
    placeO:        useCallback(() => { try { playPlaceO();  } catch(e){} }, []),
    win:           useCallback(() => { try { playWin();     } catch(e){} }, []),
    lose:          useCallback(() => { try { playLose();    } catch(e){} }, []),
    draw:          useCallback(() => { try { playDraw();    } catch(e){} }, []),
    startMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    isMusicPlaying,
  };
}
