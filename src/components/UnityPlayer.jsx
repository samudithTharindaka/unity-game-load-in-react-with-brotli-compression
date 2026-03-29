import React, { useEffect, useRef } from 'react';
import './UnityPlayer.css';

/** WebGL file prefix (e.g. NovaStore-test1.loader.js) */
const UNITY_BUILD_NAME = 'NovaStore-test1';
/** Outer folder under public/unity/ where you placed the build */
const UNITY_HOST_FOLDER = 'NovaStore-test1';
/**
 * Unity often outputs a subfolder with the same name as the build; if you copied that whole
 * folder into public/unity/NovaStore-test1/, assets live at .../NovaStore-test1/NovaStore-test1/
 */
const unityRoot = `${process.env.PUBLIC_URL}/unity/${UNITY_HOST_FOLDER}/${UNITY_BUILD_NAME}`;

const UnityPlayer = ({ onLoaded }) => {
  const canvasRef = useRef(null);
  const unityInstanceRef = useRef(null);
  useEffect(() => {
    const loadUnityGame = async () => {
      try {
        const canvas = canvasRef.current;
        const buildUrl = `${unityRoot}/Build`;
        const loaderUrl = `${buildUrl}/${UNITY_BUILD_NAME}.loader.js`;
        const streamingAssetsUrl = `${unityRoot}/StreamingAssets`;

        const config = {
          dataUrl: `${buildUrl}/${UNITY_BUILD_NAME}.data.br`,
          frameworkUrl: `${buildUrl}/${UNITY_BUILD_NAME}.framework.js.br`,
          codeUrl: `${buildUrl}/${UNITY_BUILD_NAME}.wasm.br`,
          streamingAssetsUrl: streamingAssetsUrl,
          companyName: 'DefaultCompany',
          productName: 'NovaStore',
          productVersion: '0.1',
          showBanner: (msg, type) => {
            if (type === 'error') {
              console.error('Unity:', msg);
            } else if (type === 'warning') {
              console.warn('Unity:', msg);
            }
          },
        };

        const script = document.createElement('script');
        script.src = loaderUrl;
        script.async = true;

        script.onload = () => {
          if (window.createUnityInstance) {
            window.createUnityInstance(canvas, config, () => {})
              .then((unityInstance) => {
                unityInstanceRef.current = unityInstance;
                if (onLoaded) {
                  onLoaded(unityInstance);
                }
              })
              .catch((message) => {
                console.error('Unity instance failed:', message);
              });
          }
        };

        script.onerror = () => {
          console.error('Unity loader failed:', loaderUrl);
        };

        document.body.appendChild(script);

        return () => {
          if (unityInstanceRef.current) {
            unityInstanceRef.current.Quit();
          }
          if (script.parentNode) {
            document.body.removeChild(script);
          }
        };
      } catch (err) {
        console.error(err);
      }
    };

    loadUnityGame();
  }, [onLoaded]);

  return (
    <div className="unity-player-container">
      <canvas ref={canvasRef} id="unity-canvas" className="unity-canvas" tabIndex="-1" />
    </div>
  );
};

export default UnityPlayer;
