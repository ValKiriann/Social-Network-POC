const express = require('express');
const router = express.Router();
const responseUtils = require('../utils/response.utils');
const {name} = require("../package.json");
const {port} = require('../config.json');
const usersController = require('../controllers/users.controller');

router.get('/', function(req,res){ 
    responseUtils.success(req,res,`Module ${name} is up at ${port}`,200);
});

router.get('/ping', function(req,res){ 
    responseUtils.success(req,res,'Pong', 200);
});

router.post('/test/body', function(req,res){ 
    if(req.body.error) {
        responseUtils.errors(req,res, {statusCode:500, errorCode: "Internal Error", errorData: "Contact administrator"})
    } else {
        responseUtils.success(req,res,req.body);
    }
});

//TODO: jsonwebtoken login
//TODO: get of all users (with filter options for search) --> we need this to check if a user is already in our system. (add deleted filter for admins)
router.get('/user/:id', function(req,res){
    //should use jsonwebtokenlogin
    return usersController.getUserDetails(req.params.id)
        .then(data => responseUtils.success(req, res, data))
        .catch(error => responseUtils.errors(req, res, error))
});

router.post('/user', function(req,res){
    return usersController.createUser(req.body)
        .then(data => responseUtils.success(req, res, data))
        .catch(error => responseUtils.errors(req, res, error))
});

router.get('/test/query', function(req,res){ 
    responseUtils.success(req,res,req.query);
});

module.exports = router;