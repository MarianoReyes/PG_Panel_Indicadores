import { Container, Row, Col} from 'react-bootstrap';
import './Explanation.css'

const Explanation = () => {
  return (
    <Container>
        <Row className='my-5 py-5'>
            <Col className='centered' sm={12} xl={6}>
                <h2>¿Qué hacemos en esta página?</h2>
                <p>
                Se implementan modelos de IA, visión por computadora, 
                predicción y una API para recolección de datos. 
                </p>
                <p>
                Explora aplicaciones prácticas de inteligencia artificial y análisis de datos.
                </p>
            </Col>
            <Col sm={12} xl={6}>
                <video className='iframe' src="/sugar_cane.mp4" autoPlay muted loop></video>
            </Col>
        </Row>
    </Container>
  );
};

export default Explanation;
