import { useState, useRef, useCallback } from 'react';
import Loading from './components/Loading';
import MainMenu from './components/MainMenu';
import { useSound } from './hooks/useSound';

const SESSION_KEY = 'np_loaded';

function App() {
  const [loaded, setLoaded] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const { startMusic, stopMusic } = useSound();

  function handleLoadingDone() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setLoaded(true);
  }

  if (!loaded) return <Loading onDone={handleLoadingDone} />;
  return <MainMenu startMusic={startMusic} stopMusic={stopMusic} />;
}

export default App;
