import { useState, useEffect } from 'react';
import Joyride, { EVENTS, STATUS } from 'react-joyride';
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
      image: '/slider2.webp',
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

  const enfermedadDescriptions = {
    "Chinche salivosa": "La chinche salivosa es un insecto que afecta severamente a la caña de azúcar al alimentarse de su savia...",
    "Roya naranja": "La roya naranja es una enfermedad fúngica causada por el hongo Puccinia kuehnii, que provoca manchas anaranjadas...",
    "Roya purpura": "La roya púrpura, causada por el hongo Puccinia melanocephala, produce manchas de color púrpura o marrón...",
    "Clorosis": "La clorosis es un trastorno fisiológico que se presenta cuando la caña de azúcar no recibe suficiente hierro..."
  };
  

  const handlePredict = async () => {
    if (!image) {
      alert("Por favor, sube una imagen antes de detectar enfermedades.");
      return;
    }
  
    try {
      // Convertir base64 a blob para enviar como archivo jpg
      const byteString = atob(image.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
  
      // Crear un FormData y agregar el archivo con clave 'file'
      const formData = new FormData();
      formData.append('file', blob, 'planta.jpg'); // cambiando la clave a 'file'
  
      const response = await fetch("https://api.agrointelligence.online/models/eagawesome/predict", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error al realizar la predicción:", error);
    }
  };
  
  
  const steps = [
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
    const { type, status } = data;

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
            spotlightShadow: '0 0 15px rgba(254, 112, 24, 0.4)'
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
              <Col sm={12} xl={4}>
                <label htmlFor="upload" className='upload-image button-page-2'>
                  Cargar imagen
                  <input
                    id="upload"
                    type="file"
                    onChange={loadImage}
                    style={{ display: 'none' }}
                  />
                </label>
              </Col>
              <Col sm={12} xl={4} >
                <Button className="button-page" onClick={handlePredict}>Detectar Enfermedad</Button>
              </Col>
              <Col sm={12} xl={4} >
                {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%', height: '400px' }} />}
              </Col>  
            </Row>
            <Row className='my-5'>   
              <Col sm={12} xl={12}>
                {prediction && <p>Predicción: {JSON.stringify(prediction)}</p>}
                <p>{enfermedadDescriptions[prediction]}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeteccionEnfermedadesPage;
