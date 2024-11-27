import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './style/agendarEvento.css';
import Header from '../components/encabezado';
import Footer from '../components/footer';

interface Mascota {
  id: number;
  nombre: string;
}

interface Evento {
  titulo: string;
  fecha: string;
  hora: string;
  descripcion: string;
}

const AgendarEvento: React.FC = () => {
  const history = useHistory();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [evento, setEvento] = useState<Evento>({
    titulo: '',
    fecha: '',
    hora: '',
    descripcion: ''
  });
  const [mascotaSeleccionadaId, setMascotaSeleccionadaId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  // Cargar la lista de mascotas al montar el componente
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token de autenticación');
          return;
        }

        const response = await fetch('http://localhost:3000/mascotas', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener mascotas');
        }

        const mascotasData = await response.json();
        setMascotas(mascotasData);

        // Seleccionar la primera mascota por defecto si hay mascotas
        if (mascotasData.length > 0) {
          setMascotaSeleccionadaId(mascotasData[0].id);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudieron cargar las mascotas');
      }
    };

    fetchMascotas();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMascotaChange = (event: CustomEvent) => {
    const mascotaId = parseInt(event.detail.value);
    setMascotaSeleccionadaId(mascotaId);
  };

  const guardarEvento = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      if (!mascotaSeleccionadaId) {
        setError('Debe seleccionar una mascota');
        return;
      }

      const fechaCompleta = `${evento.fecha}T${evento.hora}:00`;

      const response = await fetch('http://localhost:3000/evento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: evento.titulo,
          fecha: fechaCompleta,
          descripcion: evento.descripcion,
          idMascota: mascotaSeleccionadaId
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      // Disparar evento de actualización
      window.dispatchEvent(new CustomEvent('eventoCreado'));
      
      history.push('/perfil-mascota');
    } catch (error) {
      setError('Error al guardar el evento');
      console.error('Error:', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header />
        <div className="seccion">
          <h2>Agendar Evento</h2>
          {error && <div className="error-message">{error}</div>}

          {/* Selector de mascota */}
          <div className="form-group">
            <label htmlFor="mascota">Mascota</label>
            <IonSelect
              value={mascotaSeleccionadaId}
              placeholder="Selecciona una mascota"
              onIonChange={handleMascotaChange}
              className="selector-custom"
            >
              {mascotas.map((mascota) => (
                <IonSelectOption key={mascota.id} value={mascota.id}>
                  {mascota.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <div className="form-group">
            <label htmlFor="titulo">Nombre de evento</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={evento.titulo}
              onChange={handleInputChange}
              placeholder="Nombre de evento"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Día del evento</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={evento.fecha}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hora">Hora del evento</label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={evento.hora}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción del evento</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={evento.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del evento"
            ></textarea>
          </div>

          <div className="botones">
            <button 
              className="guardarPerfil" 
              onClick={guardarEvento}
              disabled={!evento.titulo || !evento.fecha || !evento.hora || !mascotaSeleccionadaId}
            >
              Guardar evento
            </button>
            <button 
              className="cancelar" 
              onClick={() => history.push('/perfil-mascota')}
            >
              Cancelar
            </button>
          </div>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default AgendarEvento;