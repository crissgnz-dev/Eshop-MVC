
import { verifyToken, verifyT } from "../middlewares/verify-token-cookie.js"
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
    deleteAccount
 } from "../controllers/users.controllers.js"


// RUTAS PÚBLICAS Y DE AUTENTICACIÓN
// Ruta de verificación de sesión (se asume que es para el cliente)
router.get('/', verifyClientToken, verifySesionOpen) 
router.post('/register', register)
router.post('/login', login) // Login para clientes (guarda token en cookie)
router.post('/login/admin', loginAdmin) // Login para administradores (devuelve token en JSON)
router.get('/logout', logout)

//rutas protegidas
router.get('/account', verifyToken, showAccount)
router.put('/upDate', verifyToken, updateAccount)
router.put('/setPassword', verifyToken, setPassword)
router.delete('/deleteAccount', verifyToken, deleteAccount)

router.post('/image', verifyToken, upload.single('imagen'), uploadImage)

export default router