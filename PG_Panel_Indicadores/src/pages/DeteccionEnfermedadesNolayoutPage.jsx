import { useState, useEffect } from 'react';
import Joyride, { EVENTS, STATUS } from 'react-joyride';
import { Container, Row, Col, Button,  Modal } from 'react-bootstrap';
import Slider from '../components/home/Slider';
import './DeteccionEnfermedadesPage.css';

const DeteccionEnfermedadesNolayoutPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [image, setImage] = useState(null);
  const [runTour, setRunTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseErrorModal = () => setShowErrorModal(false);

  useEffect(() => {
    setRunTour(true);
    setTourKey(prevKey => prevKey + 1);
  }, []);

  const loadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const enfermedadDescriptions = {
    "Chinche salivosa": "La chinche salivosa es un insecto que afecta severamente a la caña de azúcar al alimentarse de su savia. Estos insectos se agrupan en grandes cantidades y al succionar los fluidos de la planta, reducen su vigor, lo que puede afectar la calidad y el rendimiento del cultivo. Además, las chinches liberan una sustancia espumosa que puede favorecer el crecimiento de hongos, empeorando la salud de la planta.",
    "Roya naranja": "La roya naranja es una enfermedad fúngica causada por el hongo Puccinia kuehnii, que provoca manchas anaranjadas en las hojas de la caña de azúcar. Estas manchas reducen la capacidad fotosintética de la planta, lo que disminuye su crecimiento y producción. La enfermedad se propaga fácilmente en condiciones de alta humedad y temperaturas cálidas.",
    "Roya purpura": "La roya púrpura, causada por el hongo Puccinia melanocephala, produce manchas de color púrpura o marrón en las hojas de la caña de azúcar, afectando también la capacidad fotosintética de la planta. Esta enfermedad es más prevalente en condiciones húmedas y se propaga rápidamente a través de las esporas transportadas por el viento.",
    "Clorosis": "La clorosis es un trastorno fisiológico que se presenta cuando la caña de azúcar no recibe suficiente hierro o nutrientes esenciales, lo que causa que las hojas se vuelvan amarillentas debido a una deficiencia en clorofila. Esto puede ser resultado de suelos pobres o condiciones de drenaje inadecuadas.",
    "Hoja Sana": "¡Felicidades! Tu hoja está sana, no debemos actuar."
  };
  
  const enfermedadConsejos = {
    "Chinche salivosa": "Para su manejo, es recomendable realizar inspecciones regulares del cultivo y aplicar controles biológicos con depredadores naturales, así como el uso de insecticidas específicos cuando la infestación es grave.",
    "Roya naranja": "Para controlarla, es importante eliminar las plantas afectadas y aplicar fungicidas adecuados. Además, el uso de variedades de caña de azúcar resistentes y la rotación de cultivos pueden reducir la incidencia de esta enfermedad.",
    "Roya purpura": "Para su manejo, se recomienda el uso de fungicidas y la siembra de variedades resistentes. Además, es crucial evitar el riego excesivo y mantener una buena circulación de aire entre las plantas para reducir la humedad.",
    "Clorosis": "Para tratar la clorosis, es fundamental mejorar las condiciones del suelo con fertilizantes ricos en micronutrientes y asegurar un riego adecuado. También, realizar análisis de suelo periódicos ayuda a identificar las deficiencias específicas y a corregirlas de manera oportuna.",
    "Hoja Sana": "¡Sigue así!"
  };

  const handlePredict = async () => {
    if (!image) {
      setErrorMessage("Por favor, sube una imagen antes de detectar enfermedades.");
      setShowErrorModal(true);
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

  return (
    <div>
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
              <Col sm={12} xl={4}>
                {prediction && <div><h3>Predicción: </h3><br></br><h2>{JSON.stringify(prediction)}</h2></div>}
              </Col>

              <Col sm={12} xl={8}>
                {prediction &&
                <div>
                  <h3>Descripción de enfermedad</h3>
                  <p className='text-justify'>{enfermedadDescriptions[prediction]}</p>
                  <br></br>
                  <h3>Consejos para mitigarla</h3>
                  <p className='text-justify'>{enfermedadConsejos[prediction]}</p>
                </div>
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Modal de Error */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeteccionEnfermedadesNolayoutPage;
