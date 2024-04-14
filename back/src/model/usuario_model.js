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
            const result = await request.query("SELECT * FROM usuario");
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
            const request = pool.request();
            // Actualizar el estado del usuario en la base de datos
            await request.query(`UPDATE usuario SET estado = ${state} WHERE id_usuario = ${userId}`);
            await disconnectToMssql(pool);
            return true;
        } catch (error) {
            return false;
        }
    } 
    static async createUser(nombres, apellidos, perfil, usuario, contraseña) {
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
            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(contraseña, 10);
    
            // Consulta para insertar un nuevo usuario en la base de datos
            const query = `INSERT INTO usuario (nombres, apellidos, perfil, usuario, contraseña, fecha_registro)
                        VALUES ('${nombres}', '${apellidos}', '${perfil}', '${usuario}', '${contraseña}', '${fecha_registro}')`;
    
            // Ejecutar la consulta con parámetros
            await pool.request()
                .input('nombres', mssql.NVarChar, nombres)
                .input('apellidos', mssql.NVarChar, apellidos)
                .input('perfil', mssql.NVarChar, perfil)
                .input('usuario', mssql.NVarChar, usuario)
                .input('contraseña', mssql.NVarChar, hashedPassword)
                .input('fecha_registro', mssql.DateTime, fecha_registro)
                .query(query);
    
            console.log('Usuario creado correctamente');
            return true;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            return false;
        } finally {
            // Desconectar de la base de datos
            if (pool) {
                await disconnectToMssql(pool);
            }
        }
    }

    static async updateUser(id_usuario, nombres, apellidos, perfil, usuario) {
        let pool;
        try {
            // Conectar a la base de datos
            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con MSSQL');
            }
    
            // Consulta para actualizar un usuario en la base de datos
            const query = `UPDATE usuario SET nombres = '${nombres}', apellidos = '${apellidos}', perfil = '${perfil}', usuario = '${usuario}' WHERE id_usuario = ${id_usuario}`;
            await pool.request().query(query);
    
            console.log('Usuario actualizado correctamente');
            return true;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
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