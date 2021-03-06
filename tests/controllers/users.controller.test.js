const usersController = require('../../controllers/users.controller');
const usersService = require('../../services/users.service');
jest.mock('../../services/users.service');
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
}
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
    },
    invalidParams: {
        statusCode: 400,
        errorCode: "Invalid params",
        errorData: "One or more required params are missing"
    },
    invalidPassword: {
        statusCode: 400,
        errorCode: "Invalid params",
        errorData: "Entered passwords don't match"
    },
    alreadyRegistered: {
        statusCode: 400,
        errorCode: "Already registered",
        errorData: "Email is already in use"
    }
}

describe('Get User Details Test', () => {
    test('The service recieves a userId without filters to search for a user', () => {
        usersService.getUserDetails.mockResolvedValueOnce(Promise.resolve(userDetails))
        return expect(usersController.getUserDetails(userId)).resolves.toEqual(userDetails);
    });
    test('Invalid userId', () => {
        return expect(usersController.getUserDetails(0)).rejects.toEqual(errors.invalidParams)
    });
    test('No user found', () => {
        usersService.getUserDetails.mockResolvedValueOnce(Promise.reject(errors.notFound));
        return expect(usersController.getUserDetails(userId)).rejects.toEqual(errors.notFound)
    });
    test('Internal error', () => {
        usersService.getUserDetails.mockResolvedValueOnce(Promise.reject(errors.internalError));
        return expect(usersController.getUserDetails(userId)).rejects.toEqual(errors.internalError)
    });
});

describe('Create a user', () => {
    test('Missing params', () => {
        return expect(usersController.createUser({})).rejects.toEqual(errors.invalidParams)
    });
    test("Passwords don't match", () => {
        return expect(usersController.createUser({username, email, password, password2:"something", latitude, longitude, language}))
            .rejects.toEqual(errors.invalidPassword)
    });
    test("Invalid coordinates", () => {
        usersService.calculateHemisphere.mockResolvedValueOnce(Promise.reject(errors.invalidCoordinates));
        return expect(usersController.createUser({username, email, password, password2:password, latitude, longitude, language}))
            .rejects.toEqual(errors.invalidCoordinates)
    });
    test("User already registered", () => {
        usersService.calculateHemisphere.mockResolvedValueOnce(Promise.resolve("N"));
        usersService.getUserbyEmail.mockResolvedValueOnce(Promise.resolve(true));
        return expect(usersController.createUser({username, email, password, password2:password, latitude, longitude, language}))
            .rejects.toEqual(errors.alreadyRegistered)
    });
    test("The controller receives the information to create a Northern user", () => {
        usersService.calculateHemisphere.mockResolvedValueOnce(Promise.resolve("N"));
        usersService.getUserbyEmail.mockResolvedValueOnce(Promise.resolve(false));
        usersService.createNorthernUser.mockResolvedValueOnce(userDetails)
        return expect(usersController.createUser({username, email, password, password2:password, latitude, longitude, language}))
            .resolves.toEqual(userDetails)
    });
    test("The controller receives the information to create a Southern user", () => {
        usersService.calculateHemisphere.mockResolvedValueOnce(Promise.resolve("S"));
        usersService.getUserbyEmail.mockResolvedValueOnce(Promise.resolve(false));
        usersService.createSouthernUser.mockResolvedValueOnce(userDetails)
        return expect(usersController.createUser({username, email, password, password2:password, latitude, longitude, language}))
            .resolves.toEqual(userDetails)
    });
    test('Internal error', () => {
        usersService.calculateHemisphere.mockResolvedValueOnce(Promise.resolve("S"));
        usersService.getUserbyEmail.mockResolvedValueOnce(Promise.reject(errors.internalError));
        return expect(usersController.createUser({username, email, password, password2:password, latitude, longitude, language})).rejects.toEqual(errors.internalError)
    });
});

describe('Update a user', () => {
    test('Invalid userId', () => {
        return expect(usersController.updateUserDetails(0, {})).rejects.toEqual(errors.invalidParams)
    });
    test('Missing body', () => {
        usersService.findValidUpdateValuesSync.mockReturnValue([]);
        return expect(usersController.updateUserDetails(userId,{})).rejects.toEqual(errors.invalidParams)
    });
    test('Body with invalid params', () => {
        usersService.findValidUpdateValuesSync.mockReturnValue([]);
        return expect(usersController.updateUserDetails(userId,{ hello: "world" })).rejects.toEqual(errors.invalidParams)
    });
    test('Body with valid params', () => {
        usersService.findValidUpdateValuesSync.mockReturnValue([['username', username]]);
        usersService.updateUserDetails.mockResolvedValueOnce(Promise.resolve('updated'));
        usersService.getUserDetails.mockResolvedValueOnce(Promise.resolve(userDetails))
        return expect(usersController.updateUserDetails(userId,{username})).resolves.toEqual(userDetails)
    });
    test('Internal error', () => {
        usersService.findValidUpdateValuesSync.mockReturnValue([['username', username]]);
        usersService.updateUserDetails.mockResolvedValueOnce(Promise.reject(errors.internalError));
        return expect(usersController.updateUserDetails(userId,{username})).rejects.toEqual(errors.internalError)
    });
});

describe('Delete a user', () => {
    test('Invalid userId', () => {
        return expect(usersController.deleteUser(0)).rejects.toEqual(errors.invalidParams)
    });
    test('Body with valid params', () => {
        usersService.updateUserDetails.mockResolvedValueOnce(Promise.resolve('updated'));
        usersService.getUserDetails.mockResolvedValueOnce(Promise.resolve(userDetails))
        return expect(usersController.deleteUser(userId)).resolves.toEqual(userDetails)
    });
    test('Internal error', () => {
        usersService.updateUserDetails.mockResolvedValueOnce(Promise.reject(errors.internalError));
        return expect(usersController.deleteUser(userId)).rejects.toEqual(errors.internalError)
    });
});