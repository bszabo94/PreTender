/**
 * Executes insert operations on a MongoDB.
 * @param {Array} Newdocuments An Array of the documents to be inserted into the database.
 * @param {string} dbUrl The URL of the database.
 * @param {string} collection The collection on which the operation is executed.
 * @returns The result of the database operation.
 * @version 0.9
 */
module.exports = async function(newDocuments, dbUrl, collection){
    var MongoClient = require('mongodb').MongoClient,
        result, database;

    if(!Array.isArray(newDocuments)){
        throw new Error("Insert requires an array of objects!");
    };
    
    await MongoClient.connect(dbUrl)
    .then(db => {
        database = db;
        return db.collection(collection);
    })
    .then(coll => {
        return coll.insertMany(newDocuments);
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