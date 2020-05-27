//TODO: PARAMS SCHEMA
const usersService = require('../services/users.service');

// IMPROVE: if admin, check for query param deleted = true to return deleted users*
exports.getUserDetails = async (userId) => {
    if(!userId || isNaN(userId)) {
        throw({
            statusCode: 400,
            errorCode: "Invalid params",
            errorData: "One or more required params are missing"
        })
    }
    // CONCERN: what about southern hemisphere? how should I get shouthern hemisphere users?
    // CONCER: is it email a private field?
    let userDetails = await usersService.getUserDetails(userId);
    return userDetails;
}

exports.createUser = async (params) => {
    let {username, email, password, password2, latitude, longitude, language} = params;
    // TODO: PARAM VALIDATION --> express-validator?
    if(!username || !email || !password || !password2 || !latitude || !longitude || !language) {
        throw({
            statusCode: 400,
            errorCode: "Invalid params",
            errorData: "One or more required params are missing"
        })
    };
    if(password != password2) {
        throw({
            statusCode: 400,
            errorCode: "Invalid params",
            errorData: "Entered passwords don't match"
        })
    }
    let hemisphere = await usersService.calculateHemisphere(latitude, longitude);
    let insert = hemisphere == "N" 
        ? await usersService.createNorthernUser(username, email, password, latitude, longitude, language) 
        : await usersService.createSouthernUser(params);
    console.info('[FINISHED] User Created');
    return insert;
}