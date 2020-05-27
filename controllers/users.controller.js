//TODO: PARAMS SCHEMA
const usersService = require('../services/users.service');

// IMPROVE: if admin, check for query param deleted = true to return deleted users*
exports.getUserDetails = async (userId) => {
    if(!userId || isNaN(userId)) {
        //TODO: search it in third party api --when no results found
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
};

exports.updateUserDetails = async (userId, updateParams) => {
    let updateValues = usersService.findValidUpdateValuesSync(updateParams);
    console.log(updateValues);
    console.log(updateParams)
    console.log(Object.keys(updateParams).length == 0)
    console.log("UPDATE VALUES" + JSON.stringify(updateValues))
    console.log(updateValues.length == 0)
    if(!updateParams || Object.keys(updateParams).length == 0 || updateValues.length == 0) {
        console.log('entro')
        console.error(`[ERROR] Missing params`);
        throw({
            statusCode: 400,
            errorCode: "Invalid params",
            errorData: "One or more required params are missing"
        })
    }
    return usersService.updateUserDetails(userId, updateValues)
};

exports.createUser = async (params) => {
    let {username, email, password, password2, latitude, longitude, language} = params;
    // TODO: PARAM VALIDATION --> express-validator?
    if(!username || !email || !password || !password2 || !latitude || !longitude || !language) {
        console.error(`[ERROR] Missing params`);
        throw({
            statusCode: 400,
            errorCode: "Invalid params",
            errorData: "One or more required params are missing"
        })
    };
    if(password != password2) {
        console.error(`[ERROR] Entered passwords dont match`);
        throw({
            statusCode: 400,
            errorCode: "Invalid params",
            errorData: "Entered passwords don't match"
        })
    }
    let hemisphere = await usersService.calculateHemisphere(latitude, longitude);
    let userFound = await usersService.getUserbyEmail(email);
    if(userFound) {
        console.error(`[ERROR] Email is already registered`);
        throw({
            statusCode: 400,
            errorCode: "Already registered",
            errorData: "Email is already in use"
        })
    }
    let insert = hemisphere == "N" 
        ? await usersService.createNorthernUser(username, email, password, latitude, longitude, language) 
        : await usersService.createSouthernUser(username, email, password, latitude, longitude, language);
    return insert;
}