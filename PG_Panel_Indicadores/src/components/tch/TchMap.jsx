import  { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';
import { Oval } from 'react-loader-spinner';
import L from 'leaflet';
import './tchmap.css';
import ColorScaleBar from './colorScale';

proj4.defs('EPSG:32615', '+proj=utm +zone=15 +datum=WGS84 +units=m +no_defs');

// const convertUTMToLatLng = (coordinates) => {
//   return coordinates.map((polygon) =>
//     polygon.map((point) => {
//       if (Array.isArray(point) && point.length === 2 && isFinite(point[0]) && isFinite(point[1])) {
//         try {
//           return proj4('EPSG:32615', 'EPSG:4326', point);
//         } catch (error) {
//           return point;
//         }
//       } else {
//         return point;
//       }
//     })
//   );
// };

const getColorFromTCH = (value, minTCH, maxTCH) => {
  if (minTCH === maxTCH) {
    return '#ffe5b4';
  }
  if (isNaN(value)) {
    return 'rgb(200, 200, 200)';
  }
  const ratio = (value - minTCH) / (maxTCH - minTCH);
  const colorDark = { r: 255, g: 229, b: 180 };
  const colorLight = { r: 204, g: 85, b: 0 };
  const red = Math.floor(colorLight.r * (1 - ratio) + colorDark.r * ratio);
  const green = Math.floor(colorLight.g * (1 - ratio) + colorDark.g * ratio);
  const blue = Math.floor(colorLight.b * (1 - ratio) + colorDark.b * ratio);
  return `rgb(${red}, ${green}, ${blue})`;
};

const CenterPolygon = ({ feature }) => {
  const map = useMap();

  useEffect(() => {
    if (feature) {
      const coordinates = feature.geometry.coordinates[0];
      const bounds = L.latLngBounds(coordinates.map(coord => [coord[1], coord[0]]));
      map.fitBounds(bounds);
      setTimeout(() => {
        const currentZoom = map.getZoom();
        map.setZoom(currentZoom - 1);
      }, 100);
    }
  }, [feature, map]);

  return null;
};

const TchMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [minTCH, setMinTCH] = useState(null);
  const [maxTCH, setMaxTCH] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTCH, setSelectedTCH] = useState('TCHPRED_6Meses');
  const [searchId, setSearchId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_URL_PREDICCION_TCH, {
          method: 'GET',
        });
        const data = await response.json();

        const transformedData = {
          ...data,
          features: data.features.map((feature) => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: (feature.geometry.coordinates),
            },
          })),
        };
        const tchValues = data.features
          .map((feature) => parseFloat(feature.properties[selectedTCH]))
          .filter((value) => !isNaN(value));
        setMinTCH(Math.min(...tchValues));
        setMaxTCH(Math.max(...tchValues));
        setGeoData(transformedData);
        setLoading(false);
        const swappedData = {
          ...transformedData,
          features: transformedData.features.map((feature) => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: swapLatLngInCoordinates(feature.geometry.coordinates),
            },
          })),
        };
        const blob = new Blob([JSON.stringify(swappedData)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } catch (error) {
        console.error('Error al cargar los datos GeoJSON:', error);
        setLoading(false);
      }
    };
    fetchGeoData();
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [selectedTCH]);

  const swapLatLngInCoordinates = (coordinates) => {
    return coordinates.map((polygon) =>
      polygon.map((point) => (Array.isArray(point) && point.length === 2 ? [point[1], point[0]] : point))
    );
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.id && feature.properties[selectedTCH]) {
      const tchValue = parseFloat(feature.properties[selectedTCH]);
      const tchValueFormatted = isNaN(tchValue) ? 'N/A' : tchValue.toFixed(3);
      layer.bindTooltip(`ID: ${feature.properties.id}<br>${selectedTCH}: ${tchValueFormatted}`, { permanent: false });
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({ weight: 5, color: '#666', fillOpacity: 0.7 });
        },
        mouseout: (e) => {
          const layer = e.target;
          const tchValue = parseFloat(feature.properties[selectedTCH]);
          layer.setStyle({ weight: 2, color: getColorFromTCH(tchValue, minTCH, maxTCH), fillOpacity: 0.5 });
        },
      });
    }
  };

  const style = (feature) => {
    const tchValue = parseFloat(feature.properties[selectedTCH]);
    if (!isNaN(tchValue)) {
      return { weight: 2, color: getColorFromTCH(tchValue, minTCH, maxTCH), fillOpacity: 0.5 };
    }
    return { weight: 2, color: '#ccc', fillOpacity: 0.5 };
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleSearch = () => {
    if (!geoData || !searchId) {
      console.error("Los datos no están listos o no hay un ID para buscar.");
      return;
    }
    const cleanSearchId = searchId.trim().toUpperCase();
    const feature = geoData.features.find((f) => f.properties.id && f.properties.id.trim().toUpperCase() === cleanSearchId);
    if (feature) {
      setSelectedFeature(feature);
    } else {
      setErrorMessage(`No se encontró un polígono con el ID proporcionado: ${cleanSearchId}`);
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <Row className="mb-5 w-100">
        <Col className='sidebar' sm={11} xl={3}>
          <h4>Mapa de Predicción de TCH</h4>
          <h5 className='mt-4'>Filtrar por predicción</h5>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {['2', '4', '6', '8'].map(month => (
              <li key={month}>
                <label>
                  <input
                    type="radio"
                    value={`TCHPRED_${month}Meses`}
                    checked={selectedTCH === `TCHPRED_${month}Meses`}
                    onChange={() => { setLoading(true); setSelectedTCH(`TCHPRED_${month}Meses`); }}
                  />{' '}
                  TCH Predicción a {month} Meses
                </label>
              </li>
            ))}
          </ul>
          <h5 className='mt-4'>Buscar por ID de Parcela</h5>
          <div className='d-flex'>
            <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Ingrese el ID" className='inputsidebar' />
            <button style={{ width: '30%' }} className='button' onClick={handleSearch}>Buscar</button>
          </div>
          <h5 className='mt-4'>Descargar GeoJSON</h5>
          {downloadUrl && (
            <a href={downloadUrl} download="transformed_data.geojson">
              <button className='button'>Descargar GeoJSON</button>
            </a>
          )}
          <div className='mt-4'></div>
          <ColorScaleBar minTCH={minTCH} maxTCH={maxTCH} steps={20} />
        </Col>

        <Col sm={11} xl={9}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
              <Oval height={80} width={80} color="#fe7018" ariaLabel="loading" />
            </div>
          ) : (
            <MapContainer center={[14.305, -90.785]} zoom={9} style={{ height: '500px', width: '100%' }}>
              {selectedFeature && <CenterPolygon feature={selectedFeature} />}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {geoData && minTCH !== null && maxTCH !== null && (
                <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
              )}
            </MapContainer>
          )}
        </Col>
      </Row>
      <Modal show={showErrorModal} onHide={closeErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error de Búsqueda</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeErrorModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TchMap;
