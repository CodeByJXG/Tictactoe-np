import { useState, useEffect, useCallback } from 'react';
import '../styles/VsComputer.css';
import { useSound } from '../hooks/useSound';

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

function getEasyMove(board) {
  const empty = board.map((v,i) => v ? null : i).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getMediumMove(board) {
  if (Math.random() < 0.5) return getBestMove(board);
  return getEasyMove(board);
}

function getBestMove(board) {
  for (const [a,b,c] of WIN_LINES) {
    const line = [board[a],board[b],board[c]];
    if (line.filter(v => v === 'O').length === 2 && line.includes(null))
      return [a,b,c][[board[a],board[b],board[c]].indexOf(null)];
  }
  for (const [a,b,c] of WIN_LINES) {
    const line = [board[a],board[b],board[c]];
    if (line.filter(v => v === 'X').length === 2 && line.includes(null))
      return [a,b,c][[board[a],board[b],board[c]].indexOf(null)];
  }
  if (!board[4]) return 4;
  const corners = [0,2,6,8].filter(i => !board[i]);
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
  return getEasyMove(board);
}

function minimax(board, isMax, alpha, beta) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'O') return 10;
    if (result.winner === 'X') return -10;
    return 0;
  }
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function getHardMove(board) {
  let bestVal = -Infinity, bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const val = minimax(board, false, -Infinity, Infinity);
      board[i] = null;
      if (val > bestVal) { bestVal = val; bestMove = i; }
    }
  }
  return bestMove;
}

function getLineStyle(line) {
  const positions = [
    [16.67,16.67],[50,16.67],[83.33,16.67],
    [16.67,50],[50,50],[83.33,50],
    [16.67,83.33],[50,83.33],[83.33,83.33],
  ];
  const [x1,y1] = positions[line[0]];
  const [x2,y2] = positions[line[2]];
  const cx=(x1+x2)/2, cy=(y1+y2)/2;
  const dx=x2-x1, dy=y2-y1;
  const length = Math.sqrt(dx*dx+dy*dy)+18;
  const angle = Math.atan2(dy,dx)*180/Math.PI;
  return { left:`${cx}%`, top:`${cy}%`, width:`${length}%`, transform:`translate(-50%,-50%) rotate(${angle}deg)` };
}

const DIFFICULTIES = ['EASY','MEDIUM','HARD'];

export default function VsComputer({ onBack, stopMusic, startMusic }) {
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player:0, ai:0, draw:0 });
  const [thinking, setThinking] = useState(false);
  const { click, placeX, placeO, win, lose, draw } = useSound();

  const resetBoard = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setResult(null);
    setThinking(false);
  }, []);

  useEffect(() => {
    if (!difficulty || isPlayerTurn || result) return;
    setThinking(true);
    const delay = difficulty === 'EASY' ? 400 : difficulty === 'MEDIUM' ? 600 : 800;
    const timer = setTimeout(() => {
      setBoard(prev => {
        const next = [...prev];
        let move;
        if (difficulty === 'EASY')   move = getEasyMove(next);
        if (difficulty === 'MEDIUM') move = getMediumMove(next);
        if (difficulty === 'HARD')   move = getHardMove([...next]);
        if (move === undefined || move === -1) return prev;
        next[move] = 'O';
        placeO();
        const res = checkWinner(next);
        if (res) {
          setResult(res);
          if (res.winner === 'O') lose();
          else if (res.winner === 'draw') draw();
          setScore(s => ({ ...s, ai: res.winner==='O'?s.ai+1:s.ai, draw: res.winner==='draw'?s.draw+1:s.draw }));
        } else {
          setIsPlayerTurn(true);
        }
        setThinking(false);
        return next;
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlayerTurn, difficulty, result, placeO, lose, draw]);

  function handleCell(i) {
    if (!isPlayerTurn || board[i] || result || thinking) return;
    const next = [...board];
    next[i] = 'X';
    placeX();
    const res = checkWinner(next);
    setBoard(next);
    if (res) {
      setResult(res);
      if (res.winner === 'X') win();
      else if (res.winner === 'draw') draw();
      setScore(s => ({ ...s, player: res.winner==='X'?s.player+1:s.player, draw: res.winner==='draw'?s.draw+1:s.draw }));
    } else {
      setIsPlayerTurn(false);
    }
  }

  if (!difficulty) {
    return (
      <div className="vc-wrapper">
        <div className="grid-bg" aria-hidden="true" />
        <div className="corner corner-tl"/><div className="corner corner-tr"/>
        <div className="corner corner-bl"/><div className="corner corner-br"/>
        <div className="vc-panel">
        <p className="vc-label1">🤖</p>
          <p className="vc-label">VS COMPUTER</p>
          <h2 className="vc-pick-title">SELECT DIFFICULTY</h2>
          <div className="vc-diff-group">
            {DIFFICULTIES.map(d => (
              <button key={d} className={`btn vc-diff-btn vc-diff-${d.toLowerCase()}`}
                onClick={() => { click(); setDifficulty(d); }}>
                {d==='EASY'&&'😊 '}{d==='MEDIUM'&&'😤 '}{d==='HARD'&&'💀 '}{d}
              </button>
            ))}
          </div>
          <button className="btn btn-tertiary vc-back" onClick={() => { click(); onBack(); }}>- BACK -</button>
        </div>
      </div>
    );
  }

  const statusMsg = result
    ? result.winner==='draw' ? "IT'S A DRAW!" : result.winner==='X' ? 'YOU WIN!' : 'AI WINS!'
    : thinking ? '🤖 THINKING...' : isPlayerTurn ? '▶ YOUR TURN (X)' : '';

  return (
    <div className="vc-wrapper">
      <div className="grid-bg" aria-hidden="true" />
      <div className="corner corner-tl"/><div className="corner corner-tr"/>
      <div className="corner corner-bl"/><div className="corner corner-br"/>
      <div className="vc-panel">
        <div className="vc-header">
          <button className="btn btn-tertiary vc-back-sm" onClick={() => { click(); onBack(); }}>❮</button>
          <p className="vc-label">VS COMPUTER</p>
          <span className={`vc-badge vc-badge-${difficulty.toLowerCase()}`}>{difficulty}</span>
        </div>
        <div className="vc-scoreboard">
          <div className="vc-score-item"><span className="vc-score-name">YOU</span><span className="vc-score-num player">{score.player}</span></div>
          <div className="vc-score-item"><span className="vc-score-name">DRAW</span><span className="vc-score-num draw">{score.draw}</span></div>
          <div className="vc-score-item"><span className="vc-score-name">AI</span><span className="vc-score-num ai">{score.ai}</span></div>
        </div>
        <p className={`vc-status ${result?(result.winner==='X'?'win':result.winner==='draw'?'draw':'lose'):''}`}>{statusMsg}</p>
        <div className={`vc-board ${thinking?'thinking':''}`}>
          {result && result.line.length>0 && <div className="vc-win-line" style={getLineStyle(result.line)} />}
          {board.map((cell,i) => (
            <button key={i}
              className={`vc-cell ${cell?`vc-cell-${cell.toLowerCase()}`:''} ${!cell&&isPlayerTurn&&!result?'hoverable':''}`}
              onClick={() => handleCell(i)}
              disabled={!!cell||!isPlayerTurn||!!result}>
              {cell}
            </button>
          ))}
        </div>
        <div className="vc-actions">
          <button className="btn btn-secondary vc-action-btn" onClick={() => { click(); resetBoard(); }}>↺ REMATCH</button>
          <button className="btn btn-tertiary vc-action-btn" onClick={() => { click(); setDifficulty(null); resetBoard(); }}>⚙ CHANGE</button>
        </div>
      </div>
    </div>
  );
}
