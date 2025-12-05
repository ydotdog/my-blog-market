import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Mounting App...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Using standard render without StrictMode to prevent potential double-invocation issues in some previewers
root.render(
  <App />
);

console.log("App Mounted successfully.");