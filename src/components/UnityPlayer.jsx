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
        // Use relative paths like Unity's original index.html
        // Unity expects paths relative to where the build is served from
        const buildUrl = process.env.PUBLIC_URL + '/unity/buildAds32/Build';
        const loaderUrl = buildUrl + '/buildAds32.loader.js';
        // StreamingAssets should be relative to buildAds32 folder, not absolute
        // Unity resolves this relative to the build root
        const streamingAssetsUrl = process.env.PUBLIC_URL + '/unity/buildAds32/StreamingAssets';

        const config = {
          dataUrl: buildUrl + '/buildAds32.data.br',
          frameworkUrl: buildUrl + '/buildAds32.framework.js.br',
          codeUrl: buildUrl + '/buildAds32.wasm.br',
          streamingAssetsUrl: streamingAssetsUrl,
          companyName: 'DefaultCompany',
          productName: 'ads poc',
          productVersion: '0.1', // Match Unity's version
          showBanner: (msg, type) => {
            console.log(`Unity Banner [${type}]:`, msg);
            if (type === 'error') {
              setError(msg);
              console.error('Unity Error:', msg);
            } else if (type === 'warning') {
              console.warn('Unity Warning:', msg);
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
                console.error('Unity Instance Creation Failed:', message);
                setError(`Failed to create Unity instance: ${message}`);
                setIsLoading(false);
              });
          }
        };

        script.onerror = (error) => {
          console.error('Failed to load Unity loader script:', error);
          setError(`Failed to load Unity loader script from: ${loaderUrl}`);
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
              backgroundImage: `url(${process.env.PUBLIC_URL}/unity/buildAds32/TemplateData/unity-logo-dark.png)`
            }}
          ></div>
          <div 
            className="unity-progress-bar-empty"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/unity/buildAds32/TemplateData/progress-bar-empty-dark.png)`
            }}
          >
            <div 
              className="unity-progress-bar-full" 
              style={{ 
                width: `${loadingProgress}%`,
                backgroundImage: `url(${process.env.PUBLIC_URL}/unity/buildAds32/TemplateData/progress-bar-full-dark.png)`
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

