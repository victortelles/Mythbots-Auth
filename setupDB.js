//Ejecutar en la consola "node setup.js"
//Crear La BDD y Tabla.

const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar las variables de entorno
dotenv.config({ path: './env/.env' });

//conexión a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

// Función para ejecutar consultas
const executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// Crear base de datos y tablas
const setupDatabase = async () => {
    try {
        // Crear base de datos si no existe
        const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`;
        await executeQuery(createDatabaseQuery);
        console.log('Base de datos creada si no existía.');

        // Seleccionar la base de datos
        connection.changeUser({ database: process.env.DB_DATABASE }, (err) => {
        if (err) throw err;
    });

    // Crear tabla si no existe
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            pass VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;
    await executeQuery(createTableQuery);
    console.log('Tabla creada si no existía.');

    } catch (error) {
        console.error('Error al crear la base de datos o la tabla:', error);
    } finally {
        // Cerrar la conexión
        connection.end();
    }
};

// Ejecutar el script
setupDatabase();
