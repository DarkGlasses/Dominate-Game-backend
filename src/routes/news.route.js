const express = require('express');
const app = express.Router();
const controller = require('../controllers/news.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

app.get('/',
    // #swagger.tags = ['News']
    // #swagger.description = 'Get all news'
    controller.getNews);

app.get('/:id'
    // #swagger.tags = ['News']
    // #swagger.description = 'Get news by ID'
    , controller.getNewsById);   

app.post('/',
    // #swagger.tags = ['News']
    // #swagger.description = 'Create a news item'
    authenticate,
    authorize(['admin']),
    controller.createNews);

app.put('/:id',
    // #swagger.tags = ['News']
    // #swagger.description = 'Update a news item by ID'
    authenticate,
    authorize(['admin']),
    controller.updateNews);

app.delete('/:id',
    // #swagger.tags = ['News']
    // #swagger.description = 'Delete a news item by ID'
    authenticate,
    authorize(['admin']),
    controller.deleteNews);

module.exports = app;