const friendsController = require('../../controllers/friends.controller');
const friendsService = require('../../services/friends.service');
const usersService = require('../../services/users.service');
jest.mock('../../services/friends.service');
jest.mock('../../services/users.service');
jest.mock('../../repositories/base.repository');
jest.mock('../../repositories/users.repository');
//Mocking the logging system
console.error = jest.fn();
console.info = jest.fn();
const userId = 1;
const userDetails = {
    username:"ann_eav",
    id:userId,
    lat:22,
    lon:30,
    created_at: new Date(25,5,2020),
    updated_at: new Date(25,5,2020),
    deleted_at:null
}
const friendsIds = [11, 16, 5];
const errors = {
    internalError: {
        statusCode: 500,
        errorCode: "Internal Error",
        errorData: "Contact administrator"
    },
    invalidParams: {
        statusCode: 400,
        errorCode: "Invalid params",
        errorData: "One or more required params are missing"
    },
}

describe('Get Friends List Test', () => {
    test('Invalid userId', () => {
        return expect(friendsController.getFriendsList(0)).rejects.toEqual(errors.invalidParams)
    });
    test('The service recieves a userId to return its friends list', () => {
        friendsService.getFriendsIds.mockResolvedValueOnce(Promise.resolve(friendsIds));
        usersService.getUsersByIdList.mockResolvedValueOnce(Promise.resolve([userDetails, userDetails]));
        return expect(friendsController.getFriendsList(userId)).resolves.toEqual([userDetails, userDetails]);
    });
    test('No friends found', () => {
        friendsService.getFriendsIds.mockResolvedValueOnce(Promise.resolve([]));
        return expect(friendsController.getFriendsList(userId)).resolves.toEqual([]);
    });
    test('Internal error', () => {
        friendsService.getFriendsIds.mockResolvedValueOnce(Promise.reject(errors.internalError))
        return expect(friendsController.getFriendsList(userId)).rejects.toEqual(errors.internalError)
    });
});