import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Obtiene la clave secreta del .env
const secretKey = process.env.SECRET_PRIVATE_KEY; 

// Middleware para verificar el token JWT en el Authorization Header (USADO POR ADMINISTRADORES)
export const verifyToken = (req, res, next) => {
    // 1. Obtener el valor del encabezado de Autorización
    const authHeader = req.headers['authorization'];

    // 2. Verificar si el encabezado existe
    if (!authHeader) {
        // 401 Unauthorized: No se proporcionó el encabezado
        return res.status(401).json({ 
            message: "Acceso denegado. No se proporcionó el token." 
        });
    }

    // El formato esperado es "Bearer <token>"
    const tokenParts = authHeader.split(' ');
    
    // 3. Verificar el formato del token
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        // 401 Unauthorized: Formato incorrecto
        return res.status(401).json({ 
            message: "Formato de token incorrecto. Debe ser 'Bearer <token>'" 
        });
    }

    const token = tokenParts[1];

    // 4. Verificar la clave secreta
    if (!secretKey) {
        console.error("FATAL: La clave secreta (SECRET_PRIVATE_KEY) no está definida en .env");
        return res.status(500).json({ message: "Error interno del servidor: Clave de autenticación no configurada." });
    }

    // 5. Verificar el token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            // 401 Unauthorized: Token inválido o expirado
            return res.status(401).json({ 
                message: "Token inválido o expirado.",
                error: err.name // Muestra el tipo de error (e.g., JsonWebTokenError, TokenExpiredError)
            });
        }
        
        // Opcional: Verificar que el rol sea 'admin' si es necesario
        // if (user.role !== 'admin') {
        //     return res.status(403).json({ message: "Acceso prohibido. Rol insuficiente." });
        // }

        // El token es válido, adjuntamos el payload (usuario) a la solicitud
        req.user = user;
        next(); // Continuar con la siguiente función (el controlador de la ruta)
    });
};