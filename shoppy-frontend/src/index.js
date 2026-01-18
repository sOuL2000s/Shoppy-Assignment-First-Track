import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// REMOVE: import { CartProvider } from './context/CartContext'; // <-- REMOVE THIS LINE IF PRESENT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Only render App here */}
    <App /> 
  </React.StrictMode>
);