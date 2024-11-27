import React from 'react';


import { Redirect, Route } from 'react-router-dom';
import {
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();
import { useState } from 'react';
import {  IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonModal, IonList, IonItem } from '@ionic/react';
import { IonApp,  IonRouterOutlet } from '@ionic/react';

import { pawOutline, personCircleOutline, menu } from 'ionicons/icons';
import MenuMascota from './pages/menuMascota';
import PerfilUsuario from './pages/perfilUsuario';
import PerfilMascota from './pages/perfilMascota';
import AgendarEvento from './pages/agendarEvento';  // Importa la página AgendarEvento
import EditarMascota from './pages/editarPerfilMascota'; 
import EditarUsuario from './pages/editarPerfilUsuario';
import AgregarMascota from './pages/agregarMascota';
import InicioSesion from './pages/inicioSesion';
import Registrarse from './pages/registrarse';
import './components/encabezado.css';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <IonApp>
      <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/menu-mascota" component={MenuMascota} />
            <Route exact path="/perfil-usuario" component={PerfilUsuario} />
            <Route exact path="/perfil-mascota" component={PerfilMascota} />
            <Route exact path="/agendar-evento" component={AgendarEvento} />
            <Route exact path="/editar-mascota" component={EditarMascota} />
            <Route exact path="/editar-usuario" component={EditarUsuario} />
            <Route exact path="/agregar-mascota" component={AgregarMascota} />
            <Route exact path="/iniciar-sesion" component={InicioSesion} />
            <Route exact path="/registrarse" component={Registrarse} />
            <Redirect exact from="/" to="/iniciar-sesion" />
          
          </IonRouterOutlet>

         
          
      </IonReactRouter>

     
    </IonApp>
  );
};

export default App;
