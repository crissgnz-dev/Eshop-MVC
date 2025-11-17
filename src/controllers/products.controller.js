import * as model from "../model/products.model.js";

export const getAllProducts = async (req, res) => {
  const rows = await model.getAllProducts();
  if (rows.errno) {
    return res
      .status(500)
      .send("ERROR, no se pudo realizar la consulta: " + rows.errno);
  }
  rows.length > 0
    ? res.json(rows)
    : res.status(404).send("No hay productos registrados");
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const rows = await model.getProductById(id);
  if (rows.errno) {
    return res
      .status(500)
      .send("ERROR, no se pudo realizar la consulta: " + rows.errno);
  }
  rows[0] ? res.json(rows[0]) : res.status(404).send("El producto no existe");
};

export const createProduct = async (req, res) => {
  const values = req.body;
  const rows = await model.createProduct(values);
  if (rows.errno) {
    return res
      .status(500)
      .send("ERROR, no se pudo realizar la consulta: " + rows.errno);
  }
  res.status(201).send("Producto creado con el id: " + rows.insertId);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const newValues = req.body;
  const rows = await model.updateProduct(newValues, id);
  if (rows.errno) {
    return res
      .status(500)
      .send("ERROR, no se pudo realizar la consulta: " + rows.errno);
  }
  rows.affectedRows === 0
    ? res.status(404).send("El producto no existe")
    : res.send("Datos actualizados");
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const rows = await model.deleteProduct(id);
  if (rows.errno) {
    return res
      .status(500)
      .send("ERROR, no se pudo realizar la consulta: " + rows.errno);
  }
  rows.affectedRows === 0
    ? res.status(404).send("El producto no existe")
    : res.send("Producto eliminado");
};
