# Mure 🎵

Mure es una aplicación  creada por estudiantes de la Universidad de Ingeniería y Tecnología como parte del proyecto para el curso de Desarrollo Basado en Plataformas. La plataforma permite a los usuarios explorar, compartir y gestionar música y playlists, así como interactuar socialmente mediante publicaciones y listas de amigos. Desarrollada utilizando Spring Boot como framework principal, Mure integra diversas funcionalidades aprendidas durante el curso para ofrecer una experiencia completa y dinámica a sus usuarios.

## Miembros del Proyecto 🤝

| Nombre | Email |
| --- | --- |
| Alejandro Escobar | mailto:alejandro.escobar@utec.edu.pe |
| Joaquin Salinas | mailto:joaquin.salinas@utec.edu.pe |
| Benjamin Ayra | mailto:gussephe.ayra@utec.edu.pe |
| Guillermo Galvez | mailto:jose.galvez.p@utec.edu.pe |

## Estructura del Proyecto 🏗️

### Backend 🚀

- **Framework**: Spring Boot 🌱
- **Lenguaje**: Java ☕
- **Dependencias**:
    - JPA 🗃️
    - Spring Security 🔐
    - Spring Web 🌐
    - Lombok 📚
    - JWT 🔑
- **Base de Datos**: PostgreSQL 🐘

### Frontend 🌐

- **Framework**: React ⚛️
- **Librerías**:
    - Axios 📡
    - React Router 🛣️
    - Framer Motion 🎨
- **Estilos**: Tailwind CSS 🌈

## Configuración del Entorno de Desarrollo 🛠️

### Requisitos Previos 📋

- Node.js 🌟
- Java  ☕
- PostgreSQL  🐘

### Variables de Entorno 🔧

Asegúrate de configurar las siguientes variables de entorno en tu archivo `.env` para que el proyecto funcione correctamente:

- `DB_HOST`: Dirección del host de la base de datos 🌐
- `DB_PORT`: Puerto de la base de datos 🚪
- `DB_NAME`: Nombre de la base de datos 📛
- `DB_USER`: Usuario de la base de datos 👤
- `DB_PASSWORD`: Contraseña de la base de datos 🔑
- `JWT_SECRET`: Llave secreta para JWT 🔒

## Cómo Clonar el Proyecto 🚀

1. Clona el repositorio:
    
    ```bash
    git clone <https://github.com/CS2031-DBP/proyecto-web-mure>
    ```
    
2. Navega al directorio del proyecto:
    
    ```bash
    cd proyecto-web-mure
    ```
    
3. Instala las dependencias:
    
    ```bash
    npm install
    ```
    
4. Inicia la aplicación:
    
    ```bash
    npm start
    ```
    

## Páginas Principales 📄

### Login 🔑

Página de inicio de sesión para autenticar a los usuarios mediante correo electrónico y contraseña, redirigiendo al dashboard tras la autenticación exitosa.

### Register 📝

Página de registro para nuevos usuarios, permitiendo la creación de una cuenta con nombre de usuario, correo electrónico, contraseña y fecha de cumpleaños.

### Dashboard 🏠

Página principal después de iniciar sesión, mostrando un feed de posts de todos los usuarios. Permite la interacción con publicaciones y la carga continua de contenido mediante “Scroll Infinito”.

### SongView 🎵

Permite explorar todas las canciones disponibles en la base de datos, con opciones de búsqueda por título, género o nombre de artista.

### Add Song ➕🎶

Permite agregar una nueva canción a la base de datos en caso de tener el rol de administrador, buscando y seleccionando artistas, y proporcionando detalles como título, fecha de lanzamiento, género, duración, imagen de portada y enlace a Spotify.

### Create Spotify 🔍🎧

Facilita la búsqueda de canciones en Spotify usando la API de Spotify. Los administradores pueden seleccionar canciones y la página junto con el backend verifican si los artistas de la canción ya se encuentran en la base de datos. En caso no se encuentren, se hace una redirección a "Add Artist Info".

### Add Artist Info ➕🎤

Esta página se utiliza para agregar información adicional sobre los artistas que no están presentes en la base de datos antes de añadir una nueva canción. Aquí se completan datos como la fecha de nacimiento y una breve descripción.

### Create Post ➕📝

Permite a los usuarios crear publicaciones con descripciones, imágenes y con la capacidad de añadir información sobre una canción o álbum, fomentando la interacción social en la plataforma. Además de esto, mediante el Song View los usuarios pueden buscar una canción y añadirla directamente a un post.

### User Profile 👤

Muestra la información de un usuario específico, incluyendo sus posts y playlists. Permite a otros usuarios ver el perfil, agregar o eliminar amigos.

### Profile 👥

Muestra la información del usuario actual, incluyendo sus posts y playlists. Permite editar el perfil, ver la lista de amigos y gestionar publicaciones y playlists.

### Edit ✏️

Permite a los usuarios editar su perfil, incluyendo nombre, correo electrónico e imagen de perfil, manteniendo la información actualizada.

### Friend List 👥

Muestra la lista de amigos del usuario actual, permitiendo ver sus perfiles, eliminar amigos y navegar a sus perfiles individuales.

### Create Playlist ➕📋

Permite a los usuarios crear nuevas playlists, buscar canciones por título e ir agregándolas a su playlist, ingresando el nombre de la playlist y listando las canciones añadidas.

### Edit Playlist 📝📋

Permite modificar playlists existentes, añadiendo o eliminando canciones.

### NotFound ❓

Página de error 404 que se muestra cuando un usuario intenta acceder a una ruta inexistente, ofreciendo opciones para redirigir al login o al dashboard.

## Servicios Relevantes 🛠️

### Autenticación y Usuarios 🔒

Manejamos la autenticación y gestión de usuarios mediante servicios que se comunican con el backend para validar credenciales, crear nuevas cuentas y recuperar información del usuario actual o de otros usuarios. Además, ofrecemos la funcionalidad para que los usuarios actualicen su información personal, como nombre, correo electrónico y la imagen de perfil.

### Música y Artistas 🎤🎵

Gestionamos la música y los artistas permitiendo la búsqueda de álbumes y artistas en la base de datos, así como la creación de nuevos registros. También facilitamos la adición de nuevas canciones, incluyendo detalles como título, artistas, fecha de lanzamiento, género, duración y enlaces a plataformas externas.

### Playlists 📋

Para la gestión de playlists, nuestros servicios permiten crear nuevas playlists, recuperar playlists específicas por ID, obtener las playlists del usuario actual y las playlists de otros usuarios. También proporcionamos funcionalidades para añadir y eliminar canciones dentro de una playlist.

### Posts 📝

Los posts en nuestra plataforma son gestionados mediante servicios que permiten la creación de nuevos posts, así como la recuperación de posts globales y específicos de cada usuario, por los cuales se puede dar Like o Dislike a los mismos. También ofrecemos la funcionalidad para eliminar posts, asegurando que los usuarios tengan control total sobre su contenido.

### Interacción Social 💬

Fomentamos la interacción social entre los usuarios a través de servicios que permiten gestionar relaciones de amistad, añadiendo o eliminando amigos y verificando el estado de amistad. También ofrecemos funcionalidades para que los usuarios interactúen con los posts mediante likes y dislikes, creando una experiencia más envolvente y participativa.
