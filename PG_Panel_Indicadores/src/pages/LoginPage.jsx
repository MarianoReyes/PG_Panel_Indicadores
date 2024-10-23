import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Redirección automática si el usuario ya está autenticado
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/'); // Redirige a la página principal
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Datos de inicio de sesión
    const loginData = {
      email: username,
      password: password
    };

    try {
      const response = await fetch(import.meta.env.VITE_URL_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');

        onLogin(); // Actualiza el estado de autenticación en App
        navigate('/'); // Redirige a la página principal
      } else {
        // Muestra el modal de error si las credenciales son incorrectas
        setErrorMessage('Credenciales incorrectas. Inténtalo de nuevo.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Hubo un error al intentar iniciar sesión. Por favor, intenta nuevamente.');
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Correo:</label>
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

      {/* Modal de Error */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error de Inicio de Sesión</Modal.Title>
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
}

export default LoginPage;
