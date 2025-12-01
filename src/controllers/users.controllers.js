// src/controllers/users.controllers.js

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config';
import * as model from '../model/users.model.js'


export const verifySesionOpen = (req, res) => {
    res.status(202).json({ message: "estamos en sesion" })
    //status(202) aceptado
}

export const register = async (req, res) => {
    // console.log(req.body)
    //desestructuro email y contraseña del body, para verificar que no esten vacios
    const { Email, Pass } = req.body

    //verifico que los datos se hayan completado
    if (!Email || !Pass) {
        return res.status(422).json({ message: "email y contraseña requeridos" })
    }

    //verifico que el usuario no exista en la db
    const exists = await model.getUserByEmail(Email)
    if (exists.errno) { return res.status(500).json({ message: `Error en consulta para verificar duplicado de usuarios ${exists.errno}` }) }
    if (exists[0]) { return res.json({ message: "Este correo ya se encuentra registrado" }) }

    //si no existe, encripto contraseña y registro
    const passwordHash = await bcrypt.hash(Pass, 10)
    req.body.Pass = passwordHash //coloco en req.body la contraseña encriptada

    // 🔑 CAMBIO 1: Asegurar que el usuario registrado sea por defecto un cliente (Type_user = 0)
    // Asumo que el modelo de creación de usuario puede aceptar Type_user, o si no lo recibe, lo crea como 0.
    // Si la tabla users tiene un Type_user por defecto, esto puede omitirse,
    // pero es más seguro definirlo si no lo envías desde el frontend.
    if (!req.body.Type_user) {
        req.body.Type_user = 0; // 0 para clientes
    }

    const rows = await model.createUser(req.body)

    if (rows.errno) {
        return res.status(500).json({ message: `Error en consulta ${rows.errno}` })
    }
    //row devuelve muchos datos entre ellos el id creado, es lo que retorno
    res.status(201).json({ message: `${req.body.Name} Usuario Creado con id ${rows.insertId} ` })
}

/**
 * Función de Login para CLIENTES (usa Cookies para el token)
 */
export const login = async (req, res) => {
    // console.log(req.body)
    
    //verifico que los datos se hayan completado
    const { Email, Pass } = req.body
    if (!Email || !Pass) {
        return res.status(422).json({ message: "email y contraseña requeridos" })
    }

    //verifico existencia del usuario por email en la db
    const user = await model.getUserByEmail(Email)

    if (user.errno) { return res.status(500).send(`Error en consulta, buscando usuario ${user.errno}`) }
    if (!user[0]) { return res.status(401).json({ message: "Credenciales invalidas" }) }


    // console.log(user[0])
    //si existe, comparo contraseñas
    const valid = await bcrypt.compare(Pass, user[0].Pass)
    if (!valid) {
        return res.status(401).json({ message: "Credenciales invalidas" })
    }

    // 🔑 Creamos el payload del token de CLIENTE
    const payload = { 
        id: user[0].ID_user, 
        name: user[0].Name, 
        // 🔑 CAMBIO 2: Si el usuario es cliente, el rol es 'client'. Si es admin, aún entraría aquí 
        // pero lo manejaremos con loginAdmin para separarlos.
        role: (user[0].Type_user === 1) ? 'admin' : 'client'
    }
    
    const expiration = { expiresIn: "24h" } // tiempo de expiracion del token
    const token = jwt.sign(payload, process.env.JWT_SECRET, expiration) //firma digital con la clave secreta
    // console.log(token)
    res.cookie("access_token", token,{
        httpOnly: true, // la coolie solo se puede acceder en el servidor
        // secure: true, //para que solo funciones con https
        sameSite: 'strict', // solo se puede acceder desde el mismo dominio
        maxAge: 1000*60*60 //la cookie tiene un tiempo de validez de una hora
    })
    const data = user[0].Name
    res.status(202).json({ message: "sesion iniciada ", data})
}

/**
 * Función de Login para ADMINISTRADORES (devuelve Token en JSON para localStorage)
 */
