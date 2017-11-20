var mongoClient = require('mongodb');
var config = require('./config.json');
var urlGetter = require('./url');
var hasher = require('./hasher');

var checkUsername = async function(username){
    
    var query = {
        "username": username
    };
    var result, database;
    
    
    await mongoClient.connect(urlGetter.getURL(config.address, config.port, config.database))
    .then(db => {
        database = db;
        return db.collection("users");
    })
    .then(coll => {
        return coll.findOne(query);
    })
    .then(r => {
        if(r === null)
        result = true;
        else
        result = false;
        database.close();
    })
    .catch(err => {
        database.close();
        throw err;
    });
    return result;
};

var register = function(username, password, email){
    var userdocument = {
        "username" : username,
        "password" : hasher.hash(password, "sha256"),
        "profile" : null,
        "role" : 1,
        "tenders" : []
    }
    checkUsername(username).then( result => {
        if(result){
            mongoClient.connect(urlGetter.getURL(config.address, config.port, config.database), function(err, db){
                if(err)
                throw err;
                db.collection("users", function(err, coll){
                    if(err)
                    throw err;
                    coll.insertOne(userdocument);
                });
                db.close();
            });
        } else {
            throw new Error("Error: Username already in use.");
        }
        
    })
    .catch(err => {
        console.error(err);
        //TODO proper error
    });
};

module.exports = (function(){
    return {
        regUser: function(username, password, email){
            register(username, password, email);
        }
    };
})();