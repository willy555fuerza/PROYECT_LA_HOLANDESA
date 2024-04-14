/*****************conection 2*********************/

const Usersmodel = require('../model/proveedor_modelo') // Importa el modelo ProductosModel

class Users{
    // Método para obtener todos los usuarios
    static async getAll(req,res){
        try {
            const { data, error } = await Usersmodel.getAll();
            if (error) {
                throw new Error('No hay nada');
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Método para cambiar el estado de un usuario
    static async changeState(req, res) {
        try {
            const userId = req.params.userId;
            const { state } = req.body;
            // Llamar al método para cambiar el estado del usuario en el modelo
            const result = await Usersmodel.changeState(userId, state);
            res.status(200).json({ message: 'Estado del proveedor cambiado correctamente' });
        } catch (error) {
            console.error('Error al cambiar el estado del proveedor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Método para agregar una nueva categoria
    static async createUser(req, res) {
        try {
            const { nombre_proveedor, telefono, descripcion, direccion } = req.body;
    
            // Llamar al método para crear el usuario en el modelo
            const result = await Usersmodel.createUser(nombre_proveedor, telefono, descripcion, direccion);
    
            // Verificar si el usuario se creó correctamente en el modelo
            if (result) {
                // Usuario creado correctamente
                res.status(201).json({ message: 'Proveedor creado correctamente' });
            } else {
                // Error al crear el usuario en el modelo
                res.status(500).json({ error: 'Error al crear al proveedor' });
            }
        } catch (error) {
            console.error('Error al crear al proveedor:', error);
            res.status(500).json({ error: 'Error al crear al proveedor' });
        }
    }
    
    static async updateUser(req, res) {
        try {
            const { id_proveedor } = req.params;
            const { nombre_proveedor, telefono, descripcion, direccion } = req.body;
    
            // Llamar al método para actualizar el usuario en el modelo
            const result = await Usersmodel.updateUser(id_proveedor, nombre_proveedor, telefono, descripcion, direccion );
    
            // Verificar si el usuario se actualizó correctamente en el modelo
            if (result) {
                // Usuario actualizado correctamente
                res.status(200).json({ message: 'Proveedor actualizado correctamente' });
            } else {
                // Error al actualizar el usuario en el modelo
                res.status(500).json({ error: 'Error al actualizar el proveedor' });
            }
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error);
            res.status(500).json({ error: 'Error al actualizar el proveedor' });
        }
    }  
}

module.exports = Users 