import React from 'react';
import { createRoot } from 'react-dom/client';
import './firebase';
import App from './App';
import './style.css';

createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
);
