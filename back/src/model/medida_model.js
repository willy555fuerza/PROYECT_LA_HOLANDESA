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
            const result = await request.query("SELECT * FROM medida");
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
            await request.query(`UPDATE medida SET estado = ${state} WHERE id_medida = ${userId}`);
            await disconnectToMssql(pool);
            return true;
        } catch (error) {
            return false;
        }
    } 
    // Función para crear un nueva categoria
    static async createUser(nombre_medida ,descripcion) {
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
            const query = `insert into medida (nombre_medida,descripcion,fecha_registro) 
                        values ('${nombre_medida}','${descripcion},','${fecha_registro}');`
    
            // Ejecutar la consulta con parámetros
            await pool.request()
                .input('nombre_medida', mssql.NVarChar, nombre_medida)
                .input('descripcion', mssql.NVarChar, descripcion)
                .input('fecha_registro', mssql.Date, fecha_registro)
                .query(query);
    
            console.log('Medida creado correctamente');
            return true;
        } catch (error) {
            console.error('Error al crear el medida:', error);
            return false;
        } finally {
            // Desconectar de la base de datos
            if (pool) {
                await disconnectToMssql(pool);
            }
        }
    }

    static async updateUser(id_medida, nombre_medida, descripcion) {
        let pool;
        try {
            // Conectar a la base de datos
            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con MSSQL');
            }
    
            // Consulta para actualizar un usuario en la base de datos
            const query = `UPDATE medida SET nombre_medida = '${nombre_medida}', descripcion = '${descripcion}' WHERE id_medida = ${id_medida}`;
            await pool.request().query(query);
    
            console.log('Medida actualizado correctamente');
            return true;
        } catch (error) {
            console.error('Error al actualizar la medida:', error);
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