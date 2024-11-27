# Entrega-Final-Ing-Web
Repositorio de Entrega Final, Proyecto Final Ingenieria Web - INF3245

## Integrantes: Benjamín Vergara - Luka Jacob - Kevin Selave
## Nombre Proyecto: MyPet

# Entregables

- EF.1 Implementar las funcionalidades propuestas en la EP1.
- EF.2 Implementar el inicio y cierre de sesión.
- EF.3 Implementar el backend de la aplicaci´on, con enfoque de API REST, y utilizando el framework y la base de datos seleccionadas, con conexi´on entre ambos. Se deben considerar los m´etodos HTTP
  (GET, POST, PUT, DELETE). Algunos frameworks de ejemplo son: Express.js, Nest.js, Spring Boot, Flask, entre otros.
- EF.4 Implementar la conexión entre datos y logica.
- EF.5 Implementar la conexión entre el frontend y el backend, utilizando el concepto de API REST, y consumir los datos desde el backend y mostrarlos en el frontend.
- EF.6 Implementación de al menos 4 aspectos de seguridad web. Algunos ejemplos son: Autenticacion, autorizacion de usuarios mediante JWT, encriptacion de contrasenas en la base de datos (hashing), captcha (no soy un robot), crear usuario de DB  limitar permisos, uso de variables de entorno en el desarrollo para proteger datos sensibles, entre otros.


## EF1: Implementar las funcionalidades propuestas en la EP1.
- Personalizar perfil usuario:  Esta funcionalidad permite a los usuarios configurar y personalizar su perfil en la aplicación según sus preferencias y necesidades. Los usuarios pueden ingresar y modificar información personal, como su nombre, foto de perfil, información de contacto, dirección, y otros detalles relevantes.

- Lista de mascotas del usuario Esta funcionalidad proporciona una vista general de todas las mascotas registradas por el usuario en la aplicación. La lista muestra un resumen básico de cada mascota, como su nombre, foto, y algunos detalles importantes (edad, raza). Desde esta lista, los usuarios pueden acceder rápidamente al perfil completo de cada mascota para ver más detalles o realizar modificaciones.

- Crear perfil de mascota: Esta función permite a los usuarios crear un perfil detallado para cada una de sus mascotas dentro de la aplicación. Durante el proceso de creación, se le pedirá al usuario que ingrese información básica y relevante sobre la mascota. Este perfil será accesible y editable en cualquier momento.

- Visualizar el perfil de una mascota 
Esta función permite a los usuarios acceder y visualizar la información completa de un perfil de mascota que ya ha sido creado. El usuario puede ver todos los detalles ingresados durante la creación del perfil.
Detalles visualizados: Nombre, foto, especie, raza, fecha de nacimiento, peso, información de salud.
Interacción: Desde la vista del perfil, el usuario puede navegar hacia otras funciones, como el historial médico 

- Editar perfil de la mascota: Esta función permite a los usuarios actualizar o modificar la información existente en el perfil de una mascota. Los usuarios pueden acceder a cualquier campo del perfil para realizar cambios, como actualizar el peso, o cambiar la foto de la mascota.

- Lista de los eventos de la mascota  Este módulo permite a los usuarios llevar un registro detallado de los eventos relacionados de cada mascota. Desde esta lista, el usuario puede seleccionar cualquier evento para ver más detalles o eliminar la
entrada si es necesario.

- Crear una entrada de evento de la mascota: Esta función permite a los usuarios añadir nuevos eventos de la mascota. Se puede registrar visitas al veterinario, vacunaciones, cirugías, enfermedades, etc.

## EF2: Implementar el inicio y cierre de sesión
- Inicio de Sesion: El Inicio de sesion posee campo para ingresar el email del usuario y su contraseña ingresada al momento de registrarse, además de un apartado en el que si no se tiene una cuenta lo manda al registro de sesión.
- Registrarse: En registro, se deben ingresar datos relevantes como Nombre, email, region, contraseña y la confirmación de dicha contraseña.
- Cierre de Sesion: Al realizar el registro o inicio de sesión, en el header (Encabezado de la pagina) hay una opción de Cerrar Sesion, si el usuario pulsa click, se cierra la sesión del usuario.


