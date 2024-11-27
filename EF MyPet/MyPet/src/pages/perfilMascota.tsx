import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import './style/perfilMascota.css';
import Footer from '../components/footer';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/encabezado';

interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  especie: string;
  fecha: string;  
  imgMascota: string;
}

interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
}

const PerfilMascota: React.FC = () => {
  const history = useHistory();
  const { id: mascotaIdFromUrl } = useParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mascotaSeleccionadaId, setMascotaSeleccionadaId] = useState<number | null>(null);

  const fetchEventos = async (mascotaId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`http://localhost:3000/eventos/${mascotaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener eventos');

      const eventosData = await response.json();
      setEventos(eventosData);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };

  useEffect(() => {
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

        const mascotasData = await response.json();
        setMascotas(mascotasData);

        // Si hay un ID en la URL, seleccionar esa mascota
        if (mascotaIdFromUrl) {
          const mascotaId = parseInt(mascotaIdFromUrl);
          const mascotaEncontrada = mascotasData.find((m: Mascota) => m.id === mascotaId);
          if (mascotaEncontrada) {
            setMascota(mascotaEncontrada);
            setMascotaSeleccionadaId(mascotaId);
            fetchEventos(mascotaId);
          }
        } else if (mascotasData.length > 0) {
          // Si no hay ID en la URL, seleccionar la última mascota agregada
          const ultimaMascota = mascotasData[mascotasData.length - 1];
          setMascota(ultimaMascota);
          setMascotaSeleccionadaId(ultimaMascota.id);
          fetchEventos(ultimaMascota.id);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMascotas();

    const handleEventoCreado = () => {
      if (mascotaSeleccionadaId) {
        fetchEventos(mascotaSeleccionadaId);
      }
    };

    window.addEventListener('eventoCreado', handleEventoCreado);

    return () => {
      window.removeEventListener('eventoCreado', handleEventoCreado);
    };
  }, [mascotaIdFromUrl]);

  const handleMascotaChange = (event: CustomEvent) => {
    const mascotaId = parseInt(event.detail.value);
    const mascotaSeleccionada = mascotas.find(m => m.id === mascotaId);
    if (mascotaSeleccionada) {
      setMascota(mascotaSeleccionada);
      setMascotaSeleccionadaId(mascotaId);
      fetchEventos(mascotaId);
      history.push(`/perfil-mascota/`);
    }
  };

  if (!mascota) {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <div className="contenedor-unificado">
            <p>Cargando datos de la mascota...</p>
          </div>
        </IonContent>
        <Footer />
      </IonPage>
    );
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="contenedor-unificado">
          <h2>Perfil de la Mascota</h2>
          
          <div className="selector-mascota">
            <IonSelect
              value={mascotaSeleccionadaId}
              placeholder="Selecciona una mascota"
              onIonChange={handleMascotaChange}
              className="selector-custom"
            >
              {mascotas.map((m) => (
                <IonSelectOption key={m.id} value={m.id}>
                  {m.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <img
            className="imgPerfil"
            src={mascota.imgMascota || "https://via.placeholder.com/150"}
            alt={mascota.nombre}
          />
          <div className="detalle">
            <h3>Datos de la Mascota</h3>
            <p>Nombre: {mascota.nombre}</p>
            <p>Raza: {mascota.raza}</p>
            <p>Especie: {mascota.especie}</p>
            <p>Fecha de nacimiento: {mascota.fecha}</p>
          </div>

          <div className="eventos">
            <h3>Mis Eventos</h3>
            <div className="lista-eventos">
              {eventos.map(evento => (
                <div key={evento.id} className="evento-card">
                  <h4>{evento.titulo}</h4>
                  <p>{formatearFecha(evento.fecha)}</p>
                  <p>{evento.descripcion}</p>
                </div>
              ))}
            </div>
            <a
              onClick={() => history.push(`/agendar-evento/`)}
              className="boton-agregar"
            >
              +
            </a>
          </div>

          <div className="buttons">
            <button
              className="boton"
              onClick={() => history.push(`/editar-mascota/`)}
            >
              Editar Perfil
            </button>
            <button
              className="boton boton-eliminar"
              onClick={() => {
                // Aquí deberías agregar la lógica para eliminar la mascota
                history.push('/perfil-mascota');
              }}
            >
              Eliminar Perfil
            </button>
          </div>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default PerfilMascota;