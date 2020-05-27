const usersRepository = require('../repositories/users.repository.js');

exports.getUserDetails = (userId, deleted = false) => {
    return usersRepository.getUsers([['id', userId]], deleted, 1)
        .then((userDetails) => {
            if(userDetails.length == 0) {
                throw({
                    statusCode: 404,
                    errorCode: "User not found",
                    errorData: "No user found"
                });
            }
            return userDetails[0];
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

exports.getUserbyEmail = (email) => {
    return usersRepository.getUsers([['email', email]], 'false', 1)
        .then((userDetails) => {
            if(!userDetails) {
                return false
            }
            return true
        })
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
}

exports.createNorthernUser = async (username, email, password, latitude, longitude, language) => {
    //TODO: hash the password
    return usersRepository.createNorthernUser(username, email, password, latitude, longitude, language)
        .then((userId) => {
            console.info('[FINISHED] Northern User Created');
            return this.getUserDetails(userId)
        })
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

exports.createSouthernUser = (username, email, password, latitude, longitude, language) => { 
    return new Promise((resolve, reject) => {
        console.info('[STARTING] Creating Southern user');
        // ASSUMPTIONS: we want our API to be consistent, we should return THE SAME as if we are storing the user ourserlfs
        setTimeout(() => { 
            console.info('[FINISHED] Southern User Created');
            resolve({
                username,
                email,
                latitude,
                longitude,
                language,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            }); 
        }, 1000);
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

exports.findValidUpdateValuesSync = (params) => {
    let allowedValues = ['username', 'email', 'latitude', 'longitude', 'language']
    let updateValues = [];
    for (let i = 0; i < allowedValues.length; i++) {
        if (params.hasOwnProperty(allowedValues[i])) {
            updateValues.push([allowedValues[i], params[allowedValues[i]]])
        }
    }
    return updateValues;
};

exports.updateUserDetails = (userId, updateValues) => {
    return usersRepository.updateUserDetails(userId, updateValues)
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