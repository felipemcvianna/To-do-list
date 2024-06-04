import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importe BrowserRouter e outros componentes de roteamento
import App from './App'; // Importe o componente App
import HomePage from './HomePage'; // Importe o componente HomePage

ReactDOM.render(
  <React.StrictMode>
    <Router> {/* Envolve o aplicativo com BrowserRouter */}
      <Routes> {/* Defina suas rotas dentro do componente Routes */}
        <Route path="/" element={<App />} /> {/* Rota para o componente App */}
        <Route path="/HomePage" element={<HomePage />} /> {/* Rota para o componente HomePage */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
