import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Redirección automática si el usuario ya está autenticado
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/'); // Redirige a la página principal
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simulación de autenticación exitosa
    const response = { ok: true, verified: true }; // Simula la respuesta de autenticación

    if (response.ok && response.verified) {
      onLogin();  // Actualiza el estado de autenticación en App y guarda en localStorage
      navigate('/'); // Redirige a la página principal u otra ruta deseada
    } else {
      alert('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
