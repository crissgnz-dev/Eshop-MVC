import { verifyToken as verifyClientToken } from "../middlewares/verify-token-cookie.js" // Middleware para clientes (usa cookie)
import { verifyToken as verifyAdminToken } from "../middlewares/verify-token.js" // Middleware para administradores (usa token en header)
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
    getAllUsers // Nuevo: Controlador para obtener todos los usuarios (Admin)
} from "../controllers/users.controllers.js"


// RUTAS PÚBLICAS Y DE AUTENTICACIÓN
// Ruta de verificación de sesión (se asume que es para el cliente)
router.get('/', verifyClientToken, verifySesionOpen) 
router.post('/register', register)
router.post('/login', login) // Login para clientes (guarda token en cookie)
router.post('/login/admin', loginAdmin) // Login para administradores (devuelve token en JSON)
router.get('/logout', logout)

// RUTAS PROTEGIDAS DE CLIENTE (Usan token en cookie)
router.get('/account', verifyClientToken, showAccount)
router.put('/upDate', verifyClientToken, updateAccount)
router.put('/setPassword', verifyClientToken, setPassword)
router.delete('/deleteAccount', verifyClientToken, deleteAccount)
router.post('/image', verifyClientToken, upload.single('imagen'), uploadImage)

// RUTAS PROTEGIDAS DE ADMINISTRADOR (Usan token en Authorization header)
// Estas rutas requieren que el cliente haya usado /login/admin para obtener el token.
router.get('/admin/panel', verifyAdminToken, (req, res) => res.json({ message: "Bienvenido al panel Admin" }));

// Nueva ruta para que el administrador pueda ver la lista de todos los usuarios
router.get('/admin/users', verifyAdminToken, getAllUsers);


export default router