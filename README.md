# MythBots-Auth

MythBots Auth es un sistema de autenticación basado en **Node.js**, **Express**, **MySQL** *(Local en Docker)* y **JWT**. Proporciona **registro y autenticación de usuarios** utilizando hash de contraseñas y tokens JWT para la gestión de sesiones. Ideal para aplicaciones que necesiten una autenticación segura y escalable.
Las vistas están renderizadas en EJS y los estilos son proporcionados por Bootstrap.

## Requisitos

Antes de comenzar, asegúrate de tener los siguientes requisitos:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (gestor de paquetes de Node.js)
- [Docker](https://www.docker.com/) (para ejecutar MySQL en un contenedor)

## Instalación
Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.
### Clonar el Repositorio
```sh
git clone https://github.com/victortelles/Mythbots-Auth.git
```
### Instalar dependencias
```sh
npm install
```
### Configurar MySQL con Docker
```sh
docker run --name mysql-mythbots -e MYSQL_ROOT_PASSWORD=tu_contraseña -e MYSQL_DATABASE=databaseName -p 3306:3306 -d mysql:latest
```
### Configurar del entorno
Archivo = .env
```sh
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=databaseName
JWT_SECRETO=tu_secreto
JWT_TIEMPO_EXPIRA=1d
JWT_COOKIE_EXPIRES=90
```
### Crear Base de datos y Tabla
```sh
node .\setupDB.js
```
### Ejecutar la aplicacion
```sh
node .\app.js
```
- La aplicación debería estar corriendo en http://localhost:3000.

Las rutas disponibles son:
- http://localhost:3000/login
- http://localhost:3000/register

## Dependencias
- bcryptjs: *^2.4.3* - Cifrado de contraseñas.
- cookie-parser: *^1.4.5* - Middleware para analizar cookies.
- dotenv: *^10.0.0* - Cargar variablers de entorno desde un archivo `.env`.
- ejs: *^3.1.6* - Motor de plantillas.
- express: *^4.17.1* - Framework para construir App web.
- express-session: *1.17.2* - Middleware para gestionar sesiones.
- jsonwebtoken[JWT]: *^8.5.1* - Implementacion de JSON Web Tokens.
- mysql2: *^3.10.3* - Cliente MySQL para Node.js.

# Licencia
Este proyecto está bajo la Licencia MIT. Puedes ver el archivo `LICENSE` para mas detalles.

