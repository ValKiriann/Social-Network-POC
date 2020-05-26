const usersService = require('../services/users.service');

//TODO: PARAMS SCHEMA
exports.createUser = async (params) => {
    let {username, email, password, password2, lat, lon} = params;
    // TODO: PARAM VALIDATION --> express-validator?
    if(!username || !email || !password || !password2 || !lat || !lon) {
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
    let hemisphere = await usersService.calculateHemisphere(lat, lon);
    let insert = hemisphere == "N" ? await usersService.createNorthernUser(username, email, password, lat, lon) : await usersService.createSouthernUser(params);
    return insert;
}