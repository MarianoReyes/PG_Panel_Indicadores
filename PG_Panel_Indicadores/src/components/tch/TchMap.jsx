import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import { ThreeDots } from 'react-loader-spinner'

const TchMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load GeoJSON data asynchronously
    fetch('/tch.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
        setLoading(false);
      });
  }, []);

  // Function to style features based on 'zafra'
  const getFeatureStyle = (feature) => {
    const zafraColors = {
      '19-20': '#1f77b4',
      '20-21': '#ff7f0e',
      '21-22': '#2ca02c',
      '22-23': '#d62728',
      '23-24': '#9467bd',
    };
    return {
      color: zafraColors[feature.properties.zafra] || '#cccccc',
      weight: 1,
      fillOpacity: 0.5,
    };
  };

  // Function to handle each feature
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.tchpred) {
      layer.bindTooltip(`TCHPred: ${feature.properties.tchpred}`);
    }
  };

  // Group features by 'zafra'
  const layersByZafra = {};

  if (geoData) {
    geoData.features.forEach((feature) => {
      const zafra = feature.properties.zafra || 'Unknown';
      if (!layersByZafra[zafra]) {
        layersByZafra[zafra] = {
          type: 'FeatureCollection',
          features: [],
        };
      }
      layersByZafra[zafra].features.push(feature);
    });
  }

  // Center coordinates (adjust based on your data)
  const centerPosition = [15.0, -90.0]; // Replace with your data's center

  return (
    <div>
      {loading && 
        <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#fe7018"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />}
      {!loading && (
        <MapContainer
          center={centerPosition}
          zoom={6}
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl position="topright">
            {Object.keys(layersByZafra).map((zafra) => (
              <LayersControl.Overlay
                name={`Zafra ${zafra}`}
                key={zafra}
                checked
              >
                <GeoJSON
                  data={layersByZafra[zafra]}
                  style={getFeatureStyle}
                  onEachFeature={onEachFeature}
                />
              </LayersControl.Overlay>
            ))}
          </LayersControl>
        </MapContainer>
      )}
    </div>
  );
};

export default TchMap;
