import { Container, Row, Col } from 'react-bootstrap';
import Slider from '../components/home/Slider';
import './ApiPage.css';


const ApiPage = () => {
  const slides = [
    {
      image: '/slider1.webp',
      title: 'API para el consumo de datos',
      description: 'Todos los datos centralizados en una sola solución'
    }
  ];

  return (
    <div>
      <Slider slides={slides} />
      <Container>
        <Row className="my-5 justify-content-center">
          <Col className="centered" sm={12} xl={8}>
            <p>
              Proporciona acceso unificado a datos del cultivo de caña. 
              Centraliza información de rendimiento, enfermedades y predicciones, 
              facilitando la integración y análisis para optimizar la producción.
            </p>
          </Col>
        </Row>
        <Row className="my-5 justify-content-center">
          <Col sm={12} xl={8}>
            <embed className='w-100 api' src="https://api.agrointelligence.online/docs"></embed>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ApiPage;
