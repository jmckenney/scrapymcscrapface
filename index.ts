const express = require("express");
const app = express();
const db = require("./storage/storage.js");
// const notification = require("./notification/notification.js");
const crawler = require("./crawler/getItemsFromCl.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Hello, let's find it together.`);
});

app.get("/db", async (req, res) => {
  const db = await db.getAllEntries();
  res.json(db);
});

app.get("/look-for-it", async (req, res) => {
  const searchKey = req.query.searchKey;
  const { items, searchUrl } = await crawler.getItemsFromCl(searchKey);

  // if not found, don't bother checking db/instering/texting
  if (!items.length) {
    return res.json({ status: "NONE_FOUND" });
  }
  const isInDatabase = await db.isInDatabase(searchKey, items);
  if (isInDatabase) {
    notification.sendSms(searchUrl);
    await db.saveSearchResults(searchKey, results);
  }
  res.send(JSON.stringify(items));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Hello world listening on port", port);
});
