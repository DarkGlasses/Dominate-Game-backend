const express = require('express');
const app = express.Router();
const controller = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

app.get('/',
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get all users.'
    authenticate,
    authorize(['admin']),
    controller.getUsers);

app.get('/:id',
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get user by ID.'
    authenticate,
    authorize(['admin']),
    controller.getUserById);

app.post('/',
    // #swagger.tags = ['Users']
    // #swagger.description = 'Create a new user.'
    authenticate,
    controller.createUser);

app.put('/:id',
    // #swagger.tags = ['Users']
    // #swagger.description = 'Update user by ID.'
    authenticate,
    controller.updateUser);

app.delete('/:id',
    // #swagger.tags = ['Users']  
    // #swagger.description = 'Delete user by ID.'
    authenticate,
    controller.deleteUser);

module.exports = app;