## EF3 Implementar el backend de la aplicación, con enfoque de APIREST, y utilizando el framework y la base de datos seleccionadas con conexión entre ambos: 
Implementación del backend de una aplicación web con una API REST, usando Node.js con el framework Express. También se conecta a una base de datos para realizar diversas operaciones. Aquí te doy un desglose de su contenido y funcionalidades principales:
## Autenticación 
 POST /login: Verifica credenciales (email y contraseña) contra la base de datos. Si son válidas, genera y retorna un token JWT junto con la información del usuario.
 POST /logout: Responde con éxito al cierre de sesión.

## Usuarios 
- POST /usuario: Registra un nuevo usuario verificando: Campos requeridos.

GET /usuario/:id: Devuelve los datos del usuario solicitado si el token es válido y el usuario autenticado tiene permisos para verlo.
PUT /usuario/:id: Permite al usuario autenticado actualizar su información (nombre, email, contraseña, foto de perfil, región).

##Mascotas
POST /mascota: Crea un registro de mascota asociado al usuario autenticado. Genera un código único de vinculación.
Requiere nombre y especie.
GET /mascotas: Devuelve la lista de mascotas asociadas al usuario autenticado.
GET /mascotas/:id: Devuelve información detallada de una mascota específica si pertenece al usuario autenticado.
PUT /mascotas/:id: Actualiza los datos de una mascota del usuario autenticado.
POST /mascotas/vincular: Permite vincular una mascota existente a un usuario utilizando el codigoVinculacion.

## Eventos: 
POST /evento: Crea un evento asociado a una mascota del usuario autenticado (por ejemplo, consultas veterinarias).
GET /eventos/:idMascota: Devuelve los eventos relacionados con una mascota específica, siempre que pertenezca al usuario autenticado.


## EF.4 Implementar la conexion entre datos y logica: 
La conexión entre datos y lógica se implementa mediante la interacción entre las rutas API REST y la base de datos utilizando consultas SQL dinámicas con connection.query. Las rutas procesan la lógica de negocio al recibir los datos desde el cliente, validándolos y formateándolos antes de ejecutarlos en la base de datos. 

## EF.5: Implementar la conexi´on entre el frontend y el backend, utilizando el concepto de API REST, y consumir los datos desde el backend y mostrarlos en el frontend.
La conexión entre el frontend y el backend  se implementa utilizando el concepto de API REST, donde el frontend realiza solicitudes HTTP a las rutas definidas en el backend. Estas rutas procesan la lógica de negocio, interactúan con la base de datos y devuelven datos estructurados en formato JSON. El frontend tomando en cuenta las funcionalidades que decidimos implementar en la app,  consume estos datos y los utiliza para actualizar dinámicamente la interfaz de usuario, mostrando información como perfiles de usuario, mascotas o eventos, y permitiendo acciones como registro, autenticación y edición de datos en tiempo real, creando así una comunicación fluida y eficiente entre ambas capas.


## EF.6: Implementación de al menos 4 aspectos de seguridad web
Se han implementado varios aspectos clave de seguridad web que garantizan la protección de datos y el control de acceso. Los Aspectos de seguridad que implementamos son:

- Autenticación y Autorización con JWT (JSON Web Token): Se utilizan tokens JWT para autenticar y autorizar usuarios. Cada usuario recibe un token único al iniciar sesión, el cual debe enviarse en las solicitudes protegidas. Esto garantiza que solo los usuarios autenticados puedan acceder a recursos específicos.

- Encriptación de Contraseñas (Hashing): Las contraseñas de los usuarios no se almacenan en texto plano. Antes de guardarlas en la base de datos, se encriptan utilizando funciones de hashing seguro como bcrypt, dificultando su robo o uso indebido incluso en caso de un acceso no autorizado a la base de datos.

- Uso de Variables de Entorno: Datos sensibles como credenciales de la base de datos, claves secretas de JWT y configuraciones del servidor están protegidos mediante variables de entorno, almacenadas en un archivo .env. Esto reduce la exposición accidental de estos datos en el código fuente.

- Validación y Sanitización de Entradas: Se validan y sanitizan los datos recibidos en las solicitudes del cliente, como emails y contraseñas, para evitar inyecciones SQL o ataques de tipo XSS (Cross-Site Scripting). Esto incluye el uso de expresiones regulares para verificar formatos y consultas parametrizadas en las interacciones con la base de datos.

  


