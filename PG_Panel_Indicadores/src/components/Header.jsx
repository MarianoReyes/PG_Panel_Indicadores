import { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, NavDropdown, Modal, Button } from 'react-bootstrap';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = ({ isAuthenticated, onLogout }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleScroll = () => {
    setIsSticky(window.scrollY > 50);
  };

  const handleLogout = () => {
    setShowLogoutModal(true); 
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);    
    onLogout();   
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); 
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`header ${isSticky ? 'sticky' : ''}`}>
        <Navbar expand="lg" className="navbar">
          <Container>
            <Row className="align-items-center w-100">
              {/* Logo y Botón del menú */}
              <Col xs={6} md={3} className="d-flex align-items-center order-md-1">
                <img
                  src="/Logo-Pantaleon.webp"
                  alt="Brand Image"
                  className={`brand-image ${isSticky ? '' : 'white-filter'}`}
                />
              </Col>
              
              <Col xs={6} className="d-flex justify-content-end d-lg-none order-2">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
              </Col>

              {/* Redes Sociales en móviles */}
              <Col xs={12} className="d-flex justify-content-center mt-2 mb-2 order-3 d-lg-none redes-container">
                <div className={`redes ${isSticky ? 'redes-sticky' : ''}`}>
                  <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                  <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                  <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      isAuthenticated ? handleLogout() : window.location.href = '/login';
                    }}
                    className="ml-2"
                    title={isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                  >
                    <FontAwesomeIcon icon={isAuthenticated ? faSignOutAlt : faUser} />
                  </a>
                </div>
              </Col>

              {/* Menú de Navegación */}
              <Col xs={12} md={6} className="order-4 order-md-2">
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="w-100 justify-content-lg-center">
                    <Nav.Link href="/">Inicio</Nav.Link>
                    <NavDropdown title="Modelos" id="basic-nav-dropdown">
                      <NavDropdown.Item href="/deteccion_enfermedades">Detección de Enfermedades</NavDropdown.Item>
                      <NavDropdown.Item href="/prediccion_tch">Predicción TCH</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/api">API</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Col>

              {/* Redes Sociales en pantallas grandes */}
              <Col md={3} className="d-none d-lg-flex justify-content-end order-md-3 redes-container">
                <div className={`redes ${isSticky ? 'redes-sticky' : ''}`}>
                  <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                  <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                  <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      isAuthenticated ? handleLogout() : window.location.href = '/login';
                    }}
                    className="ml-2"
                    title={isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                  >
                    <FontAwesomeIcon icon={isAuthenticated ? faSignOutAlt : faUser} />
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </Navbar>
      </header>

      {/* Modal de Confirmación de Cerrar Sesión */}
      <Modal show={showLogoutModal} onHide={cancelLogout}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cierre de Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelLogout}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmLogout} 
            style={{ backgroundColor: '#fe7018', borderColor: '#fe7018' }}
          >
            Cerrar Sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
