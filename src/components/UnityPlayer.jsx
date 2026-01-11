import React, { useEffect, useRef, useState } from 'react';
import './UnityPlayer.css';

const UnityPlayer = ({ onLoaded }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const unityInstanceRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUnityGame = async () => {
      try {
        const canvas = canvasRef.current;
        const buildUrl = process.env.PUBLIC_URL + '/Build11/Build';
        const loaderUrl = buildUrl + '/Build11.loader.js';

        const config = {
          dataUrl: buildUrl + '/Build11.data.br',
          frameworkUrl: buildUrl + '/Build11.framework.js.br',
          codeUrl: buildUrl + '/Build11.wasm.br',
          streamingAssetsUrl: 'StreamingAssets',
          companyName: 'DefaultCompany',
          productName: 'My project (1)',
          productVersion: '0.1.0',
          showBanner: (msg, type) => {
            if (type === 'error') {
              setError(msg);
            } else if (type === 'warning') {
              console.warn(msg);
            }
          },
        };

        // Load the Unity loader script
        const script = document.createElement('script');
        script.src = loaderUrl;
        script.async = true;

        script.onload = () => {
          if (window.createUnityInstance) {
            window.createUnityInstance(canvas, config, (progress) => {
              setLoadingProgress(Math.round(progress * 100));
            })
              .then((unityInstance) => {
                unityInstanceRef.current = unityInstance;
                setIsLoading(false);
                if (onLoaded) {
                  onLoaded(unityInstance);
                }
              })
              .catch((message) => {
                setError(message);
                setIsLoading(false);
              });
          }
        };

        script.onerror = () => {
          setError('Failed to load Unity loader script');
          setIsLoading(false);
        };

        document.body.appendChild(script);

        // Cleanup
        return () => {
          if (unityInstanceRef.current) {
            unityInstanceRef.current.Quit();
          }
          if (script.parentNode) {
            document.body.removeChild(script);
          }
        };
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadUnityGame();
  }, [onLoaded]);

  return (
    <div className="unity-player-container" ref={containerRef}>
      <canvas 
        ref={canvasRef} 
        id="unity-canvas" 
        className="unity-canvas"
        tabIndex="-1"
      />
      
      {isLoading && (
        <div className="unity-loading-bar">
          <div 
            className="unity-logo"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/Build11/TemplateData/unity-logo-dark.png)`
            }}
          ></div>
          <div 
            className="unity-progress-bar-empty"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/Build11/TemplateData/progress-bar-empty-dark.png)`
            }}
          >
            <div 
              className="unity-progress-bar-full" 
              style={{ 
                width: `${loadingProgress}%`,
                backgroundImage: `url(${process.env.PUBLIC_URL}/Build11/TemplateData/progress-bar-full-dark.png)`
              }}
            ></div>
          </div>
          <div className="unity-loading-text">{loadingProgress}%</div>
        </div>
      )}
      
      {error && (
        <div className="unity-error">
          <p>Error loading Unity game:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default UnityPlayer;

