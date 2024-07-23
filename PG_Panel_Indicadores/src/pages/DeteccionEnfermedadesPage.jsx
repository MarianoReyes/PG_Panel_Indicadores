import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';

const DeteccionEnfermedadesPage = () => {
  return (
    <Container>
      <Row className="my-5 justify-content-center">
        <Col className="centered" sm={12} xl={8}>
          <h1>Detección de Enfermedades en Plantas</h1>
          <p>
          Modelo de IA que detecta enfermedades en caña de azúcar mediante 
          análisis de imágenes, permitiendo diagnóstico temprano y manejo eficiente de cultivos.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default DeteccionEnfermedadesPage;
