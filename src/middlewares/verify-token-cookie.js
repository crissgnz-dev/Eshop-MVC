// src/middlewares/verify-token-cookie.js



import jwt from 'jsonwebtoken';

import 'dotenv/config';





// Middleware para verificar el token JWT que esta en la cookie del usuario

export const verifyT = (req, res, next) => {

    try {

        const token = req.cookies.access_token;

        if (!token) {

            return res.status(403).json('Acceso no Autorizado');

        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // req.user = payload; // Si necesitas el payload en el controlador

        next();  

    } catch (error) {

        return res.status(401).json({ message: "Acceso no Autorizado" });

    }



}



// Middleware simplificado, sin response, solo para cargar el usuario en req.user

export const verifyToken = (req, res, next) => {

    try {

        const token = req.cookies.access_token;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

       

        // Ahora, req.user contiene el payload (id, role, etc.) del token

        req.user = payload;

        next();  

    } catch (error) {

        // Silencioso, permite que el controlador maneje la falta de usuario si es necesario

        next();

    }

}