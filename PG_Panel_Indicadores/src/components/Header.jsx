import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
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
            <Col xs={12} md={3}>
              <img
                src="/Logo-Pantaleon.png"
                alt="Brand Image"
                className={`brand-image ${isSticky ? '' : 'white-filter'}`}
              />
            </Col>
            <Col xs={12} md={6} className="d-flex justify-content-end">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                <Nav className="ml-auto">
                  <Nav.Link href="/">Inicio</Nav.Link>
                  <Nav.Link href="/about">Acerca de</Nav.Link>
                  <Nav.Link href="/contact">Contacto</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Col>
            <Col xs={12} md={3} className="d-flex justify-content-end">
              <div className={`redes ${isSticky ? 'redes-sticky' : ''}`}>
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faTiktok } /></a>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
