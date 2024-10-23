// src/__tests__/App.test.jsx
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renderiza el componente App correctamente', () => {
  render(<App />);
  expect(screen.getByText(/Qué hacemos en esta página/i)).toBeInTheDocument();
});
