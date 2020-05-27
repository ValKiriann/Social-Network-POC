const express = require('express');
const router = express.Router();
const responseUtils = require('../utils/response.utils');
const usersController = require('../controllers/users.controller');

//TODO: jsonwebtoken login
//TODO: get of all users (with filter options for search) --> we need this to check if a user is already in our system. (add deleted filter for admins)
router.get('/:id', function(req,res){
    //should use jsonwebtokenlogin
    return usersController.getUserDetails(req.params.id, req.query.deleted)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.patch('/:id', function(req,res){
    //should usejsonwebtokenlogin
    // CONCERNS: a separate endpoint for the password should be provided for security reasons TODO:
    return usersController.updateUserDetails(req.params.id, req.body)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.delete('/:id', function(req,res){
    // should usejsonwebtokenlogin
    //only admins or the own user could trigger this 
    return usersController.deleteUser(req.params.id)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

router.post('/', function(req,res){
    return usersController.createUser(req.body)
        .then(data => responseUtils.success(res, data))
        .catch(error => responseUtils.errors(res, error))
});

module.exports = router;