var validAlgorithms = ["sha256", "md5"];
const INPUT_ENCODING = "utf-8";
const DIGEST_ENCODING = "base64";

var createHash = function(text, algorithm){
    var crypto = require('crypto');
    var hash = crypto.createHash(algorithm);
    return hash.update(text, INPUT_ENCODING).digest(DIGEST_ENCODING);
};

module.exports = {
    hash: function(text, algorithm){
        if(!validAlgorithms.includes(algorithm)){
            throw new Error("Unknown algorithm: " + algorithm.toString() + ".");
        }
        return createHash(text, algorithm);
    }
};