import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';
import { Oval } from 'react-loader-spinner'; // Loader

// Definir la proyección de UTM zona 15N (EPSG:32615) a latitud-longitud (EPSG:4326)
proj4.defs("EPSG:32615", "+proj=utm +zone=15 +datum=WGS84 +units=m +no_defs");

// Función para convertir coordenadas UTM a latitud-longitud
const convertUTMToLatLng = (coordinates) => {
  return coordinates.map((polygon) => 
    polygon.map((point) => {
      if (Array.isArray(point) && point.length === 2 && isFinite(point[0]) && isFinite(point[1])) {
        try {
          return proj4("EPSG:32615", "EPSG:4326", point);
        } catch (error) {
          console.error("Error al transformar las coordenadas:", point, error);
          return point;
        }
      } else {
        console.warn("Coordenadas inválidas encontradas:", point);
        return point;
      }
    })
  );
};

// Función para obtener un color basado en un valor de TCHPRED
const getColorFromTCH = (value, minTCH, maxTCH) => {
  // Evitar divisiones por cero si minTCH es igual a maxTCH
  if (minTCH === maxTCH) {
    return 'rgb(0, 255, 0)'; // Si el rango no tiene variación, todos son verdes
  }
  
  // Si el valor no es un número válido, devolver gris
  if (isNaN(value)) {
    return 'rgb(200, 200, 200)'; // Gris si el valor no es válido
  }

  // Normalizar el valor entre 0 (rojo) y 1 (verde)
  const ratio = (value - minTCH) / (maxTCH - minTCH);
  
  const red = Math.floor(255 * (1 - ratio));  // Más valor = menos rojo
  const green = Math.floor(255 * ratio);      // Más valor = más verde
  
  return `rgb(${red}, ${green}, 0)`; // Degradado de rojo (255, 0, 0) a verde (0, 255, 0)
};

const TchMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [minTCH, setMinTCH] = useState(null);
  const [maxTCH, setMaxTCH] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state
  const [selectedTCH, setSelectedTCH] = useState('TCHPRED_6Meses'); // Default filter

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch('/tch_data/outputv3.geojson');
        const data = await response.json();

        // Transformar las coordenadas de cada feature en el GeoJSON
        const transformedData = {
          ...data,
          features: data.features.map(feature => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: convertUTMToLatLng(feature.geometry.coordinates),
            },
          })),
        };

        // Obtener el valor mínimo y máximo del predictor seleccionado
        const tchValues = data.features
          .map(feature => parseFloat(feature.properties[selectedTCH]))
          .filter(value => !isNaN(value));

        setMinTCH(Math.min(...tchValues));
        setMaxTCH(Math.max(...tchValues));

        setGeoData(transformedData);
        setLoading(false);  // Ocultar el loader cuando los datos se cargan
      } catch (error) {
        console.error('Error al cargar los datos GeoJSON:', error);
        setLoading(false);  // Asegurarse de que el loader se oculte en caso de error
      }
    };

    fetchGeoData();
  }, [selectedTCH]); // Ejecuta nuevamente cuando el predictor cambia

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.id && feature.properties[selectedTCH]) {
      // Agregar tooltip con el id y el valor del predictor seleccionado
      layer.bindTooltip(
        `ID: ${feature.properties.id}<br>${selectedTCH}: ${feature.properties[selectedTCH]}`,
        { permanent: false }
      );

      // Cambiar el estilo del polígono al hacer hover
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 5,
            color: '#666',
            fillColor: '#666',
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

  const style = (feature) => {
    const tchValue = parseFloat(feature.properties[selectedTCH]);
    if (!isNaN(tchValue)) {
      return {
        weight: 2,
        color: getColorFromTCH(tchValue, minTCH, maxTCH), // Color del borde
        fillColor: getColorFromTCH(tchValue, minTCH, maxTCH), // Color del relleno
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

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="tchFilter">Filtrar por predicción:</label>
        <select
          id="tchFilter"
          value={selectedTCH}
          onChange={(e) => {
            setLoading(true); // Mostrar loader al cambiar el filtro
            setSelectedTCH(e.target.value);
          }}
        >
          <option value="TCHPRED_2Meses">TCH Predicción a 2 Meses</option>
          <option value="TCHPRED_4Meses">TCH Predicción a 4 Meses</option>
          <option value="TCHPRED_6Meses">TCH Predicción a 6 Meses</option>
          <option value="TCHPRED_8Meses">TCH Predicción a 8 Meses</option>
        </select>
      </div>

      {loading ? (
        // Mostrar loader mientras los datos están cargando
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <Oval
            height={80}
            width={80}
            color="#fe7018"
            ariaLabel="loading"
          />
        </div>
      ) : (
        // Mostrar el mapa una vez que los datos están cargados
        <MapContainer
          center={[14.3050000, -90.7850000]} // Centrado en Guatemala
          zoom={9}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoData && minTCH !== null && maxTCH !== null && (
            <GeoJSON
              data={geoData}
              style={style} // Asignar el estilo dinámico
              onEachFeature={onEachFeature} // Manejar eventos como hover
            />
          )}
        </MapContainer>
      )}
    </>
  );
};

export default TchMap;
