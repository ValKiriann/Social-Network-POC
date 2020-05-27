const express = require('express');
const router = express.Router();
const responseUtils = require('../utils/response.utils');
const {name} = require("../package.json");
const {port} = require('../config.json');
const usersController = require('../controllers/users.controller');

router.get('/', function(req,res){ 
    responseUtils.success(res,`Module ${name} is up at ${port}`,200);
});

router.get('/ping', function(req,res){ 
    responseUtils.success(res,'Pong', 200);
});

router.post('/test/body', function(req,res){ 
    if(req.body.error) {
        responseUtils.errors(res, {statusCode:500, errorCode: "Internal Error", errorData: "Contact administrator"})
    } else {
        responseUtils.success(res,req.body);
    }
});

//TODO: jsonwebtoken login
//TODO: get of all users (with filter options for search) --> we need this to check if a user is already in our system. (add deleted filter for admins)
router.get('/user/:id', function(req,res){
    //should use jsonwebtokenlogin
    return usersController.getUserDetails(req.params.id, req.query.deleted)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.patch('/user/:id', function(req,res){
    //should usejsonwebtokenlogin
    // CONCERNS: a separate endpoint for the password should be provided for security reasons TODO:
    return usersController.updateUserDetails(req.params.id, req.body)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.delete('/user/:id', function(req,res){
    // should usejsonwebtokenlogin
    //only admins or the own user could trigger this 
    return usersController.deleteUser(req.params.id)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.post('/user', function(req,res){
    return usersController.createUser(req.body)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.get('/test/query', function(req,res){ 
    responseUtils.success(res,req.query);
});

module.exports = router;