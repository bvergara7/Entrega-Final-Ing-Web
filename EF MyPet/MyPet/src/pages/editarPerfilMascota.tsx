import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import './style/editarPerfilUsuario.css';
import Header from '../components/encabezado';
import Footer from '../components/footer';
import ImgMascota from '../components/ImgMascota';

interface RouteParams {
  id: string;
}

interface FormData {
  nombre: string;
  especie: string;
  raza: string;
  fecha: string;
  peso: string;
  imgMascota: string;
}

interface MascotaResponse {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  fecha: string;
  peso: string;
  imgMascota: string;
}

const EditarMascota: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    especie: '',
    raza: '',
    fecha: '',
    peso: '',
    imgMascota: ''
  });
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchMascotaData();
    }
  }, [id]);

  const fetchMascotaData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`http://localhost:3000/mascotas/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener mascota');
      }

      const mascota: MascotaResponse = await response.json();
      setFormData({
        nombre: mascota.nombre || '',
        especie: mascota.especie || '',
        raza: mascota.raza || '',
        fecha: mascota.fecha || '',
        peso: mascota.peso || '',
        imgMascota: mascota.imgMascota || ''
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (imageUrl: string): void => {
    setFormData(prev => ({
      ...prev,
      imgMascota: imageUrl
    }));
    setShowImageModal(false);
  };

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.especie) {
      setError('La especie es requerida');
      return false;
    }

    const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])$/;
    if (formData.fecha && !fechaRegex.test(formData.fecha)) {
      setError('El formato de fecha debe ser DD-MM');
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      if (!validateForm()) return;
      
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`http://localhost:3000/mascotas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar mascota');
      }

      const data = await response.json();
      
      window.dispatchEvent(new CustomEvent('mascotaUpdated', { 
        detail: { mascota: data.mascota }
      }));

      const mascotasStorage = localStorage.getItem('mascotas');
      if (mascotasStorage) {
        const mascotas = JSON.parse(mascotasStorage);
        const updatedMascotas = mascotas.map((m: MascotaResponse) => 
          m.id === parseInt(id) ? { ...m, ...data.mascota } : m
        );
        localStorage.setItem('mascotas', JSON.stringify(updatedMascotas));
      }

      history.push('/perfil-mascota');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <div className="bloqueEditar">
            <p>Cargando...</p>
          </div>
        </IonContent>
        <Footer />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="bloqueEditar">
          <h2>Editar Perfil de Mascota</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Mascota</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la mascota"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="especie">Especie</label>
            <select 
              id="especie" 
              name="especie"
              value={formData.especie}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Selecciona una especie</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="raza">Raza</label>
            <input 
              type="text" 
              id="raza" 
              name="raza" 
              value={formData.raza}
              onChange={handleInputChange}
              placeholder="Raza"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha de Cumpleaños (DD-MM)</label>
            <input 
              type="text" 
              id="fecha" 
              name="fecha" 
              value={formData.fecha}
              onChange={handleInputChange}
              placeholder="DD-MM"
            />
          </div>

          <div className="form-group">
            <label htmlFor="peso">Peso (kg)</label>
            <input 
              type="text" 
              id="peso" 
              name="peso" 
              value={formData.peso}
              onChange={handleInputChange}
              placeholder="Peso en kg"
            />
          </div>

          <div className="container-imgM">
            <img 
              className="imgPerfil" 
              src={formData.imgMascota || "https://via.placeholder.com/150"} 
              alt="Foto de la Mascota" 
            />
            <button 
              className="subirFoto" 
              type="button"
              onClick={() => setShowImageModal(true)}
            >
              Cambiar Foto
            </button>
          </div>

          <div className="botones">
            <button 
              type="button" 
              className="guardarPerfil"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              type="button" 
              className="cancelar" 
              onClick={() => history.push('/perfil-mascota')}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>

        <ImgMascota
          currentImage={formData.imgMascota}
          onImageSelect={handleImageSelect}
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default EditarMascota;