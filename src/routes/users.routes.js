// src/routes/users.routes.js

// 🚨 CORRECCIÓN: Aseguramos la importación de verifyToken de la cookie (renombrada a verifyClientToken) 
// y verifyT (la versión estricta).
import { verifyToken as verifyClientToken, verifyT } from "../middlewares/verify-token-cookie.js" 
import { verifyToken as verifyAdminToken } from "../middlewares/verify-token.js" // Importa el middleware de Admin (Authorization Header)
import { Router } from "express"
const router = Router()

import path from "path";
import multer from "multer";

// Configuración de Multer para almacenar imágenes de usuarios
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Asegúrate de que esta carpeta exista
        cb(null, 'public/image_users')
    },
    filename: function (req, file, cb) {
        // Genera un nombre de archivo único
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

import {
    verifySesionOpen,
    register,
    login,
    loginAdmin,
    logout,
    showAccount,
    updateAccount,
    uploadImage,
    setPassword,
    deleteAccount,
    getAllUsers // Importación del controlador para la ruta de administración
} from "../controllers/users.controllers.js"


// RUTAS PÚBLICAS Y DE AUTENTICACIÓN
// 1. Ruta de verificación de sesión de cliente (usa verifyClientToken)
router.get('/', verifyClientToken, verifySesionOpen) 
router.post('/register', register)
router.post('/login', login) // Login para clientes (guarda token en cookie)
router.post('/login/admin', loginAdmin) // Login para administradores (guarda token en cookie)
router.get('/logout', logout)

// RUTAS PROTEGIDAS DE CLIENTE
// 2. Usan verifyT (versión estricta de la cookie que devuelve 403/401 si no hay token)
router.get('/account', verifyT, showAccount)
router.put('/upDate', verifyT, updateAccount)
router.put('/setPassword', verifyT, setPassword)
router.delete('/deleteAccount', verifyT, deleteAccount)
router.post('/image', verifyT, upload.single('imagen'), uploadImage)

// RUTAS PROTEGIDAS DE ADMINISTRADOR (Usan Cookie)

/**
 * Endpoint de verificación de sesión de administrador.
 * Usa 'verifyClientToken' para leer la Cookie HTTP-Only y luego verifica el rol.
 */
router.get('/verify-admin-session', verifyClientToken, (req, res) => {
    
    // verifyClientToken ya intentó cargar el payload de la cookie en req.user.
    
    // Verificamos si hay usuario y si su Type_user es 1 (Admin)
    if (req.user && req.user.Type_user === 1) { 
        // Éxito: Cookie válida y usuario es Admin
        return res.status(202).json({ // 🚨 Importante: Estado 202 para el front-end
            message: 'Administrador verificado', 
            role: 'admin', 
            user: { id: req.user.ID_user, email: req.user.Email } 
        });
    } else if (req.user) {
        // Fallo por Rol: Cookie válida, pero el usuario no es Admin
        return res.status(403).json({ 
            message: 'Acceso denegado: Se requiere rol de administrador.', 
            role: req.user.Type_user
        });
    } else {
        // Fallo por Autenticación: Cookie no válida o no presente
        return res.status(401).json({ 
            message: 'Sesión inválida o expirada. Por favor, inicie sesión.' 
        });
    }
});

// 3. Estas rutas usan verifyAdminToken (Authorization Header) - 
//    Si las llamas desde el frontend, recuerda que necesitan el header manual, no la cookie.
router.get('/admin/panel', verifyAdminToken, (req, res) => res.json({ message: "Bienvenido al panel Admin" }));
router.get('/admin/users', verifyAdminToken, getAllUsers); 

export default router;