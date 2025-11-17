
import { verifyToken, verifyT } from "../middlewares/verify-token-cookie.js"
import { Router } from "express"
const router = Router()

import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image_users')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// const upload = multer({ dest: 'uploads/' })

import {
    verifySesionOpen,
    register,
    login,
    logout,
    showAccount,
    updateAccount,
    uploadImage,
    setPassword,
    deleteAccount
 } from "../controllers/users.controllers.js"


router.get('/', verifyToken, verifySesionOpen)

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

//rutas protegidas
router.get('/account', verifyToken, showAccount)
router.put('/upDate', verifyToken, updateAccount)
router.put('/setPassword', verifyToken, setPassword)
router.delete('/deleteAccount', verifyToken, deleteAccount)

router.post('/image', verifyToken, upload.single('imagen'), uploadImage)

export default router