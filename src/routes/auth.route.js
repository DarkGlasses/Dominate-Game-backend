const express = require('express');
const app = express.Router();
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

app.post('/register',
    // #swagger.tags = ['Authentication']
    controller.register);

app.post('/login',
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Login a user.'
    controller.login);

app.get('/me',
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Get current user profile.'
    authenticate, controller.getProfile);

module.exports = app;
