import { useEffect, useState } from 'react';
import '../styles/Loading.css';

export default function Loading({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('LOADING');

  const GLITCH_CHARS = '!@#$%^&*<>?/\\|[]{}~X0';
  const BASE_TEXT = 'LOADING';

  // Progress bar — ramp up over 5 seconds
  useEffect(() => {
    const start = Date.now();
    const DURATION = 5000;

    const tick = () => {
      const elapsed = Date.now() - start;
      const raw = elapsed / DURATION;
      // Ease: fast at start, slow near end, then snap to 100
      const eased = raw < 0.85
        ? raw * 1.1
        : 0.935 + (raw - 0.85) * 0.43;
      const pct = Math.min(100, Math.round(eased * 100));
      setProgress(pct);

      if (elapsed < DURATION) {
        requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(onDone, 300);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  // Glitch text effect
  useEffect(() => {
    const glitchLoop = () => {
      const glitchCount = Math.floor(Math.random() * 3) + 1;
      let iter = 0;

      const scramble = setInterval(() => {
        setGlitchText(
          BASE_TEXT.split('').map((ch, i) =>
            Math.random() < 0.35
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : ch
          ).join('')
        );
        iter++;
        if (iter >= glitchCount * 2) {
          clearInterval(scramble);
          setGlitchText(BASE_TEXT);
        }
      }, 60);
    };

    // First glitch soon
    const first = setTimeout(glitchLoop, 400);
    // Then randomly every 0.8–2s
    let recurring;
    const schedule = () => {
      recurring = setTimeout(() => {
        glitchLoop();
        schedule();
      }, 800 + Math.random() * 1200);
    };
    schedule();

    return () => {
      clearTimeout(first);
      clearTimeout(recurring);
    };
  }, []);

  return (
    <div className="loading-wrapper">
      <div className="loading-grid-bg" aria-hidden="true" />

      {/* Scanlines */}
      <div className="loading-scanlines" aria-hidden="true" />

      {/* Corner brackets */}
      <div className="corner corner-tl" /><div className="corner corner-tr" />
      <div className="corner corner-bl" /><div className="corner corner-br" />

      <div className="loading-panel">
        {/* Logo */}
        <div className="loading-logo-wrap">
          <img src="/imageLogo.png" alt="Team Null-Pointer" className="loading-logo" />
          <div className="loading-logo-ring" aria-hidden="true" />
        </div>

        {/* Title */}
        <div className="loading-title-wrap">
          <p className="loading-subtitle">▶ ARCADE CLASSIC ◀</p>
          <h1 className="loading-game-title" data-text="TIC - TAC - TOE">
            <span className="lt-x">TIC</span>
            <span className="lt-t"> - </span>
            <span className="lt-o">TAC</span>
            <span className="lt-t"> - </span>
            <span className="lt-x">TOE</span>
          </h1>
          <p className="loading-team">|Made by Team Null-Pointer|</p>
        </div>

        {/* Loading text + bar */}
        <div className="loading-bar-section">
          <div className="loading-text-row">
            <span className="loading-text" aria-label="Loading">{glitchText}</span>
            <span className="loading-pct">{progress}%</span>
          </div>

          <div className="loading-bar-track">
            <div className="loading-bar-glitch-1" aria-hidden="true" />
            <div className="loading-bar-glitch-2" aria-hidden="true" />
            <div
              className="loading-bar-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="loading-bar-tip"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        <p className="loading-version">NP-Alpha-0.1</p>
      </div>
    </div>
  );
}
