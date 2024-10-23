// src/components/tch/TchMap.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TchMap from '../components/tch/TchMap';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock de react-leaflet
vi.mock('react-leaflet', async () => {
  const actual = await vi.importActual('react-leaflet');
  return {
    ...actual,
    MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    GeoJSON: () => <div data-testid="geojson" />,
    useMap: () => ({
      fitBounds: vi.fn(),
      getZoom: vi.fn().mockReturnValue(10),
      setZoom: vi.fn(),
    }),
  };
});

// Mock de leaflet 
vi.mock('leaflet', () => {
  return {
    __esModule: true,
    default: {},
    latLngBounds: () => ({
      extend: () => {},
    }),
    map: () => ({
      fitBounds: () => {},
      getZoom: () => 10,
      setZoom: () => {},
      remove: () => {},
    }),
    tileLayer: () => ({}),
    geoJSON: () => ({
      addTo: () => {},
    }),
  };
});

// pruebas
describe('TchMap Component', () => {
  test('renderiza el mapa', () => {
    render(<TchMap />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  test('verifica el mapa renderizado', async () => {
    render(<TchMap />);
    await waitFor(() => {
      expect(screen.getByText(/Mapa de Predicción de TCH/i)).toBeInTheDocument();
    });
  });

  test('error de modal al no encontrar id', async () => {
    render(<TchMap />);
    await waitFor(() => {
      expect(screen.getByText(/Mapa de Predicción de TCH/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Ingrese el ID/i);
    fireEvent.change(input, { target: { value: '999' } });

    // seleccionamos boton
    const searchButton = screen.getByRole('button', { name: /Buscar/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/No se encontró un polígono con el ID proporcionado/i)).toBeInTheDocument();
    });
  });
});
