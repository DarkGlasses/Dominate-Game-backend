const express = require('express');
const app = express.Router();
const controller = require('../controllers/game.controller');
const { authenticate, authorize, } = require('../middlewares/auth.middleware');
const { checkOwnerOrAdmin } = require('../middlewares/ownership');


app.get('/',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Get all games'
    controller.getGames);

app.get('/by-title',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Get game by title'
    controller.getGameByTitle);

app.get('/by-genre',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Get game by genre'
    controller.getGameByGenre);

app.get('/by-platform',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Get game by platform'
    controller.getGameByPlatform);

app.get('/by-developer',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Get game by developer'
    controller.getGameByDeveloper);

app.get('/by-publisher',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Get game by publisher'
    controller.getGameByPublisher);

app.get('/:id',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Get game by ID'    
    controller.getGameById); 

app.post('/',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Create a new game'
    authenticate,
    authorize(['admin']),
    controller.createGame);

app.put('/:id',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Update a game by ID'
    authenticate,
    authorize(['admin']),
    controller.updateGame);

app.delete('/:id',
    // #swagger.tags = ['Games']
    // #swagger.description = 'Delete a game by ID'
    authenticate,
    authorize(['admin']),
    controller.deleteGame);

app.post('/:gameId/reviews',
    // #swagger.tags = ['Game Reviews']
    // #swagger.description = 'Create a review for a game'
    authenticate,
    controller.createGameReview);

app.get('/:gameId/reviews',
    // #swagger.tags = ['Game Reviews']
    // #swagger.description = 'Get all reviews for a game'
    controller.getGameReviews);

app.get('/:gameId/reviews/:reviewId',
    // #swagger.tags = ['Game Reviews']
    // #swagger.description = 'Get a specific review for a game by review ID'
    controller.getGameReviewById);

app.put('/:gameId/reviews/:reviewId',
    // #swagger.tags = ['Game Reviews']
    // #swagger.description = 'Update a specific review for a game by review ID'
    authenticate,
    checkOwnerOrAdmin('gameReview', 'reviewId'),
    controller.updateGameReview);

app.delete('/:gameId/reviews/:reviewId',
    // #swagger.tags = ['Game Reviews']
    // #swagger.description = 'Delete a specific review for a game by review ID'
    authenticate,
    checkOwnerOrAdmin('gameReview', 'reviewId'),
    controller.deleteGameReview);

module.exports = app;