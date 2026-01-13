import React, { useEffect, useState } from 'react';

const UnityDebugger = () => {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Capture console errors
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    console.error = (...args) => {
      setErrors(prev => [...prev, { time: new Date().toLocaleTimeString(), message: args.join(' ') }]);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      setWarnings(prev => [...prev, { time: new Date().toLocaleTimeString(), message: args.join(' ') }]);
      originalWarn.apply(console, args);
    };

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('Unity') || message.includes('Addressables') || message.includes('Build')) {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
      }
      originalLog.apply(console, args);
    };

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      setErrors(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: `${event.message} at ${event.filename}:${event.lineno}` 
      }]);
    });

    // Capture promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      setErrors(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: `Unhandled Promise Rejection: ${event.reason}` 
      }]);
    });

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: '400px',
      maxHeight: '300px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: '#fff',
      padding: '10px',
      fontSize: '11px',
      overflowY: 'auto',
      zIndex: 10000,
      fontFamily: 'monospace',
      borderTop: '2px solid #333',
      borderLeft: '2px solid #333'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#0f0' }}>
        🐛 Unity Debug Console
      </div>
      
      {errors.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ color: '#f44', fontWeight: 'bold', marginBottom: '5px' }}>
            Errors ({errors.length}):
          </div>
          {errors.slice(-5).map((err, i) => (
            <div key={i} style={{ color: '#f44', marginBottom: '3px', wordBreak: 'break-word' }}>
              [{err.time}] {err.message}
            </div>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ color: '#ff4', fontWeight: 'bold', marginBottom: '5px' }}>
            Warnings ({warnings.length}):
          </div>
          {warnings.slice(-3).map((warn, i) => (
            <div key={i} style={{ color: '#ff4', marginBottom: '3px', wordBreak: 'break-word' }}>
              [{warn.time}] {warn.message}
            </div>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div>
          <div style={{ color: '#4ff', fontWeight: 'bold', marginBottom: '5px' }}>
            Unity Logs ({logs.length}):
          </div>
          {logs.slice(-5).map((log, i) => (
            <div key={i} style={{ color: '#4ff', marginBottom: '3px', wordBreak: 'break-word' }}>
              [{log.time}] {log.message}
            </div>
          ))}
        </div>
      )}

      {errors.length === 0 && warnings.length === 0 && logs.length === 0 && (
        <div style={{ color: '#888', fontStyle: 'italic' }}>
          No errors or Unity logs yet...
        </div>
      )}
    </div>
  );
};

export default UnityDebugger;


