const usersRepository = require('../repositories/users.repository.js');

exports.getUserDetails = (userId) => {
    return usersRepository.getUserDetails(userId)
        .then((userDetails) => {
            if(!userDetails) {
                throw({
                    statusCode: 404,
                    errorCode: "User not found",
                    errorData: "No user found"
                });
            }
            return userDetails;
        })
        .catch((error) => {
            if(error.statusCode && error.statusCode == 404) {
                console.error(`[ERROR] No user found for ${userId} id filter`)
                throw error;
            }
            if(error.code && error.message) {
                console.error(`[ERROR] ${error.code} - ${error.message}`)
            } else { console.error(`[ERROR] ${error}`) }
            throw({
                statusCode: 500,
                errorCode: "Internal Error",
                errorData: "Contact administrator"
            })
        })
};

exports.createNorthernUser = (username, email, password, latitude, longitude, language) => {
    //TODO: hash the password
    //TODO: check if user already exists!!
    return usersRepository.createNorthernUser(username, email, password, latitude, longitude, language)
        //TODO: return the inserted object (by calling get method)
        .catch((error) => {
            if(error.code && error.message) {
                console.error(`[ERROR] ${error.code} - ${error.message}`)
            } else { console.error(`[ERROR] ${error}`) }
            throw({
                statusCode: 500,
                errorCode: "Internal Error",
                errorData: "Contact administrator"
            })
        })
};

exports.createSouthernUser = (params) => { 
    return new Promise((resolve, reject) => {
        console.info('[STARTING] Creating Southern user');
        setTimeout(() => { resolve(); }, 1000);
    });
};

exports.calculateHemisphere = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (latitude >= 0 && latitude <= 90
                && longitude >= -180 && longitude <= 180) {
                resolve('N');
            } else if (latitude < 0 && latitude >= -90
                && longitude >= -180 && longitude <= 180){
                resolve('S');
            } else {
                console.error(`[ERROR] Invalid coordinates`);
                reject({
                    statusCode: 400,
                    errorCode: "Invalid params",
                    errorData: "The coordinates are not valid"
                });
            }
        }, 700);
    });
};