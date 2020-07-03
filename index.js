require("dotenv").config();

const express = require("express");
const app = express();
const mongojs = require("mongojs");
const puppeteer = require("puppeteer");

const collections = ["searches"];
const db = mongojs(
  process.env.MONGODB_URI || "localhost:27017/reactreadinglist",
  collections
);

db.on("error", function (error) {
  console.log("Database Error:", error);
});

const searchCity = "sacramento";
const searchDistance = "250";
const postalCode = "95648";
const minPrice = "20";
const url = `https://${searchCity}.craigslist.org/search/sss`;
let searchUrl = "";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const getItemsFromListings = async (searchKey) => {
  searchUrl = `${url}?query=${encodeURI(
    searchKey
  )}&sort=rel&srchType=T&postedToday=1&min_price=${minPrice}&search_distance=${searchDistance}&postal=${postalCode}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let items;
  try {
    await page.goto(searchUrl);
    items = await page.evaluate(() => {
      return [...document.querySelectorAll("li.result-row")].map((elem) => {
        return {
          price: elem.querySelector(".result-price").textContent,
          id: elem.getAttribute("data-pid"),
          url: elem.querySelector("a.result-image.gallery").href,
          title: elem.querySelector(".result-title").textContent,
        };
      });
    });
  } catch (err) {
    console.log("error", err);
  }
  return items;
};

const sendSms = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTO_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: `get on it! ${searchUrl}`,
      from: "+12282854680",
      to: "+15034654039",
    })
    .then((message) => console.log("sent sms " + message.sid))
    .done();
};

const isInDatabase = (searchKey, results) => {
  return new Promise((resolve, reject) => {
    db.searches.findOne({ searchKey: searchKey }, (err, res) => {
      if (err) {
        reject(err);
      }
      if (res) {
        if (JSON.stringify(results) === JSON.stringify(res.results)) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
};

app.post("/look-for-it", async (req, res) => {
  console.log(req.body.searchKey);
  const searchKey = req.body.searchKey;
  const resultsFromListingsService = await getItemsFromListings(searchKey);
  // if not found, don't bother checking db/instering/texting

  if (!resultsFromListingsService.length) {
    return res.json({ status: "NONE_FOUND" });
  }
  const doesExistInDatabase = isInDatabase(
    searchKey,
    resultsFromListingsService
  ).then((res) => {
    if (!res) {
      // console.log("it is not in the database! sms and insert");
      db.searches.updateOne(
        { searchKey: searchKey }, // Filter
        { $set: { results: resultsFromListingsService } }, // Update
        { upsert: true }
      );
      sendSms();
    }
  });
  res.json({ status: "PROCESSED" });
});

app.listen(3000, function () {
  console.log("App running on port 3000!");
});
