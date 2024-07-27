//Libreria Mysql
const mysql = require('mysql2');
require('dotenv').config({ path: './env/.env'});

//Conexion a la Base de datos
const conexion = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
});

//Validar conexion DB
conexion.connect( (error)=> {
    if(error){
        console.log('El error de conexión es: '+error)
        return;
    }
    console.log('¡Conectado a la base de datos MySQL!');
});

module.exports = conexion;