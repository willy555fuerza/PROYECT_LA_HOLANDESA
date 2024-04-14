/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controller/categoria_controller')


// Ruta para obtener todos los usuarios
router.get('/categoria',Users.getAll)
// Ruta para cambiar el estado de un usuario
router.put('/categoria/:userId/state', Users.changeState);
// Ruta para crear un nuevo usuario
router.post('/create_categoria', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/categoria/:id_categoria', Users.updateUser);
 
module.exports = router 