import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './style/menuMascota.css';
import Header from '../components/encabezado';
import Footer from '../components/footer';
import { IonPage, IonContent } from '@ionic/react';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  fecha: string;
  peso: string;
  imgMascota: string;
}

const MenuMascota: React.FC = () => {
  const history = useHistory();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMascotas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch('http://localhost:3000/mascotas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener mascotas');

      const data = await response.json();
      setMascotas(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascotas();

    // Escuchar el evento de actualización de mascota
    const handleMascotaUpdate = () => {
      fetchMascotas();
    };

    window.addEventListener('mascotaUpdated', handleMascotaUpdate);

    return () => {
      window.removeEventListener('mascotaUpdated', handleMascotaUpdate);
    };
  }, []);

  const handleProfileClick = (mascotaId: number) => {
    window.location.href = '/perfil-mascota';

  };

  if (loading) {
    return (
      <IonPage>
        <Header/>
        <IonContent>
          <div className="container">
            <p>Cargando mascotas...</p>
          </div>
        </IonContent>
        <Footer />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header/>
      <IonContent>
        <div className="container">
          {mascotas.map(mascota => (
            <a 
              key={mascota.id}
              className="bloquePerfil" 
              onClick={() => handleProfileClick(mascota.id)}
            >
              <div className="cuadrado">
                <img 
                  src={mascota.imgMascota || "https://via.placeholder.com/150"} 
                  alt={mascota.nombre} 
                />
              </div>
              <div>
                <p className="nombre">{mascota.nombre}</p>
                <p className="raza">{mascota.raza}</p>
                {mascota.especie && <p className="especie">{mascota.especie}</p>}
              </div>
            </a>
          ))}

          <a 
            onClick={() => history.push('/agregar-mascota')} 
            className="agregarMascota"
          >
            +
          </a>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default MenuMascota;