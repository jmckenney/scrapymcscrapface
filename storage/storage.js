var fs = require("fs");
var dbFile = "storage/filedb.txt";
var getAllEntries = function () {
    return new Promise(function (resolve, reject) {
        fs.readFile(dbFile, "utf8", function (err, data) {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
};
var getValue = function (key) {
    return new Promise(async(resolve, reject));
};
{
    try {
        var fullDb = await, getAllEntries_1 = ();
        resolve(fullDb[key]);
    }
    catch (error) {
        console.debug("failure getting db value", error);
        reject(error);
    }
}
;
;
var isInDatabase = async(searchKey, results);
{
    var searchResultsInDb = await, getValue_1 = (searchKey);
    return (!!searchResultsInDb &&
        JSON.stringify(searchResultsInDb) === JSON.stringify(results));
}
;
var saveSearchResults = function (key, searchResults) {
    return new Promise(async(resolve, reject));
};
{
    try {
        var db = await, getAllEntries_2 = ();
        db[key] = searchResults;
        fs.writeFile(dbFile, JSON.stringify(db), function (err) {
            if (err) {
                console.error(err);
            }
            resolve("wrote to db");
        });
    }
    catch (error) {
        console.error("wasn't able to write file", error);
        reject("wasn't able to save findings to db");
    }
}
;
;
module.exports = {
    isInDatabase: isInDatabase,
    saveSearchResults: saveSearchResults,
    getAllEntries: getAllEntries
};
