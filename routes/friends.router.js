const express = require('express');
const router = express.Router();
const responseUtils = require('../utils/response.utils');
const friendsController = require('../controllers/friends.controller');

//TODO: jsonwebtoken login
router.get('/list', function(req,res){
    //should use jsonwebtokenlogin
    return friendsController.getFriendsList(req.query.userId)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.get('/count', function(req,res){
    //should use jsonwebtokenlogin
    return friendsController.getUserDetails(req.query.userId)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

module.exports = router;