import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import './style/agregarMascota.css';
import Header from '../components/encabezado';
import Footer from '../components/footer';
import ImgMascota from '../components/ImgMascota';

interface MascotaParams {
  id?: string;
}

const AgregarMascota: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<MascotaParams>();
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fecha: '',
    peso: '',
    imgMascota: ''
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchMascotaData();
    }
  }, [id]);

  const fetchMascotaData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(`http://localhost:3000/mascotas/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener mascota');

      const mascota = await response.json();
      setFormData({
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        fecha: mascota.fecha,
        peso: mascota.peso,
        imgMascota: mascota.imgMascota
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imgMascota: imageUrl
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const url = isEditing 
        ? `http://localhost:3000/mascota/${id}` 
        : 'http://localhost:3000/mascota';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al procesar la mascota');

      const data = await response.json();
      
      // En lugar de redirigir inmediatamente, vamos a actualizar el estado global
      // y luego redirigir
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('mascotaUpdated', { 
          detail: { mascota: data.mascota }
        }));
      }

      history.push('/menu-mascota');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <IonPage>
      <Header/>
      <IonContent>
        <div className="bloqueEditar">
          <h2>{isEditing ? 'Editar' : 'Crear'} Perfil de Mascota</h2>

          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Mascota</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la Mascota" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="especie">Especie</label>
            <select 
              id="especie" 
              name="especie"
              value={formData.especie}
              onChange={handleInputChange}
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
            <label htmlFor="fecha">Fecha de Cumpleaños</label>
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
            <label htmlFor="peso">Peso</label>
            <input 
              type="text" 
              id="peso" 
              name="peso" 
              value={formData.peso}
              onChange={handleInputChange}
              placeholder="Peso" 
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
              Subir Foto
            </button>
          </div>

          <div className="botones">
            <button 
              className="guardarPerfil" 
              type="button"
              onClick={handleSubmit}
            >
              {isEditing ? 'Actualizar' : 'Guardar'} Perfil
            </button>
            <button 
              type="button" 
              className="cancelar" 
              onClick={() => history.push('/menu-mascota')}
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

export default AgregarMascota