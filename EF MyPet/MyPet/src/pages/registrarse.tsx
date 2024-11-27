import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './style/registrarse.css';
import axios from 'axios';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rutError, setRutError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [regiones] = useState([
    { idRegion: '1', nombreRegion: 'Arica y Parinacota' },
    { idRegion: '2', nombreRegion: 'Tarapacá' },
    { idRegion: '3', nombreRegion: 'Antofagasta' },
    { idRegion: '4', nombreRegion: 'Atacama' },
    { idRegion: '5', nombreRegion: 'Coquimbo' },
    { idRegion: '6', nombreRegion: 'Valparaíso' },
    { idRegion: '7', nombreRegion: 'O’Higgins' },
    { idRegion: '8', nombreRegion: 'Maule' },
    { idRegion: '9', nombreRegion: 'Ñuble' },
    { idRegion: '10', nombreRegion: 'Biobío' },
    { idRegion: '11', nombreRegion: 'La Araucanía' },
    { idRegion: '12', nombreRegion: 'Los Ríos' },
    { idRegion: '13', nombreRegion: 'Los Lagos' },
    { idRegion: '14', nombreRegion: 'Aysén del General Carlos Ibáñez del Campo' },
    { idRegion: '15', nombreRegion: 'Magallanes y de la Antártica Chilena' },
    { idRegion: '16', nombreRegion: 'Metropolitana de Santiago' },
    { idRegion: '17', nombreRegion: 'Valparaíso' },
    { idRegion: '18', nombreRegion: 'Los Lagos' },
  ]);

  const history = useHistory();

  // Cargar el script de reCAPTCHA
  useEffect(() => {
    const loadRecaptchaScript = () => {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadRecaptchaScript();
  }, []);



  // Validar Email
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|cl|arg|[a-z]{2,})$/;
    if (!regex.test(email)) {
      setEmailError('Correo electrónico inválido. Debe contener "@" y un dominio válido.');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Manejar registro
  const handleRegister = async () => {
    if (!nombre || !email || !region || !password || !confirmPassword) {
      setErrorMessage('Por favor, rellena todos los campos.');
      return;
    }
    if (!validateEmail(email) || password !== confirmPassword) {
      return;
    }

    // Verificar reCAPTCHA
    const token = grecaptcha.getResponse(); // Obtener el token de reCAPTCHA
    if (!token) {
      setErrorMessage('Por favor, completa el reCAPTCHA.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/usuario', {
        nombre,
        email,
        contraseña: password,
        idRegion: region,
        recaptchaToken: token, // Enviar el token de reCAPTCHA
      });

      if (response.status === 201) {
        alert('Usuario registrado exitosamente');
        history.push('/menu-mascota');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="registro-content">
      <div className="registro-container">
        <h2 className="centered-text">Registro</h2>
        {/* Formulario */}
        <div className="input-container">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="input-container">
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>
        <div className="input-container">
          <label htmlFor="region">Región</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Selecciona tu región</option>
            {regiones.map((reg) => (
              <option key={reg.idRegion} value={reg.idRegion}>
                {reg.nombreRegion}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="input-container">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="input-container">
          <div className="g-recaptcha" data-sitekey="6Lcj1oEqAAAAABWz_wAabhiZmsUnIySQrCEStWnj"></div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleRegister} className="custom-button centered-button">
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Registro;