import { Container, Row, Col} from 'react-bootstrap';
import Slider from '../components/home/Slider';
import 'leaflet/dist/leaflet.css';
import TchMap from '../components/tch/TchMap';

const PrediccionTchPage = () => {
  const slides = [
    {
      image: '/slider4.webp',
      title: 'Modelo para predecir el TCH',
      description: 'Con datos históricos, predecimos como serán las plantaciones futuras',
    },
  ];

  return (
    <div>
      <Slider slides={slides} />
      <Container>
        <Row className="my-5 justify-content-center">
          <Col className="centered" sm={12} xl={8}>
            <h1>Predicción de Toneladas de Caña Por Hectárea</h1>
            <p>
              Sistema de IA que pronostica la producción de toneladas de caña por hectárea. Utiliza algoritmos avanzados y datos históricos para optimizar la planificación y gestión de cosechas.
            </p>
          </Col>
        </Row>
        <Row className="my-5 justify-content-center">
          <Col className="centered" sm={11} xl={10}>
            <TchMap />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrediccionTchPage;
