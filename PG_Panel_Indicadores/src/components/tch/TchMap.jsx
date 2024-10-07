import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Row, Col } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';
import { Oval } from 'react-loader-spinner'; // Loader
import L from 'leaflet';
import './tchmap.css';
import { useMap } from 'react-leaflet';
import ColorScaleBar from './colorScale'

proj4.defs('EPSG:32615', '+proj=utm +zone=15 +datum=WGS84 +units=m +no_defs');

// Función para convertir coordenadas UTM a latitud-longitud
const convertUTMToLatLng = (coordinates) => {
  return coordinates.map((polygon) =>
    polygon.map((point) => {
      if (
        Array.isArray(point) &&
        point.length === 2 &&
        isFinite(point[0]) &&
        isFinite(point[1])
      ) {
        try {
          return proj4('EPSG:32615', 'EPSG:4326', point);
        } catch (error) {
          return point;
        }
      } else {
        return point;
      }
    })
  );
};

// Función para obtener un color basado en un valor de TCHPRED usando tonos de naranja
const getColorFromTCH = (value, minTCH, maxTCH) => {
  if (minTCH === maxTCH) {
    return '#ffe5b4'; // Naranja claro por defecto
  }

  if (isNaN(value)) {
    return 'rgb(200, 200, 200)'; // Gris para valores no numéricos
  }

  const ratio = (value - minTCH) / (maxTCH - minTCH);

  // Interpolación entre naranja claro y naranja amarronado
  const colorDark = { r: 255, g: 229, b: 180 };   // #cc5500 (naranja amarronado)
  const colorLight = { r: 204, g: 85, b: 0 }; // #ffe5b4 (naranja claro)  

  const red = Math.floor(colorLight.r * (1 - ratio) + colorDark.r * ratio);
  const green = Math.floor(colorLight.g * (1 - ratio) + colorDark.g * ratio);
  const blue = Math.floor(colorLight.b * (1 - ratio) + colorDark.b * ratio);

  return `rgb(${red}, ${green}, ${blue})`;
};

