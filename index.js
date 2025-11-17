import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRouter from "./src/routes/users.routes.js";
import productsRoutes from "./src/routes/products.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("./public"));
app.use(cors());
app.use(cookieParser());

app.use("/users", usersRouter);

app.use(productsRoutes);

// app.get('/', (req, res) => {
//     res.send('<h1>Bienvenidos Backend Registro y login de usuarios</h1>')
// })

app.use((req, res) => {
  res.status(404).send("La ruta solicitada no existe");
});

app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
