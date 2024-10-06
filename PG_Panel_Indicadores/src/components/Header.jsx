import { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>
      <Navbar expand="lg" className="navbar">
        <Container>
          <Row className="w-100">
            <Col xs={6} md={3} className="order-md-1">
              <img
                src="/Logo-Pantaleon.webp"
                alt="Brand Image"
                className={`brand-image ${isSticky ? '' : 'white-filter'}`}
              />
            </Col>
            <Col xs={6} md={3} className="order-md-3 d-flex justify-content-end">
              <div className={`redes ${isSticky ? 'redes-sticky' : ''}`}>
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
              </div>
            </Col>
            <Col xs={12} md={6} className="order-md-2 d-flex justify-content-end">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className="ml-auto">
                  <Nav.Link href="/">Inicio</Nav.Link>
                  <Nav.Link href="/api">API</Nav.Link>
                  <NavDropdown title="Modelos" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/deteccion_enfermedades">Detección de Enfermedades</NavDropdown.Item>
                    <NavDropdown.Item href="/prediccion_tch">Predicción TCH</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="/contact">Contacto</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
