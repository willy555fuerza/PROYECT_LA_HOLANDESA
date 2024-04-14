/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controller/medida_controller')


// Ruta para obtener todos los usuarios
router.get('/medida',Users.getAll)
// Ruta para cambiar el estado de un usuario
router.put('/medida/:userId/state', Users.changeState);
// Ruta para crear un nuevo usuario
router.post('/create_medida', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/medida/:id_medida', Users.updateUser);
 
module.exports = router 