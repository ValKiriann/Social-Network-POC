const usersRepository = require('../repositories/users.repository.js');

exports.createNorthernUser = (username, email, password, lat, lon) => {
    //TODO: hash the password
    //TODO: check if user already exists!!
    return usersRepository.createNorthernUser(username, email, password, lat, lon)
        .then((insertedId) => {
            //TODO: return the inserted object (by calling get method)
            console.info('[FINISHED] Creating user');
            return insertedId;
        })
        .catch((error) => {
            console.error(`[ERROR] ${error.code} - ${error.message}`)
            throw({
                statusCode: 500,
                errorCode: "Internal Error",
                errorData: "Contact administrator"
            })
        })
}

exports.createSouthernUser = (params) => { 
    return new Promise((resolve, reject) => {
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
                reject({
                    statusCode: 400,
                    errorCode: "Invalid params",
                    errorData: "The coordinates are not valid"
                });
            }
        }, 700);
    });
};