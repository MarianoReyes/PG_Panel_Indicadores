import React from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ApiPage from './pages/ApiPage';
import DeteccionEnfermedadesPage from './pages/DeteccionEnfermedadesPage';
import PrediccionTchPage from './pages/PrediccionTchPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/deteccion_enfermedades" element={<DeteccionEnfermedadesPage />} />
          <Route path="/prediccion_tch" element={<PrediccionTchPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
