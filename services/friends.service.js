const friendsRepository = require('../repositories/friends.repository');
const errorUtils = require('../utils/error.utils.js');

exports.getFriendsIds = async (userId) => {
    //TODO: explaing this in detail
    return friendsRepository.getFriends(userId)
        .then((friendsList) => {
            let friends = [];
            if(friendsList.length == 0) {
                return friendsList
            }
            for (let i=0; i < friendsList.length; i++) {
                friends = friends.concat(Object.values(friendsList[i]));
            }
            let removeUserId;
            while((removeUserId = friends.indexOf(Number(userId))) > -1) {
                friends.splice(removeUserId, 1);
            }
            return friends
        })
        .catch((error) => {
            //TODO: check this atomic error processing
            throw errorUtils.processError(error)
        })  
};