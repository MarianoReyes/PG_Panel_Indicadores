import React from 'react';
import { Container } from 'react-bootstrap';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="bg-orange text-white text-center py-3">
      <Container>
        <p>&copy; 2024 AgroIntelligence. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
};

export default Footer;
