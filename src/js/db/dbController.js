module.exports = (function () {
    var database, port, address, isSet = false;
    var dbQuery = require('./components/dbQuery'),
        dbInsert = require('./components/dbInsert'),
        dbUpdate = require('./components/dbUpdate'),
        dbDelete = require('./components/dbDelete');

    var checkSetting = function(){
        if(!isSet)
            throw new Error("Initialize the database controller first!");
    };

    var checkOrder = function(order){
        if( !order.hasOwnProperty('command') ||
            !order.hasOwnProperty('collection') ||
            !order.hasOwnProperty('parameters') )
                throw new Error("Invalid order, fields missing.");
    }

    var getUrl = function(){
        checkSetting();

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
            checkSetting();
            address = addr;
        },

        setPort: function(prt){
            checkSetting();
            port = prt;
        },

        setDatabase: function(db){
            checkSetting();
            database = db;
        },

        execute: async function(order){
            checkOrder(order);

            var result;

            switch(order.command){
                case "insert":
                    await dbInsert(order.parameters,getUrl(),order.collection.toString())
                    .then(r => {
                        result = r;
                    });
                    break;

                case "query":
                    await dbQuery(order.parameters,getUrl(),order.collection.toString())
                    .then(r => {
                        result = r;
                    });
                    break;
                
                case "delete":
                    await dbDelete(order.parameters,getUrl(),order.collection.toString())
                    .then(r => {
                        result = r;
                    });
                    break;
                
                case "update":
                    await dbUpdate(order.parameters.filter, order.parameters.value,
                                    getUrl(),order.collection.toString())
                    .then(r => {
                        result = r;
                    });
                    break;
                
                default:
                    throw new Error("Unknown command for database controller: " +
                                    command.toString() + ".");
            }

            return result;

        }
    };
})();