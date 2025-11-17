import mysql from "mysql2/promise";
//pool de conexiones en vez de createConection porque el pool permite que api no se sature con muchas consultas simultaneas
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "eshop",
  connectionLimit: 5,
});

// test connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Conectados :)");
    connection.release();
  })
  .catch((error) => {
    console.log("error de conexion", error);
  });

export default pool;
