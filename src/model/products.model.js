import pool from "../../config/conexion.js";

export const getAllProducts = async () => {
  const sql = "SELECT * FROM productos";
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql);
    connection.release();
    return rows;
  } catch (error) {
    return error;
  }
};

export const getProductById = async (id) => {
  const sql = "SELECT * FROM productos WHERE id_productos = ?";
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [id]);
    connection.release();
    return rows;
  } catch (error) {
    return error;
  }
};

export const createProduct = async (values) => {
  const sql = "INSERT INTO productos SET ?";
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [values]);
    connection.release();
    return rows;
  } catch (error) {
    return error;
  }
};

export const updateProduct = async (newValues, id) => {
  const sql = "UPDATE productos SET ? WHERE id_productos = ?";
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [newValues, id]);
    connection.release();
    return rows;
  } catch (error) {
    return error;
  }
};

export const deleteProduct = async (id) => {
  const sql = "DELETE FROM productos WHERE id_productos = ?";
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [id]);
    connection.release();
    return rows;
  } catch (error) {
    return error;
  }
};
