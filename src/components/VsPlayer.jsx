import { useState, useCallback } from 'react';
import '../styles/VsPlayer.css';

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] };
  return null;
}

function getLineStyle(line) {
  const positions = [
    [16.67, 16.67], [50, 16.67], [83.33, 16.67],
    [16.67, 50],    [50, 50],    [83.33, 50],
    [16.67, 83.33], [50, 83.33], [83.33, 83.33],
  ];
  const [x1, y1] = positions[line[0]];
  const [x2, y2] = positions[line[2]];
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx*dx + dy*dy) + 18;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return {
    left: `${cx}%`, top: `${cy}%`,
    width: `${length}%`,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
  };
}

export default function VsPlayer({ onBack }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ p1: 0, p2: 0, draw: 0 });
  const [p1Name, setP1Name] = useState('PLAYER 1');
  const [p2Name, setP2Name] = useState('PLAYER 2');
  const [nameSetup, setNameSetup] = useState(true);
  const [editP1, setEditP1] = useState('PLAYER 1');
  const [editP2, setEditP2] = useState('PLAYER 2');

  const resetBoard = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setResult(null);
  }, []);

  function handleCell(i) {
    if (board[i] || result) return;
    const next = [...board];
    next[i] = isXTurn ? 'X' : 'O';
    const res = checkWinner(next);
    setBoard(next);
    if (res) {
      setResult(res);
      setScore(s => ({
        ...s,
        p1:   res.winner === 'X' ? s.p1 + 1 : s.p1,
        p2:   res.winner === 'O' ? s.p2 + 1 : s.p2,
        draw: res.winner === 'draw' ? s.draw + 1 : s.draw,
      }));
    } else {
      setIsXTurn(t => !t);
    }
  }

  function handleStartGame() {
    setP1Name(editP1.trim() || 'PLAYER 1');
    setP2Name(editP2.trim() || 'PLAYER 2');
    setNameSetup(false);
  }

  const currentName = isXTurn ? p1Name : p2Name;
  const currentSym  = isXTurn ? 'X' : 'O';

  const statusMsg = result
    ? result.winner === 'draw'
      ? "IT'S A DRAW!"
      : `🏆 ${result.winner === 'X' ? p1Name : p2Name} WINS!`
    : `▶ ${currentName} (${currentSym})`;

  /* ── Name setup screen ── */
  if (nameSetup) {
    return (
      <div className="vp-wrapper">
        <div className="grid-bg" aria-hidden="true" />
        <div className="corner corner-tl" /><div className="corner corner-tr" />
        <div className="corner corner-bl" /><div className="corner corner-br" />
        <div className="vp-panel">
        
                  <p className="vp-label1">⚔</p>
          <p className="vp-label"> 2 PLAYER</p>
          <h2 className="vp-setup-title">ENTER PLAYER NAMES</h2>

          <div className="vp-name-group">
            <label className="vp-name-label x">PLAYER 1 <span>(X)</span></label>
            <input
              className="vp-name-input x"
              value={editP1}
              maxLength={12}
              onChange={e => setEditP1(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleStartGame()}
              placeholder="PLAYER 1"
            />
          </div>

          <div className="vp-name-group">
            <label className="vp-name-label o">PLAYER 2 <span>(O)</span></label>
            <input
              className="vp-name-input o"
              value={editP2}
              maxLength={12}
              onChange={e => setEditP2(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleStartGame()}
              placeholder="PLAYER 2"
            />
          </div>

          <button className="btn btn-primary vp-start-btn" onClick={handleStartGame}>
            ▶ START GAME
          </button>
          <button className="btn btn-tertiary vp-back" onClick={onBack}>- BACK -</button>
        </div>
      </div>
    );
  }

  /* ── Game screen ── */
  return (
    <div className="vp-wrapper">
      <div className="grid-bg" aria-hidden="true" />
      <div className="corner corner-tl" /><div className="corner corner-tr" />
      <div className="corner corner-bl" /><div className="corner corner-br" />

      <div className="vp-panel">

        {/* Header */}
        <div className="vp-header">
          <button className="btn btn-tertiary vp-back-sm" onClick={onBack}>❮</button>
          <p className="vp-label">⚔ 2 PLAYER</p>
          <div style={{ width: 36 }} />
        </div>

        {/* Score */}
        <div className="vp-scoreboard">
          <div className={`vp-score-item ${!result && isXTurn ? 'active' : ''}`}>
            <span className="vp-score-name x">{p1Name}</span>
            <span className="vp-score-num x">{score.p1}</span>
          </div>
          <div className="vp-score-item">
            <span className="vp-score-name draw">DRAW</span>
            <span className="vp-score-num draw">{score.draw}</span>
          </div>
          <div className={`vp-score-item ${!result && !isXTurn ? 'active' : ''}`}>
            <span className="vp-score-name o">{p2Name}</span>
            <span className="vp-score-num o">{score.p2}</span>
          </div>
        </div>

        {/* Status */}
        <p className={`vp-status ${result ? (result.winner === 'draw' ? 'draw' : 'win') : ''}`}>
          {statusMsg}
        </p>

        {/* Board */}
        <div className="vp-board">
          {result && result.line.length > 0 && (
            <div className="vp-win-line" style={getLineStyle(result.line)} />
          )}
          {board.map((cell, i) => (
            <button
              key={i}
              className={`vp-cell ${cell ? `vp-cell-${cell.toLowerCase()}` : ''} ${!cell && !result ? 'hoverable' : ''} ${!cell && !result && isXTurn ? 'hover-x' : ''} ${!cell && !result && !isXTurn ? 'hover-o' : ''}`}
              onClick={() => handleCell(i)}
              disabled={!!cell || !!result}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="vp-actions">
          <button className="btn btn-secondary vp-action-btn" onClick={resetBoard}>↺ REMATCH</button>
          <button className="btn btn-tertiary vp-action-btn" onClick={() => { resetBoard(); setNameSetup(true); }}>⚙ PLAYERS</button>
        </div>

      </div>
    </div>
  );
}
