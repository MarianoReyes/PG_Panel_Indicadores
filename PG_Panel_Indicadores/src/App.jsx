import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ApiPage from './pages/ApiPage';
import DeteccionEnfermedadesPage from './pages/DeteccionEnfermedadesPage';
import PrediccionTchPage from './pages/PrediccionTchPage';
import LoginPage from './pages/LoginPage';

function App() {
  // Inicializa el estado directamente desde localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    console.log("Estado de autenticación al cargar App:", isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/api"
            element={
              isAuthenticated ? <ApiPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/deteccion_enfermedades"
            element={
              isAuthenticated ? <DeteccionEnfermedadesPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/prediccion_tch"
            element={
              isAuthenticated ? <PrediccionTchPage /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
