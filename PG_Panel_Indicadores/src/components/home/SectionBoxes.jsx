import { Container, Row, Col } from 'react-bootstrap';
import Box from './Box';
import './SectionBoxes.css';

const SectionBoxes = () => {
  return (
    <div className="section-boxes">
      <Container>
        <Row className='my-5 py-5'>
          <Col sm={12} xl={4}>
            <Box 
            title="Detección de Enfermedades en Plantas" 
            text="Modelo de IA que detecta enfermedades en caña de azúcar mediante 
            análisis de imágenes, permitiendo diagnóstico temprano y manejo eficiente de cultivos." 
            link="/deteccion_enfermedades"/>
          </Col>
          <Col sm={12} xl={4}>
            <Box 
            title="Predicción de TCH" 
            text="Sistema de IA que pronostica la producción de 
            toneladas de caña por hectárea. Utiliza algoritmos avanzados y datos 
            históricos para optimizar la planificación y gestión de cosechas." 
            link="/prediccion_tch"/>
          </Col>
          <Col sm={12} xl={4}>
            <Box 
            title="API" 
            text="Proporciona acceso unificado a datos del cultivo de caña. 
            Centraliza información de rendimiento, enfermedades y predicciones, 
            facilitando la integración y análisis para optimizar la producción." 
            link="/api"/>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SectionBoxes;