// Componente para centrar el poligono dependiendo de la busqueda
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
  const mapRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null); // Para almacenar el polígono encontrado


  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch('/tch_data/outputv4.geojson');
        const data = await response.json();

        // Transformar las coordenadas de cada feature en el GeoJSON
        const transformedData = {
          ...data,
          features: data.features.map((feature) => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: convertUTMToLatLng(feature.geometry.coordinates),
            },
          })),
        };

        // Obtener el valor mínimo y máximo del predictor seleccionado
        const tchValues = data.features
          .map((feature) => parseFloat(feature.properties[selectedTCH]))
          .filter((value) => !isNaN(value));

        setMinTCH(Math.min(...tchValues));
        setMaxTCH(Math.max(...tchValues));

        setGeoData(transformedData);
        setLoading(false);

        // Crear un Blob y URL para descargar el GeoJSON transformado, intercambiando latitud y longitud
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

    // Limpiar el URL anterior al cambiar el predictor
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [selectedTCH]); // Ejecuta nuevamente cuando el predictor cambia

  // Función para intercambiar latitud y longitud en las coordenadas
  const swapLatLngInCoordinates = (coordinates) => {
    return coordinates.map((polygon) =>
      polygon.map((point) => {
        if (Array.isArray(point) && point.length === 2) {
          return [point[1], point[0]]; // Intercambiar latitud y longitud
        } else {
          return point;
        }
      })
    );
  };

  const onEachFeature = (feature, layer) => {
    if (
      feature.properties &&
      feature.properties.id &&
      feature.properties[selectedTCH]
    ) {
      const tchValue = parseFloat(feature.properties[selectedTCH]);
      const tchValueFormatted = isNaN(tchValue)
        ? 'N/A'
        : tchValue.toFixed(3);

      // Agregar tooltip con el id y el valor del predictor seleccionado
      layer.bindTooltip(
        `ID: ${feature.properties.id}<br>${selectedTCH}: ${tchValueFormatted}`,
        { permanent: false }
      );

      // Cambiar el estilo del polígono al hacer hover
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 5,
            color: '#666',
            fillOpacity: 0.7,
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          const tchValue = parseFloat(feature.properties[selectedTCH]);
          layer.setStyle({
            weight: 2,
            color: getColorFromTCH(tchValue, minTCH, maxTCH),
            fillColor: getColorFromTCH(tchValue, minTCH, maxTCH),
            fillOpacity: 0.5,
          });
        },
      });
    }
  };

  // estilos de las parcelas
  const style = (feature) => {
    const tchValue = parseFloat(feature.properties[selectedTCH]);
    if (!isNaN(tchValue)) {
      return {
        weight: 2,
        color: getColorFromTCH(tchValue, minTCH, maxTCH),
        fillColor: getColorFromTCH(tchValue, minTCH, maxTCH),
        fillOpacity: 0.5,
      };
    }
    return {
      weight: 2,
      color: '#ccc',
      fillColor: '#ccc',
      fillOpacity: 0.5,
    };
  }; 

  // funcion para la busqueda de un terreno por id
  const handleSearch = () => {
    if (!geoData || !searchId) {
      console.error("Los datos no están listos o no hay un ID para buscar.");
      return;
    }
    const cleanSearchId = searchId.trim().toUpperCase();

    const feature = geoData.features.find(
      (f) => f.properties.id && f.properties.id.trim().toUpperCase() === cleanSearchId
    );

    if (feature) {
      setSelectedFeature(feature);
    } else {
      alert('No se encontró un polígono con el ID proporcionado:', cleanSearchId);
    }
  };

  return (
    <Row className="my-5 w-100">
      <Col
        className='sidebar'
        sm={11}
        xl={3}
      >
        <h4>Mapa de Predicción de TCH</h4>

        {/* Filtro al lado izquierdo */}
        <h5 className='mt-4'>Filtrar por predicción</h5>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <label>
              <input
                type="radio"
                value="TCHPRED_2Meses"
                checked={selectedTCH === 'TCHPRED_2Meses'}
                onChange={() => {
                  setLoading(true);
                  setSelectedTCH('TCHPRED_2Meses');
                }}
              />{' '}
              TCH Predicción a 2 Meses
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                value="TCHPRED_4Meses"
                checked={selectedTCH === 'TCHPRED_4Meses'}
                onChange={() => {
                  setLoading(true);
                  setSelectedTCH('TCHPRED_4Meses');
                }}
              />{' '}
              TCH Predicción a 4 Meses
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                value="TCHPRED_6Meses"
                checked={selectedTCH === 'TCHPRED_6Meses'}
                onChange={() => {
                  setLoading(true);
                  setSelectedTCH('TCHPRED_6Meses');
                }}
              />{' '}
              TCH Predicción a 6 Meses
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                value="TCHPRED_8Meses"
                checked={selectedTCH === 'TCHPRED_8Meses'}
                onChange={() => {
                  setLoading(true);
                  setSelectedTCH('TCHPRED_8Meses');
                }}
              />{' '}
              TCH Predicción a 8 Meses
            </label>
          </li>
        </ul>

        {/* Buscar por ID */}
        <h5 className='mt-4'>Buscar por ID</h5>
        <div className='d-flex'>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Ingrese el ID"
            className='inputsidebar'
          />
          <button style={{ width: '30%'}} className='button' onClick={handleSearch}>Buscar</button>
        </div>

        {/* Botón para descargar el GeoJSON transformado */}
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '500px',
            }}
          >
            <Oval height={80} width={80} color="#fe7018" ariaLabel="loading" />
          </div>
        ) : (
          <MapContainer
            center={[14.305, -90.785]}
            zoom={9}
            style={{ height: '500px', width: '100%' }}
          >
            {selectedFeature && <CenterPolygon feature={selectedFeature} />}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {geoData && minTCH !== null && maxTCH !== null && (
              <GeoJSON
                data={geoData}
                style={style}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        )}
      </Col>
    </Row>
  );
};

export default TchMap;
