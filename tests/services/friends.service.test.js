const friendsService = require('../../services/friends.service');
const friendsRepository = require('../../repositories/friends.repository');
jest.mock('../../repositories/base.repository');
jest.mock('../../repositories/friends.repository');
//Mocking the logging system
console.error = jest.fn();
console.info = jest.fn();
const userId = 1;
const friendsIdsRaw = [
    {
        requester_user_id: 11,
        requested_user_id: 1
    },
    {
        requester_user_id: 16,
        requested_user_id: 1
    },
    {
        requester_user_id: 1,
        requested_user_id: 5
    }
]
const friendsIdsClean = [11, 16, 5];
const errors = {
    internalError: {
        statusCode: 500,
        errorCode: "Internal Error",
        errorData: "Contact administrator"
    },
}

describe('Get Friends Ids Test', () => {
    test('The service recieves a userId to search for its friends ids', () => {
        friendsRepository.getFriends.mockResolvedValueOnce(Promise.resolve(friendsIdsRaw));
        return expect(friendsService.getFriendsIds(userId)).resolves.toEqual(friendsIdsClean);
    });
    test('No friends found', () => {
        friendsRepository.getFriends.mockResolvedValueOnce(Promise.resolve([]));
        return expect(friendsService.getFriendsIds(userId)).resolves.toEqual([])
    });
    test('Internal error', () => {
        friendsRepository.getFriends.mockResolvedValueOnce(Promise.reject(new Error('something happened')));
        return expect(friendsService.getFriendsIds(userId)).rejects.toEqual(errors.internalError)
    });
});