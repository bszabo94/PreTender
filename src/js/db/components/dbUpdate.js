/**
 * Executes update operations on a MongoDB.
 * @param {Object} filter An object of field:value expressions to filter the documents.
 * @param {Object} newData An object of field:value expressions of the fields and their values to be replaced.
 * @param {string} dbUrl The URL of the database.
 * @param {string} collection The collection on which the operation is executed.
 * @returns The result of the database operation.
 * @version 0.9
 */
module.exports = async function(filter, newData, dbUrl, collection){
    var MongoClient = require('mongodb').MongoClient,
        result, database;
    
    await MongoClient.connect(dbUrl)
    .then(db => {
        database = db;
        return db.collection(collection);
    })
    .then(coll => {
        return coll.updateMany(filter, newData);
    })
    .then(res => {
        result = res;
        database.close();
    })
    .catch(err => {
        database.close();
        throw err;
    });

    return result;
};