export const loginAdmin = async (req, res) => {
    const { Email, Pass } = req.body; 

    if (!Email || !Pass) {
        return res.status(422).json({ message: "email y contraseña requeridos" });
    }

    try {
        const user = await model.getUserByEmail(Email);

        if (user.errno) { return res.status(500).send(`Error en consulta, buscando usuario ${user.errno}`); }
        if (!user[0]) { return res.status(401).json({ message: "Credenciales invalidas" }); }
        
        // 1. Validar contraseña
        const valid = await bcrypt.compare(Pass, user[0].Pass);
        if (!valid) {
            return res.status(401).json({ message: "Credenciales invalidas" });
        }

        // 2. 🚨 VALIDACIÓN CRUCIAL: Verificar que el Type_user sea 1 (Administrador)
        if (user[0].Type_user !== 1) {
            return res.status(403).json({ error: 'Acceso denegado. Solo administradores autorizados.' });
        }
        
        // 3. Crear el payload con el rol de admin
        const payload = {
            id: user[0].ID_user,
            name: user[0].Name,
            role: 'admin', // Clave que se verifica en el middleware
        };

        const expiration = { expiresIn: "1h" }
        const token = jwt.sign(payload, process.env.JWT_SECRET, expiration);

        // 4. Devolver el token directamente en la respuesta JSON
        res.status(200).json({ token, message: 'Login de administrador exitoso' });

    } catch (error) {
        console.error('Error durante el proceso de login de administrador:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}


export const logout = (req, res) => {
    //eliminamos la cookie del token
    res.clearCookie("access_token").json({message: 'session cerrada'})
}

export const showAccount = async(req, res) => {
    // console.log(req.user)
   // req.user se definio en verifyToken y contiene el payload del token
    const id = parseInt(req.user.id)
    const rows = await model.getUserById(id)

    //si rows trae el error del catch este es un objeto que tiene una propiedad 
    // "errno" cod. de error
    if (rows.errno) {
        return res.status(500).json({message : `Error en consulta ${rows.errno}`})
    }

    //rows devuelve un array que contiene un objeto, con [0] tomo solo el objeto  
    (!rows[0]) ? res.status(404).json({message: 'El usuario no existe'}) : res.json(rows[0])
}

export const updateAccount = async(req, res) => {
    // req.user se definio en verifyToken y contiene el payload del token
    const rows = await model.updateUser(req.user.id, req.body)

    //si row trae el error del catch este es un objeto que tiene una propiedad
    //  "errno" cod. de error
    if (rows.errno) {
        return res.status(500).json({message : `Error en consulta ${rows.errno}`})
    }
    //row devuelve muchos datos entre ellos "affectedRows" cantidad de registros afectados,
    //  si es igual a cero no se modifico ningun registro
    if (rows.affectedRows == 0) { return res.status(404).json({message: 'El usuario no existe'}) }
    res.json({message: 'datos actualizados'})
}

export const setPassword = async(req, res) => {
    //desestructuro contraseña del body, para verificar que no esten vacio
    const { Pass } = req.body
    

    //verifico que los datos se hayan completado
    if (!Pass) {
        return res.status(422).json({ message: "Nueva contraseña requerida" })
    }
    const passwordHash = await bcrypt.hash(Pass, 10) // console.log(req.body)
    req.body.Pass = passwordHash //coloco en req.body la contraseña encriptada

    // req.user se definio en verifyToken y contiene el payload del token
    const rows = await model.updateUser(req.user.id, req.body)

    //si row trae el error del catch este es un objeto que tiene una propiedad
    //  "errno" cod. de error
    if (rows.errno) {
        return res.status(500).json({message : `Error en consulta ${rows.errno}`})
    }
    //row devuelve muchos datos entre ellos "affectedRows" cantidad de registros afectados,
    //  si es igual a cero no se modifico ningun registro
    if (rows.affectedRows == 0) { return res.status(404).json({message: 'El usuario no existe'}) }
    
    //eliminamos la cookie del token, cerranos sesion
    res.clearCookie("access_token").json({message: 'Contraseña actualizada'})
}

export const deleteAccount = async(req, res) => {
    // req.user se definio en verifyToken y contiene el payload del token
    //  const id = parseInt(req.user.id)
    const rows = await model.deleteUser(req.user.id)

    if (rows.errno) {
        return res.status(500).json({message : `Error en consulta ${rows.errno}`})
    }
    
    //row devuelve muchos datos entre ellos "affectedRows" cantidad de registros afectados, 
    // si es igual a cero no se modifico ningun registro
    if (rows.affectedRows == 0) { return res.status(404).json({message: 'El usuario no existe'}) }
        //eliminamos la cookie del token
    res.clearCookie("access_token").json({message:'Cuenta eliminada'})
}

export const uploadImage = async(req, res) => {
    console.log('subiendo imagen')
    console.log(req.file)
    const { filename: image } = req.file
    console.log(image)
    const image_user = {Image : image}

    // req.user se definio en verifyToken y contiene el payload del token
    const rows = await model.updateUser(req.user.id, image_user)

    //si row trae el error del catch este es un objeto que tiene una propiedad
    //  "errno" cod. de error
    if (rows.errno) {
        return res.status(500).json({message : `Error en consulta ${rows.errno}`})
    }
    //row devuelve muchos datos entre ellos "affectedRows" cantidad de registros afectados,
    //  si es igual a cero no se modifico ningun registro
    if (rows.affectedRows == 0) { return res.status(404).json({message: 'El usuario no existe'}) }
    res.json({message: 'datos actualizados'})
}