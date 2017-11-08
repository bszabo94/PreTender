module.exports = (function () {
    var database, port, address, isSet = false;
    var dbQuery = require('./components/dbQuery'),
        dbInsert = require('./components/dbInsert'),
        dbUpdate = require('./components/dbUpdate'),
        dbDelete = require('./components/dbDelete');

    var checkSet = function(){
        if(!isSet)
            throw new Error("Initialize the database controller first!");
    };

    var getUrl = function(){
        checkSet();

        return "mongodb://" + address.toString() + ":"
        + port.toString() + "/"
        + database.toString(); 
    };

    return {

        init: function(addr, prt, db){
            if(arguments.length != 3)
                throw new Error("Initilaize the database controller with all attributes!");

            database = db;
            port = prt;
            address = addr;
            isSet = true;
        },

        setAddress: function(addr){
            checkSet();
            address = addr;
        },

        setPort: function(prt){
            checkSet();
            port = prt;
        },

        setDatabase: function(db){
            checkSet();
            database = db;
        },

        execute: async function(order){
            var result;

            if(!order.hasOwnProperty('command'))
                throw new Error("Invalid order, no command found.");

            switch(order.command){
                case "insert":
                    //TODO
                    break;

                case "query":
                    await dbQuery(order.parameters,getUrl(),order.collection.toString())
                    .then(r => {
                        result = r;
                    });
                    break;
                
                case "delete":
                    //TODO
                    break;
                
                case "update":
                    //TODO
                    break;
                
                default:
                    throw new Error("Unknown command for database controller: " +
                                    command.toString() + ".");
            }

            return result;

        }
    };
})();