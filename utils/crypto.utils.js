const crypto = require('crypto');

exports.hashStringMD5 = (string) => {
    let cryptoHasher = crypto.createHash('md5');
    return cryptoHasher.update(string).digest('hex');
};