import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Slider from '../components/home/Slider';
import './DeteccionEnfermedadesPage.css';

const DeteccionEnfermedadesPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [image, setImage] = useState(null);
  const [runTour, setRunTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);

  useEffect(() => {
    setRunTour(true);
    setTourKey(prevKey => prevKey + 1);
  }, []);

  const slides = [
    {
      image: '/slider2.jpg',
      title: 'Modelo para la detección de enfermedades en la caña',
      description: 'Con datos recogidos en campo, mostramos las enfermedades que afectan'
    }
  ];

  const loadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePredict = async () => {
    return 1;
  };

  const steps = [
    {
      target: '.model-description',
      content: 'Este párrafo describe el modelo de detección de enfermedades en caña de azúcar.',
    },
    {
      target: '.upload-image',
      content: 'Aquí puedes subir la imagen de la caña de azúcar que deseas analizar.',
    },
    {
      target: '.button-page',
      content: 'Haz clic en este botón para comenzar la detección de enfermedades.',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { action, index, type, status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}  
        scrollToFirstStep={true}
        key={tourKey}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#fe7018',  
            textColor: '#333',  
            arrowColor: '#fe7018',  
            spotlightShadow: '0 0 15px rgba(254, 112, 24, 0.4)',  
          },
          buttonClose: {
            color: '#fe7018',  
          },
          buttonNext: {
            backgroundColor: '#fe7018',  
          },
          buttonBack: {
            marginRight: 10,
            color: '#fe7018',  
          }
        }}
      />
      <Slider slides={slides} />
      <Container>
        <Row className="my-5 justify-content-center">
          <Col sm={12} xl={8}>
            <p className="model-description">
              Modelo de IA que detecta enfermedades en caña de azúcar mediante 
              análisis de imágenes, permitiendo diagnóstico temprano y manejo eficiente de cultivos.
            </p>
            <Row className='my-5'>
              <Col sm={12} xl={6}>
                <input type="file" className="upload-image" onChange={loadImage} />
                <Button className="button-page" onClick={handlePredict}>Detectar Enfermedad</Button>
              </Col>
              <Col sm={12} xl={6} >
                {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />}
              </Col>  
            </Row>
            <Row className='my-5'>   
              <Col sm={12} xl={12}>
                {prediction && <p>Predicción: {JSON.stringify(prediction)}</p>}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeteccionEnfermedadesPage;
