const fs = require("fs");

const dbFile = "storage/filedb.txt";

const getAllEntries = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbFile, "utf8", function (err, data) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

const getValue = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fullDb = await getAllEntries();
      resolve(fullDb[key]);
    } catch (error) {
      console.debug("failure getting db value", error);
      reject(error);
    }
  });
};

const isInDatabase = async (searchKey, results) => {
  const searchResultsInDb = await getValue(searchKey);
  return (
    !!searchResultsInDb &&
    JSON.stringify(searchResultsInDb) === JSON.stringify(results)
  );
};

const saveSearchResults = (key, searchResults) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getAllEntries();
      db[key] = searchResults;
      fs.writeFile(dbFile, JSON.stringify(db), function (err) {
        if (err) {
          console.error(err);
        }
        resolve("wrote to db");
      });
    } catch (error) {
      console.error("wasn't able to write file", error);
      reject("wasn't able to save findings to db");
    }
  });
};

module.exports = {
  isInDatabase,
  saveSearchResults,
  getAllEntries,
};
