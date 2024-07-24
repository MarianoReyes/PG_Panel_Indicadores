import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import Slider from '../components/home/Slider';

const PrediccionTchPage = () => {
  const slides = [
    {
      image: '/slider4.jpg',
      title: 'Modelo para predecir el TCH',
      description: 'Con datos históricos, predecimos como serán las plantaciones futuras'
    }
  ];

  return (
    <div>
      <Slider slides={slides} />
      <Container>
        <Row className="my-5 justify-content-center">
          <Col className="centered" sm={12} xl={8}>
            <h1>Predicción de TCH</h1>
            <p>
            Sistema de IA que pronostica la producción de 
            toneladas de caña por hectárea. Utiliza algoritmos avanzados y datos 
            históricos para optimizar la planificación y gestión de cosechas.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrediccionTchPage;
