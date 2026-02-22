import { useEffect, useMemo, useState } from 'react';
import '../styles/MainMenu.css';
import VsComputer from './VsComputer';
import VsPlayer from './VsPlayer';
import { useSound } from '../hooks/useSound';

const BOARD_CELLS = [
  { sym: 'X', cls: 'cell-x' },{ sym: 'O', cls: 'cell-o' },{ sym: '', cls: '' },
  { sym: '', cls: '' },{ sym: 'X', cls: 'cell-x' },{ sym: 'O', cls: 'cell-o' },
  { sym: '', cls: '' },{ sym: '', cls: '' },{ sym: 'X', cls: 'cell-x' },
];

const MEMBERS = [
  { role: 'leader', name: 'Julharie Maddin' },
  { role: 'member', name: 'Bien Vincent Sua Tomboc' },
  { role: 'member', name: 'Radzmi Laudin' },
  { role: 'member', name: 'Jem Baradas' },
  { role: 'member', name: 'Gerry Estimada' },
  { role: 'member', name: 'Precious Lantaca' },
];

function MainMenu({ startMusic, stopMusic }) {
  const [screen, setScreen] = useState('menu');
  const [showModal, setShowModal] = useState(false);
  const [musicOn, setMusicOn] = useState(false
  );
  const { click, pauseMusic, resumeMusic } = useSound();

  const floaters = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const isX = Math.random() > 0.4;
      return {
        id: i, sym: isX ? 'X' : 'O',
        color: isX ? '#ff2d55' : '#00f5ff',
        left: `${Math.random() * 100}vw`,
        fontSize: `${2 + Math.random() * 3}rem`,
        duration: `${12 + Math.random() * 20}s`,
        delay: `${-Math.random() * 20}s`,
      };
    });
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  function toggleMusic() {
    click();
    if (musicOn) {
      pauseMusic();
      setMusicOn(false);
    } else {
      resumeMusic();
      setMusicOn(true);
    }
  }

  function nav(dest) { click(); setScreen(dest); }

  if (screen === 'vsComputer') return <VsComputer onBack={() => nav('menu')} stopMusic={pauseMusic} startMusic={resumeMusic} />;
  if (screen === 'twoPlayer')  return <VsPlayer   onBack={() => nav('menu')} stopMusic={pauseMusic} startMusic={resumeMusic} />;

  return (
    <div className="main-menu-wrapper">
      <div className="grid-bg" aria-hidden="true" />
      <div className="floaters" aria-hidden="true">
        {floaters.map(f => (
          <span key={f.id} className="floater" style={{ left: f.left, color: f.color, fontSize: f.fontSize, animationDuration: f.duration, animationDelay: f.delay }}>{f.sym}</span>
        ))}
      </div>
      <div className="corner corner-tl" aria-hidden="true" />
      <div className="corner corner-tr" aria-hidden="true" />
      <div className="corner corner-bl" aria-hidden="true" />
      <div className="corner corner-br" aria-hidden="true" />

      <main className="menu">
        <div className="logo-wrap">
          <p className="logo-sub">▶ ARCADE CLASSIC ◀</p>
          <div className="logo-sub1">|Made by Team Null-Pointer|</div>
          <h1 className="logo" data-text="TIC - TAC - TOE">
            <span className="logo-x">TIC</span><span className="logo-t"> - </span>
            <span className="logo-o">TAC</span><span className="logo-t"> - </span>
            <span className="logo-x">TOE</span>
          </h1>
        </div>
        <div className="board-deco" aria-hidden="true">
          <div className="board-deco-inner" />
          {BOARD_CELLS.map((cell, i) => (
            <div key={i} className={`cell-sym ${cell.cls}`}>{cell.sym}</div>
          ))}
        </div>
        <nav className="btn-group">
          <button className="btn btn-primary"  onClick={() => nav('twoPlayer')}>2 PLAYER</button>
          <button className="btn btn-secondary" onClick={() => nav('vsComputer')}>VS COMPUTER</button>

          {/* ── Music Toggle ── */}
          <button
            className={`music-toggle ${musicOn ? 'music-on' : 'music-off'}`}
            onClick={toggleMusic}
            aria-label="Toggle music"
          >
            <span className="music-icon">♪</span>
            <span className="music-label">{musicOn ? 'MUSIC ON' : 'MUSIC OFF'}</span>
            <span className={`music-dot ${musicOn ? 'pulse' : ''}`} />
          </button>
        </nav>
        <p className="version-tag" onClick={() => { click(); setShowModal(true); }}>— NP-Alpha-0.1 —</p>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => { click(); setShowModal(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { click(); setShowModal(false); }}>✕</button>
            <img src="/imageLogo.png" alt="Team Null-Pointer Logo" className="modal-logo" />
            <div className="modal-divider" />
            <p className="modal-game-title">TIC - TAC - TOE</p>
            <p className="modal-about">A classic strategy game reimagined with an arcade retro aesthetic. Two players take turns marking X and O on a 3x3 grid first to align three in a row wins. Built with React by Team Null-Pointer.</p>
            <div className="modal-divider" />
            <div className="modal-team">
              <p className="modal-section-label">▶ LEADER</p>
              <p className="modal-leader">{MEMBERS[0].name}</p>
              <p className="modal-section-label">▶ MEMBERS</p>
              <ul className="modal-members">
                {MEMBERS.slice(1).map((m, i) => <li key={i}>{m.name}</li>)}
              </ul>
            </div>
            <div className="modal-divider" />
            <p className="modal-version">NP-Alpha-0.1</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainMenu;
