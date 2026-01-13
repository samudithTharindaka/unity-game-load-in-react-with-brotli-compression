import React, { useRef, useState } from 'react';
import UnityPlayer from './components/UnityPlayer';
import UnityDebugger from './components/UnityDebugger';
import './App.css';

function App() {
  const unityInstanceRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleUnityLoaded = (unityInstance) => {
    unityInstanceRef.current = unityInstance;
    console.log('Unity game loaded successfully!');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        if (unityInstanceRef.current) {
          unityInstanceRef.current.SetFullscreen(1);
        }
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Unity WebGL Game</h1>
        <button 
          className="fullscreen-button" 
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen (F11)"}
        >
          {isFullscreen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          )}
          <span className="button-text">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </span>
        </button>
      </header>
      
      <main className="game-container">
        <UnityPlayer onLoaded={handleUnityLoaded} />
      </main>
      
      <footer className="app-footer">
        <p>Press F11 or click the fullscreen button for the best experience</p>
      </footer>
      
      <UnityDebugger />
    </div>
  );
}

export default App;


