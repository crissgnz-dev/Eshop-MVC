// src/middlewares/verify-token.js

import jwt from 'jsonwebtoken';
import 'dotenv/config';

// 🔑 Middleware para verificar el token JWT y el ROL de administrador
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Token no proporcionado o formato incorrecto (Bearer requerido)." });
    }

    try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // 🚨 VERIFICACIÓN DEL ROL (PASO CRUCIAL) 
        if (payload.role !== 'admin') {
            // 403 Forbidden: El token es válido, pero el usuario no es un administrador.
            return res.status(403).json({ message: "Permiso denegado. Solo administradores pueden realizar esta acción." });
        }

        req.user = payload; 
        next();   
    } catch (error) {
        // 401 Unauthorized: Token inválido, expirado, o la firma no coincide.
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
}