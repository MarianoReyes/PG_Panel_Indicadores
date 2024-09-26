import { Container, Row, Col, Accordion } from 'react-bootstrap';
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
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>¿Cómo usar los datos?</Accordion.Header>
                <Accordion.Body>
                  <h5>Descargar Datos</h5>
                  <p>
                    Haz clic en el botón &quot;Descargar Datos&quot; para obtener un archivo CSV con los datos de cultivo de caña.
                  </p>
                  <h5>Usar Datos por URL</h5>
                  <p>
                    Puedes acceder a los datos mediante la URL proporcionada. Usa la siguiente URL para obtener los datos:
                  </p>
                  <code>https://api.datacenter.com</code>
                  <p>
                    Aquí tienes un ejemplo de cómo usar esta URL en tu aplicación:
                  </p>
                  <pre>
                    <code>
                      {`fetch('https://api.datacenter.com')
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.error('Error:', error));`}
                    </code>
                  </pre>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        <Row className="my-5 justify-content-center">
          <Col sm={12} xl={8} className='text-center'>
            <a className='button' href="/path/to/your/data.csv" download>
              Descargar Datos
            </a>
            <a className='button ml-3' href="#" target="_blank">
              Usar Datos por URL
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ApiPage;
