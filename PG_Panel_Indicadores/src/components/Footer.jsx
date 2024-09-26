import { Container } from 'react-bootstrap';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="bg-orange text-black text-center py-3">
      <Container>
        <p className='text-black mb-0 py-4'>&copy; 2024 AgroIntelligence. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
};

export default Footer;
