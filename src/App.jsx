import { useState, useEffect } from 'react';
import Loading from './components/Loading';
import MainMenu from './components/MainMenu';

// Key stored in sessionStorage (cleared when tab closes, persists on refresh)
const SESSION_KEY = 'np_loaded';

function App() {
  // If sessionStorage already has the key → skip loading (page refresh)
  // If not → show loading (first visit or tab reopened)
  const [loaded, setLoaded] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  function handleLoadingDone() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setLoaded(true);
  }

  if (!loaded) {
    return <Loading onDone={handleLoadingDone} />;
  }

  return <MainMenu />;
}

export default App;
