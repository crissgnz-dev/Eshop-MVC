import pool from '../../config/conexion.js'

export const getUserByEmail = async(email) => {
    const sql = "SELECT * FROM users WHERE Email = ?"
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [email]);
        connection.release(); 
        return rows                
    } catch (error) {
        return error
    }
}

export const createUser = async(values) => {
    const sql = 'INSERT INTO users SET ?';
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [values]);
        connection.release();
        return rows 
    } catch (error) {
        return error
    }
}

export const getUserById = async(id) => {
    const sql = "SELECT * FROM users WHERE ID_user = ?";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        //hay que pasale el sql y el dato que reemplaza el signo ?
        connection.release();
        // console.log(rows)
        return rows         
    } catch (error) {
        // console.log(error)
        return error
    }
}

export const updateUser= async(id, values) => {
    const sql = 'UPDATE users SET ? WHERE ID_user = ?';
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [values, id]);
        connection.release();
        // console.log(rows)
        return rows
       
    } catch (error) {
        return error
    }
}

export const deleteUser = async(id) => {
    const sql = "DELETE FROM users WHERE ID_user = ?";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]); 
        connection.release();
        // console.log(rows)
        return rows
    } catch (error) {
      return error
    }
}