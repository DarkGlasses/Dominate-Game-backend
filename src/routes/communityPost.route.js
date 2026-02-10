const express = require('express');
const app = express.Router();
const controller = require('../controllers/communityPost.controller');
const { authenticate, } = require('../middlewares/auth.middleware');
const { checkOwnerOrAdmin } = require('../middlewares/ownership');

app.post('/',
    // #swagger.tags = ['Community Posts']
    // #swagger.description = 'Create a community post.'
    authenticate,
    controller.createCommunityPost);

app.get('/',
    // #swagger.tags = ['Community Posts']
    // #swagger.description = 'Get all community posts.'
    controller.getCommunityPosts);

app.get('/:id',
    // #swagger.tags = ['Community Posts']
    // #swagger.description = 'Get a community post by ID.'
    controller.getCommunityPostById);

app.put('/:id',
    // #swagger.tags = ['Community Posts']
    // #swagger.description = 'Update a community post by ID.'
    authenticate,
    checkOwnerOrAdmin('communityPost', 'id'),
    controller.updateCommunityPost);

app.delete('/:id',
    // #swagger.tags = ['Community Posts']
    // #swagger.description = 'Delete a community post by ID.'
    authenticate,
    checkOwnerOrAdmin('communityPost', 'id'),
    controller.deleteCommunityPost);

app.post('/:postId/comments',
    // #swagger.tags = ['Community comments']
    // #swagger.description = 'Create a comment on a community post.'
    authenticate,
    controller.createCommentToPost);

app.put('/:postId/comments/:commentId',
    // #swagger.tags = ['Community comments']
    // #swagger.description = 'Update a comment on a community post.'
    authenticate,
    checkOwnerOrAdmin('communityComment', 'commentId'),   
    controller.updateCommentToPost);

app.delete('/:postId/comments/:commentId',
    // #swagger.tags = ['Community comments']
    // #swagger.description = 'Delete a comment on a community post.'
    authenticate,
    checkOwnerOrAdmin('communityComment', 'commentId'),
    controller.deleteCommentToPost);

app.post('/:postId/comments/replies',
    // #swagger.tags = ['Community comments replies']
    // #swagger.description = 'Create a reply to a comment on a community post.'
    authenticate,
    controller.createReplieToComment);

app.put('/:postId/comments/replies/:replyId',
    // #swagger.tags = ['Community comments replies']
    // #swagger.description = 'Update a reply to a comment on a community post.'
    authenticate,
    checkOwnerOrAdmin('communityReply', 'replyId'),
    controller.updateReplieToComment);

app.delete('/:postId/comments/replies/:replyId',
    // #swagger.tags = ['Community comments replies']
    // #swagger.description = 'Delete a reply to a comment on a community post.'
    authenticate,
    checkOwnerOrAdmin('communityReply', 'replyId'),
    controller.deleteReplieToComment);

module.exports = app;