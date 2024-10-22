import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '/src/pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';  // Importa Vitest

// Mock de la función de navegación
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('LoginPage', () => {
  it('renderiza el componente correctamente', () => {
    render(
      <MemoryRouter>
        <LoginPage onLogin={vi.fn()} />
      </MemoryRouter>
    );

    // Verifica que los elementos importantes se renderizan correctamente
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('muestra un modal de error cuando las credenciales son incorrectas', async () => {
    // Simulamos una respuesta de error de la API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <MemoryRouter>
        <LoginPage onLogin={vi.fn()} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Correo:'), {
      target: { value: 'test@correo.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña:'), {
      target: { value: 'incorrecta' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    // Esperamos que el modal de error aparezca
    const modalError = await screen.findByText('Credenciales incorrectas. Inténtalo de nuevo.');
    expect(modalError).toBeInTheDocument();
  });
});
