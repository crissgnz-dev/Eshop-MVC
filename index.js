import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// --- Importaciones y Configuración ---
dotenv.config();

// Rutas de Express
import usersRouter from "./src/routes/users.routes.js";
import productsRoutes from "./src/routes/products.routes.js";

// Middleware de autenticación (debe estar disponible para proteger rutas)
// ⚠️ IMPORTACIÓN CRUCIAL: Necesitamos el middleware de COOKIE (verifyT) para la navegación
import { verifyT } from './src/middlewares/verify-token-cookie.js'; // Asumiendo que verifyT está aquí

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para usar __dirname en módulos ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares Globales
app.use(express.json());
// ⚠️ CORS CON CONFIGURACIÓN DE COOKIES: Crucial para el desarrollo con puertos separados
app.use(cors({ 
    origin: 'http://localhost:3000', // Permite solicitudes del mismo origen (frontend y backend en 3000)
    credentials: true // Crucial para permitir el envío y recepción de cookies
})); 
app.use(cookieParser());

// =======================================================
// 1. Archivos Estáticos: Permite servir CSS, JS, img, index.html, login.html
// =======================================================
app.use(express.static(join(__dirname, 'public')));


// =======================================================
// 2. RUTA PROTEGIDA PARA ADMINISTRACION
// CAMBIO CRUCIAL: Usamos [verifyT] (middleware de COOKIE) para proteger la navegación
// =======================================================
app.get('/administracion.html', [verifyT], (req, res) => {
    // Si verifyT pasa, servimos la página. Si no, verifyT ya respondió con 401/403.
    const filePath = join(__dirname, 'public', 'administracion.html');
    res.sendFile(filePath);
});
// =======================================================


// Rutas API
app.use("/users", usersRouter);
app.use(productsRoutes);


// Middleware para manejar el 404, debe ir al final
app.use((req, res) => {
    res.status(404).send("La ruta solicitada no existe");
});

app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
);