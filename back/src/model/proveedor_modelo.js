/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const {connectToMssql,disconnectToMssql} = require('../config/index');
const bcrypt = require('bcryptjs');
const mssql = require('mssql');

class Usersmodel {
    // Método para obtener todos los usuarios
    static async getAll() { 
        try {
            const pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con MSSQL');
            }
            const request = pool.request();  
            const result = await request.query("SELECT * FROM proveedor");
            await disconnectToMssql(pool);
            console.log(result.recordset);
            if (result.recordset.length === 0) {
                return { data: null, error: true };
            }
            return { data: result.recordset, error: false };
        }catch (error) {
            return error;
        } 
    }
    // Método para cambiar el estado de un usuario
    static async changeState(userId, state) {
        try {
            const pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con MSSQL');
            }
            console.log("lol")
            const request = pool.request();
            // Actualizar el estado del usuario en la base de datos
            await request.query(`UPDATE proveedor SET estado = ${state} WHERE id_proveedor = ${userId}`);
            await disconnectToMssql(pool);
            return true;
        } catch (error) {
            return false;
        }
    } 
    // Función para crear un nueva categoria
    static async createUser(nombre_proveedor, telefono, descripcion, direccion) {
        let pool;
        try {
            // Conectar a la base de datos
            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con MSSQL');
            }
            // Obtener la fecha actual para la fecha de registro
            const currentDate = new Date();
            const fecha_registro = currentDate.toISOString(); // Convertir a formato ISO
    
            // Consulta para insertar un nuevo usuario en la base de datos
            const query = `insert into proveedor (nombre_proveedor,telefono,descripcion,direccion,fecha_registro) 
                        values ('${nombre_proveedor}','${telefono}','${descripcion}','${direccion}','${fecha_registro}');`
    
            // Ejecutar la consulta con parámetros
            await pool.request()
                .input('nombre_proveedor', mssql.NVarChar, nombre_proveedor)
                .input('telefono', mssql.NVarChar, telefono)
                .input('descripcion', mssql.NVarChar, descripcion)
                .input('direccion', mssql.NVarChar, direccion)
                .input('fecha_registro', mssql.Date, fecha_registro)
                .query(query);
    
            console.log('Proveedor creado correctamente');
            return true;
        } catch (error) {
            console.error('Error al crear al proveedor:', error);
            return false;
        } finally {
            // Desconectar de la base de datos
            if (pool) {
                await disconnectToMssql(pool);
            }
        }
    }

    static async updateUser(id_proveedor, nombre_proveedor, telefono, descripcion, direccion) {
        let pool;
        try {
            // Conectar a la base de datos
            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con MSSQL');
            }
    
            // Consulta para actualizar un usuario en la base de datos
            const query = `UPDATE proveedor SET nombre_proveedor = '${nombre_proveedor}', telefono = '${telefono}', descripcion = '${descripcion}', direccion = '${direccion}' WHERE id_proveedor = ${id_proveedor}`;
            await pool.request().query(query);
    
            console.log('Proveedor actualizado correctamente');
            return true;
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error);
            return false;
        } finally {
            // Desconectar de la base de datos
            if (pool) {
                await disconnectToMssql(pool);
            }
        }
    }  
}   


module.exports = Usersmodel 