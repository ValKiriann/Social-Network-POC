const usersService = require('../../services/users.service');
const usersRepository = require('../../repositories/users.repository');
jest.mock('../../repositories/base.repository');
jest.mock('../../repositories/users.repository');
//Mocking the logging system
console.error = jest.fn();
console.info = jest.fn();
const userId = 1;
const username = "john_doe";
const email = "johndoe1@gmail.com";
const password = "banana";
const latitude = 20;
const longitude = 20;
const language = "ES";
const userDetails = {
    username:"ann_eav",
    id:userId,
    lat:22,
    lon:30,
    created_at: new Date(25,5,2020),
    updated_at: new Date(25,5,2020),
    deleted_at:null
};
const errors = {
    notFound: {
        statusCode: 404,
        errorCode: "User not found",
        errorData: "No user found"
    },
    internalError: {
        statusCode: 500,
        errorCode: "Internal Error",
        errorData: "Contact administrator"
    },
    invalidCoordinates: {
        statusCode: 400,
        errorCode: "Invalid params",
        errorData: "The coordinates are not valid"
    }
}

describe('Get User Details Test', () => {
    test('The service recieves a userId without filters to search for a user', () => {
        usersRepository.getUsers.mockResolvedValueOnce(Promise.resolve([userDetails]));
        return expect(usersService.getUserDetails(userId)).resolves.toEqual(userDetails);
    });
    test('No user found', () => {
        usersRepository.getUsers.mockResolvedValueOnce(Promise.resolve(undefined));
        return expect(usersService.getUserDetails(userId)).rejects.toEqual(errors.notFound)
    });
    test('Internal error', () => {
        usersRepository.getUsers.mockResolvedValueOnce(Promise.reject(new Error('something happened')));
        return expect(usersService.getUserDetails(userId)).rejects.toEqual(errors.internalError)
    });
});

describe('Get User By Email Test', () => {
    test('The service recieves an email to check - Registered', () => {
        usersRepository.getUsers.mockResolvedValueOnce(Promise.resolve([userDetails]));
        return expect(usersService.getUserbyEmail(userId)).resolves.toEqual(true);
    });
    test('The service recieves an email to check - Unregistered', () => {
        usersRepository.getUsers.mockResolvedValueOnce(Promise.resolve(undefined));
        return expect(usersService.getUserbyEmail(userId)).resolves.toEqual(false)
    });
    test('Internal error', () => {
        usersRepository.getUsers.mockResolvedValueOnce(Promise.reject(new Error('something happened')));
        return expect(usersService.getUserbyEmail(userId)).rejects.toEqual(errors.internalError)
    });
});

describe('Create Northern User Test', () => {
    test('The service recieves user details to create a new record', () => {
        usersRepository.createNorthernUser.mockResolvedValueOnce(Promise.resolve(userId));
        usersRepository.getUsers.mockResolvedValueOnce(Promise.resolve([userDetails]));
        return expect(usersService.createNorthernUser(username, email, password, latitude, longitude, language))
            .resolves.toEqual(userDetails);
    });
    test('Internal error', () => {
        usersRepository.createNorthernUser.mockResolvedValueOnce(Promise.resolve(userId));
        usersRepository.getUsers.mockResolvedValueOnce(Promise.reject(new Error('something happened')));
        return expect(usersService.createNorthernUser(username, email, password, latitude, longitude, language))
            .rejects.toEqual(errors.internalError)
    });
});

describe('Calculate Hemisphere', () => {
    test('The service recieves coordinates to identify the hemisphere - N', () => {
        return expect(usersService.calculateHemisphere(20,20))
            .resolves.toEqual("N");
    });
    test('The service recieves coordinates to identify the hemisphere - S', () => {
        return expect(usersService.calculateHemisphere(-20,20))
            .resolves.toEqual("S");
    });
    test('Invalid coordinates', () => {
        return expect(usersService.calculateHemisphere(-200,200))
            .rejects.toEqual(errors.invalidCoordinates);
    });
});