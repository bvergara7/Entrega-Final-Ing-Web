import React from 'react';
import { IonIcon } from '@ionic/react';
import { pawOutline, personCircleOutline, logOutOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import './encabezado.css';

const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  // Función que verifica si la ruta está activa
  const isActive = (path: string) => (location.pathname === path ? 'active' : '');

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token almacenado
    // Redirigir al usuario a la página de inicio o de login
    window.location.href = '/iniciar-sesion';
  };

  return (
    <div className="header">
      {/* Redirige a 'menu-mascota' al hacer clic */}
      <a className={isActive('/menu-mascota')} onClick={() => history.push('/menu-mascota')}>
        <IonIcon icon={pawOutline} className="icon" /> Mis Mascotas
      </a>

      {/* Redirige a 'perfil-usuario' al hacer clic */}
      <a className={isActive('/perfil-usuario')} onClick={() => history.push('/perfil-usuario')}>
        <IonIcon icon={personCircleOutline} className="icon" /> Mi perfil
      </a>

      {/* Llama a la función de cerrar sesión */}
      <a className={isActive('/iniciar-sesion')} onClick={handleLogout}>
        <IonIcon icon={logOutOutline} className="icon" /> Cerrar Sesión
      </a>
    </div>
  );
};

export default Header;




