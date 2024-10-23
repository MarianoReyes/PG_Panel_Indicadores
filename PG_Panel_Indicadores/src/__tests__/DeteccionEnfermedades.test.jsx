// src/__tests__/DeteccionEnfermedades.test.jsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DeteccionEnfermedadesPage from '../pages/DeteccionEnfermedadesPage';
import { server } from '../mocks/server';
import '@testing-library/jest-dom';

// Mock de FileReader y variable de entorno
beforeAll(() => {
  global.FileReader = class {
    readAsDataURL(file) {
      this.onload({ target: { result: 'data:image/jpeg;base64,mocked-image-data' } });
    }
  };
  import.meta.env.VITE_URL_DETECCION_ENFERMEDADES = 'http://localhost/mock-url';
});

describe('DeteccionEnfermedadesPage', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('se renderiza correctamente', async  () => {
    await act(async () => {
      render(<DeteccionEnfermedadesPage />);
    });
    expect(screen.getByText(/Modelo para la detección de enfermedades en la caña/i)).toBeInTheDocument();
  });

  test('muestra error cuando no se ha subido imagen y se hace clic en "Detectar Enfermedad"', async () => {
    await act(async () => {
      render(<DeteccionEnfermedadesPage />);
    });
    const detectButton = screen.getByText('Detectar Enfermedad');
    fireEvent.click(detectButton);
    expect(screen.getByText(/Por favor, sube una imagen antes de detectar enfermedades/i)).toBeInTheDocument();
  });
});
