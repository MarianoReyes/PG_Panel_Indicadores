import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import Slider from '../components/home/Slider';

const DeteccionEnfermedadesPage = () => {
  const slides = [
    {
      image: '/slider2.jpg',
      title: 'Modelo para la detección de enfermedades en la caña',
      description: 'Con datos recogidos en campo, mostramos las enfermedades que afectan'
    }
  ];

  return (
    <div>
      <Slider slides={slides} />
      <Container>
        <Row className="my-5 justify-content-center">
          <Col className="centered" sm={12} xl={8}>
            <p>
            Modelo de IA que detecta enfermedades en caña de azúcar mediante 
            análisis de imágenes, permitiendo diagnóstico temprano y manejo eficiente de cultivos.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeteccionEnfermedadesPage;
