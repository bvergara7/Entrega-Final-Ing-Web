// components/EditarPerfilUsuario.tsx
import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './style/perfilMascota.css';
import Header from '../components/encabezado';
import Footer from '../components/footer';
import ProfileImageSelector from '../components/ImgUsuario';
import { updateUserData } from './services/authService';

const EditarUsuario: React.FC = () => {
  const history = useHistory();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regions] = useState([
    { idRegion: '1', nombreRegion: 'Arica y Parinacota' },
    { idRegion: '2', nombreRegion: 'Tarapacá' },
    { idRegion: '3', nombreRegion: 'Antofagasta' },
    { idRegion: '4', nombreRegion: 'Atacama' },
    { idRegion: '5', nombreRegion: 'Coquimbo' },
    { idRegion: '6', nombreRegion: 'Valparaíso' },
    { idRegion: '7', nombreRegion: "O'Higgins" },
    { idRegion: '8', nombreRegion: 'Maule' },
    { idRegion: '9', nombreRegion: 'Ñuble' },
    { idRegion: '10', nombreRegion: 'Biobío' },
    { idRegion: '11', nombreRegion: 'La Araucanía' },
    { idRegion: '12', nombreRegion: 'Los Ríos' },
    { idRegion: '13', nombreRegion: 'Los Lagos' },
    { idRegion: '14', nombreRegion: 'Aysén del General Carlos Ibáñez del Campo' },
    { idRegion: '15', nombreRegion: 'Magallanes y de la Antártica Chilena' },
    { idRegion: '16', nombreRegion: 'Metropolitana de Santiago' }
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/iniciar-sesion';
          return;
        }

        const userData = await updateUserData(token);
        if (userData) {
          setNombre(userData.nombre);
          setEmail(userData.email);
          setRegion(userData.idRegion);
          setCurrentImage(userData.fotoPerfil || '');
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError('Error al cargar los datos del usuario');
      }
    };

    fetchUserData();
  }, [history]);

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|cl|arg|[a-z]{2,})$/;
    if (!regex.test(email)) {
      setEmailError('Correo electrónico inválido. Debe contener "@" y un dominio válido.');
      return false;
    }
    setEmailError('');
    return true;
  };



  

  const handleImageSelect = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsImageSelectorOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/iniciar-sesion');
      return;
    }

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenData.id;

    try {
      const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          idRegion: region,
          fotoPerfil: currentImage
        }),
      });

      if (response.ok) {
        // Actualizar datos en localStorage
        await updateUserData(token);
        
        // Redirigir al perfil
        history.push('/perfil-usuario');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="bloqueEditar">
          <h2>Editar Perfil de Usuario</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="imagen-perfil-container" onClick={() => setIsImageSelectorOpen(true)}>
              {currentImage ? (
                <img
                  className="imgPerfil cursor-pointer hover:opacity-80 transition-opacity"
                  src={currentImage}
                  alt="Perfil"
                />
              ) : (
                <div className="placeholder-perfil cursor-pointer hover:opacity-80 transition-opacity">
                  Click para seleccionar imagen
                </div>
              )}
            </div>

            <ProfileImageSelector
              currentImage={currentImage}
              onImageSelect={handleImageSelect}
              isOpen={isImageSelectorOpen}
              onClose={() => setIsImageSelectorOpen(false)}
            />

            <label className="etiqueta" htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />

            <label className="etiqueta" htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onBlur={() => validateEmail(email)}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {emailError && <p className="error-message">{emailError}</p>}

            <label htmlFor="region">Región:</label>
            <select
              id="region"
              name="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Seleccione una región</option>
              {regions.map((reg) => (
                <option key={reg.idRegion} value={reg.idRegion}>
                  {reg.nombreRegion}
                </option>
              ))}
            </select>

            <div className="botones">
            <button type="submit"
           className="guardarPerfil"onClick={() => {if (!loading) {
      window.location.href = '/perfil-usuario'; }
    }}
    disabled={loading}
    >
      {loading ? 'Guardando...' : 'Guardar Cambios'}
    </button>
              <button 
                type="button" 
                className="cancelar" 
                onClick={() => history.push('/perfil-usuario')}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default EditarUsuario;