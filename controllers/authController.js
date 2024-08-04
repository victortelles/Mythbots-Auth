//Librerias
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')

//Register.ejs
// Procedimiento para registrarnos
exports.register = async (req, res) => {
    try {
        const { name, user, pass } = req.body;

        // Validaciones: Verificar si algún campo está vacío
        if (!name || !user || !pass) {
            return res.render('register', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Todos los campos son obligatorios",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: 6000,
                ruta: 'register'
            });
        }

        // Verificar si el usuario ya existe
        conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (error) {
                console.log(error);
                return res.render('register', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Hubo un error en el servidor",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 6000,
                    ruta: 'register'
                });
            }

            if (results.length > 0) {
                return res.render('register', {
                    alert: true,
                    alertTitle: "Advertencia",
                    alertMessage: "El usuario ya existe",
                    alertIcon: 'warning',
                    showConfirmButton: true,
                    timer: 6000,
                    ruta: 'register'
                });
            }

            // Si todo está bien, procedemos a registrar al usuario
            let passHash = await bcryptjs.hash(pass, 8);
            conexion.query('INSERT INTO users SET ?', { user: user, name: name, pass: passHash }, (error, results) => {
                if (error) {
                    console.log(error);
                    return res.render('register', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Hubo un error en el registro",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 6000,
                        ruta: 'register'
                    });
                }
                // Notificación de registro exitoso
                return res.render('register', {
                    alert: true,
                    alertTitle: "Registro exitoso",
                    alertMessage: "¡Te has registrado correctamente!",
                    alertIcon: 'success',
                    showConfirmButton: true,
                    timer: 1500,
                    ruta: 'login'
                });
            });
        });

    } catch (error) {
        console.log(error);
        return res.render('register', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Hubo un error en el servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'register'
        });
    }
}

//login.ejs

exports.login = async (req, res)=>{
    try {
        const user = req.body.user
        const pass = req.body.pass

        if(!user || !pass ){
            //Notificacionde de inicio de sesión == sin datos
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: 6000,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    //Notificacionde de inicio de sesión == Error
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: 6000,
                        ruta: 'login'
                    })
                }else{
                    //inicio de sesión == OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                    //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                    console.log("TOKEN: "+token+"\nPara el USUARIO : "+user)

                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    //Notificacionde de inicio de sesión == Ok
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 1000,
                        ruta: ''
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')
    }
}

exports.logout = (req, res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}