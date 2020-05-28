const friendsRepository = require('../repositories/friends.repository');
const errorUtils = require('../utils/error.utils.js');

exports.getFriendsIds = async (userId) => {
    return friendsRepository.getFriends(userId)
        .then((friendsList) => {
            let friends = [];
            if(friendsList.length == 0) {
                return friendsList
            }
            //object.values makes an array from the values of an object
            //we concat every friendship to have all the friends with the userId
            for (let i=0; i < friendsList.length; i++) {
                friends = friends.concat(Object.values(friendsList[i]));
            }
            let removeUserId;
            // remove the userId from the result array to get only the friends ids
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