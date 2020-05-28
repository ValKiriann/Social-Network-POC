const friendsService = require('../services/friends.service');
const usersService = require('../services/users.service');

exports.getFriendsList = async (userId) => {
    if(!userId || isNaN(userId)) {
        //TODO: search it in third party api --when no results found
        throw({
            statusCode: 400,
            errorCode: "Invalid params",
            errorData: "One or more required params are missing"
        })
    }
    let friendsIds = await friendsService.getFriendsIds(userId);
    if(friendsIds.length == 0) {
        return friendsIds
    }
    return usersService.getUsersByIdList(friendsIds.join());
}