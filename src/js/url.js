const PROTOCOL = "mongodb://";

module.exports = {
    getURL: function(address, port, database){
        return PROTOCOL + address.toString() + ":" + port.toString() + "/" + database.toString(); 
    }
};