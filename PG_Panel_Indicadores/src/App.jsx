import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ApiPage from './pages/ApiPage';
import DeteccionEnfermedadesPage from './pages/DeteccionEnfermedadesPage';
import DeteccionEnfermedadesNolayoutPage from './pages/DeteccionEnfermedadesNolayoutPage';
import PrediccionTchPage from './pages/PrediccionTchPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Routes>
        {/* Ruta sin Layout */}
        <Route
          path="/deteccion_enfermedades_nolayout"
          element={<DeteccionEnfermedadesNolayoutPage />}
        />

        {/* Rutas con Layout */}
        <Route element={<Layout isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
