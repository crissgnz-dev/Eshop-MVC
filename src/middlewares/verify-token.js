import jwt from 'jsonwebtoken';
import 'dotenv/config';


// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  // console.log(authHeader)
 

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" })
  }

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload //console.log(req.user)
    next();   
  } catch (error) {
    return res.status(401).json({ message: "Token invalido" })
  }
}

