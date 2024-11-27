import React, { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Header from '../components/encabezado';
import Footer from '../components/footer';
import ProfileImageSelector from '../components/ImgUsuario';
import axios from 'axios';
import './style/perfilUsuario.css';

interface Perfil {
  nombre: string;
  email: string;
  fotoPerfil: string;
  idRegion: number;
  nombreRegion: string;
}

const PerfilUsuario: React.FC = () => {
  const history = useHistory();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setErrorMessage('No hay sesión activa');
          history.push('/iniciar-sesion');
          return;
        }

        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.id;

        const response = await axios.get(`http://localhost:3000/usuario/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setPerfil(response.data);
      } catch (error: any) {
        if (error.response?.status === 403) {
          setErrorMessage('No tienes permiso para ver este perfil');
          history.push('/login');
        } else {
          setErrorMessage(error.response?.data?.message || 'Error al cargar los datos del perfil');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  const handleImageSelect = async (imageUrl: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No hay sesión activa');
        return;
      }

      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.id;

      const updateResponse = await axios.put(
        `http://localhost:3000/usuario/${userId}`,
        { fotoPerfil: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateResponse.status === 200) {
        setPerfil((prevPerfil) =>
          prevPerfil ? { ...prevPerfil, fotoPerfil: imageUrl } : null
        );
        alert('Imagen actualizada correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      setErrorMessage('Error al actualizar la imagen');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  if (!perfil) {
    return <div>No se encontró el perfil</div>;
  }

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="contenedor-unificado">
          <h2>Perfil del Usuario</h2>
          <div className="imagen-perfil-container" onClick={() => setIsImageSelectorOpen(true)}>
            {perfil.fotoPerfil ? (
              <img
                className="imgPerfil cursor-pointer hover:opacity-80 transition-opacity"
                src={perfil.fotoPerfil}
                alt="Perfil"
              />
            ) : (
              <div className="placeholder-perfil cursor-pointer hover:opacity-80 transition-opacity">
                Click para seleccionar imagen
              </div>
            )}
          </div>
          
          <ProfileImageSelector
            currentImage={perfil.fotoPerfil}
            onImageSelect={handleImageSelect}
            isOpen={isImageSelectorOpen}
            onClose={() => setIsImageSelectorOpen(false)}
          />

          <div className="detalle">
            <h3>Datos personales</h3>
            <p>Nombre: {perfil.nombre}</p>
            <p>Email: {perfil.email}</p>
            <p>ID Región: {perfil.idRegion}</p>
            <p>Región: {perfil.nombreRegion}</p>
          </div>

          <button
            className="boton"
            onClick={() => history.push('/editar-usuario')}
          >
            Editar Perfil
          </button>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default PerfilUsuario;